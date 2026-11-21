import 'server-only';

import { database } from '@/lib/supabase/server';

export async function getGuestbookEntries(limit?: number) {
  let query = database().from('guestbook_entries')
    .select('id, body, created_at, family_members!inner(name)')
    .order('created_at', { ascending: false }).order('id', { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return data.map(entry => ({
    id: entry.id, body: entry.body, createdAt: entry.created_at,
    author: entry.family_members.name,
  }));
}

export async function addGuestbookEntry(memberId: string, body: string) {
  const { error } = await database().from('guestbook_entries').insert({ member_id: memberId, body });
  if (error) throw error;
}
