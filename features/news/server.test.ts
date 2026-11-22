import { beforeEach, expect, test, vi } from 'vitest';
import type { News } from './types';

const state = vi.hoisted(() => ({
  rows: {} as Record<string, unknown[]>,
  upsert: vi.fn(async () => ({ error: null })),
  readers: [] as string[],
}));
vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/server', () => ({ database: () => ({
  from: (table: string) => ({
    select: () => ({
      neq: async () => ({ data: state.rows[table] ?? [], error: null }),
      eq: async (_column: string, member: string) => {
        state.readers.push(member);
        return { data: member === 'reader' ? state.rows[table] ?? [] : [], error: null };
      },
    }),
    upsert: state.upsert,
  }),
}) }));
import { getUnreadNews, recordNewsReads } from './server';
const id = '1d90fa45-3695-5e11-aedc-ce4d7e1c1d01';
const card: News = { id, kind: 'travel', author: '여행 정보', title: '오사카성', body: '여행 정보 본문', createdAt: '2026-11-22T10:00:00+09:00' };
beforeEach(() => { state.rows = {}; state.readers = []; state.upsert.mockClear(); });

test('여행 정보 읽음은 해당 구성원과 종류에만 적용한다', async () => {
  state.rows.news_reads = [{ kind: 'travel', news_id: id }];
  state.rows.guestbook_entries = [{ id, member_id: 'writer', body: '가족 이야기', created_at: '2026-11-22T00:00:00Z', family_members: { name: '가족' } }];
  expect((await getUnreadNews('reader', [card])).map(row => row.kind)).toEqual(['guestbook']);
  expect((await getUnreadNews('other', [card])).map(row => row.kind)).toEqual(['travel', 'guestbook']);
  expect(state.readers).toEqual(['reader', 'other']);
});

test('DB의 UTC 시각과 카드의 한국 시각을 실제 시간순으로 합친다', async () => {
  state.rows.guestbook_entries = [{ id: 'post', body: '더 나중 글', created_at: '2026-11-22T02:00:00Z', family_members: { name: '가족' } }];
  expect((await getUnreadNews('reader', [card])).map(row => row.id)).toEqual(['post', id]);
});

test('등록되지 않은 여행 정보의 읽음 요청은 저장하지 않는다', async () => {
  await expect(recordNewsReads('reader', [{ kind: 'travel', id }], [])).rejects.toThrow('등록되지 않은');
  expect(state.upsert).not.toHaveBeenCalled();
  await recordNewsReads('reader', [{ kind: 'travel', id }], [id]);
  expect(state.upsert).toHaveBeenCalledWith([{ member_id: 'reader', kind: 'travel', news_id: id }], expect.objectContaining({ ignoreDuplicates: true }));
});
