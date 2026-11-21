import { beforeEach, expect, test, vi } from 'vitest';
import { writeGuestbookCommentAction } from './actions';
import { getCurrentMember } from '@/features/family-login/server';
import { addGuestbookComment } from '@/features/guestbook/server';
import { revalidatePath } from 'next/cache';

vi.mock('@/features/family-login/server', () => ({ getCurrentMember: vi.fn(), signInFamily: vi.fn(), signOutFamily: vi.fn() }));
vi.mock('@/features/guestbook/server', () => ({ addGuestbookComment: vi.fn(), addGuestbookEntry: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

const initial = { error: '', saved: false };
const form = (body: string) => { const value = new FormData(); value.set('body', body); return value; };
beforeEach(() => { vi.resetAllMocks(); });

test('로그인하지 않은 요청은 댓글을 저장하지 않는다', async () => {
  vi.mocked(getCurrentMember).mockResolvedValue(null);
  expect((await writeGuestbookCommentAction('entry-1', initial, form('댓글'))).saved).toBe(false);
  expect(addGuestbookComment).not.toHaveBeenCalled();
});

test('클라이언트가 다른 작성자를 보내도 로그인한 구성원으로 해당 글에만 저장한다', async () => {
  vi.mocked(getCurrentMember).mockResolvedValue({ id: 'signed-in-member', name: '김영욱' });
  const data = form('  함께 가요!  ');
  data.set('member_id', 'someone-else');
  expect(await writeGuestbookCommentAction('entry-2', initial, data)).toEqual({ error: '', saved: true });
  expect(addGuestbookComment).toHaveBeenCalledExactlyOnceWith('signed-in-member', 'entry-2', '함께 가요!');
  expect(revalidatePath).toHaveBeenCalledWith('/guestbook');
});

test.each(['   ', '가'.repeat(501)])('빈 댓글과 500자를 넘는 댓글은 거절한다', async body => {
  expect((await writeGuestbookCommentAction('entry-1', initial, form(body))).saved).toBe(false);
  expect(addGuestbookComment).not.toHaveBeenCalled();
});

test('DB 저장에 실패하면 성공 처리하거나 목록을 갱신하지 않는다', async () => {
  vi.mocked(getCurrentMember).mockResolvedValue({ id: 'member', name: '김영욱' });
  vi.mocked(addGuestbookComment).mockRejectedValue(new Error('DB unavailable'));
  const result = await writeGuestbookCommentAction('entry-1', initial, form('남겨둘 댓글'));
  expect(result.saved).toBe(false);
  expect(result.error).toContain('다시 시도');
  expect(revalidatePath).not.toHaveBeenCalled();
});
