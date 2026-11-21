import 'server-only';

import { database } from '@/lib/supabase/server';

export async function getGuestbookEntries(limit?: number) {
  let query = database().from('guestbook_entries')
    .select('id, body, created_at, family_members!inner(name), guestbook_comments(id, body, created_at, family_members!inner(name))')
    .order('created_at', { ascending: false }).order('id', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return data.map(entry => ({
    id: entry.id, body: entry.body, createdAt: entry.created_at,
    author: entry.family_members.name,
    comments: entry.guestbook_comments
      .sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id))
      .map(comment => ({ id: comment.id, body: comment.body, createdAt: comment.created_at, author: comment.family_members.name })),
  }));
}

export async function addGuestbookComment(memberId: string, entryId: string, body: string) {
  const { error } = await database().from('guestbook_comments').insert({ member_id: memberId, entry_id: entryId, body });
  if (error) throw error;
}

export async function addGuestbookEntry(memberId: string, body: string) {
  const { error } = await database().from('guestbook_entries').insert({ member_id: memberId, body });
  if (error) throw error;
}
