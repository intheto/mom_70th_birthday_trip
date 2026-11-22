import 'server-only';
import { database } from '@/lib/supabase/server';
import type { News, ReadReceipt } from './types';

// 호출자는 서버에서 확인한 로그인 구성원의 ID만 전달한다.
export async function getUnreadNews(memberId: string, information: News[] = []): Promise<News[]> {
  const db = database();
  const [posts, opinions, reads] = await Promise.all([
    db.from('guestbook_entries').select('id, member_id, body, created_at, family_members!inner(name)').neq('member_id', memberId),
    db.from('preparation_comments').select('id, member_id, topic, body, created_at, family_members!inner(name)').neq('member_id', memberId),
    db.from('news_reads').select('kind, news_id').eq('member_id', memberId),
  ]);
  for (const result of [posts, opinions, reads]) if (result.error) throw result.error;
  const seen = new Set((reads.data ?? []).map(row => `${row.kind}:${row.news_id}`));
  return [
    ...information,
    ...(posts.data ?? []).map(row => ({ id: row.id, kind: 'guestbook' as const, author: row.family_members.name, body: row.body, createdAt: row.created_at })),
    ...(opinions.data ?? []).map(row => ({ id: row.id, kind: 'opinion' as const, author: row.family_members.name, body: row.body, createdAt: row.created_at, topic: row.topic })),
  ].filter(row => !seen.has(`${row.kind}:${row.id}`)).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.id.localeCompare(a.id));
}

export async function recordNewsReads(memberId: string, receipts: ReadReceipt[], travelIds: readonly string[] = []) {
  if (!Array.isArray(receipts) || receipts.length > 100 || receipts.some(row => !row || !['guestbook', 'opinion', 'travel'].includes(row.kind) || !/^[0-9a-f-]{36}$/i.test(row.id))) throw new Error('올바른 새 소식이 아닙니다.');
  const db = database();
  for (const kind of ['guestbook', 'opinion', 'travel'] as const) {
    const ids = receipts.filter(row => row.kind === kind).map(row => row.id);
    if (!ids.length) continue;
    if (kind === 'travel') {
      if (ids.some(id => !travelIds.includes(id))) throw new Error('등록되지 않은 여행 정보입니다.');
      const { error } = await db.from('news_reads').upsert(ids.map(id => ({ member_id: memberId, kind, news_id: id })), { onConflict: 'member_id,kind,news_id', ignoreDuplicates: true });
      if (error) throw error;
      continue;
    }
    const { data, error } = await db.from(kind === 'guestbook' ? 'guestbook_entries' : 'preparation_comments').select('id').in('id', ids);
    if (error) throw error;
    if (!data.length) continue;
    const result = await db.from('news_reads').upsert(data.map(row => ({ member_id: memberId, kind, news_id: row.id })), { onConflict: 'member_id,kind,news_id', ignoreDuplicates: true });
    if (result.error) throw result.error;
  }
}
