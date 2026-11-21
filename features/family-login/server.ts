import 'server-only';

import { createHash, randomBytes } from 'node:crypto';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { database } from '@/lib/supabase/server';
import { verifyFamilyPin } from './credentials';
import type { FamilyGroup, FamilyMember } from './types';

const cookieName = 'family-session';
const sessionSeconds = 30 * 24 * 60 * 60;
const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');

export async function hasFamilySessionCookie() {
  return (await cookies()).has(cookieName);
}

export async function getFamilyGroups(): Promise<FamilyGroup[]> {
  const { data, error } = await database().from('families')
    .select('label, family_members(name, sort_order)').order('sort_order');
  if (error) throw error;
  return data.map(family => ({
    label: family.label,
    members: family.family_members.sort((a, b) => a.sort_order - b.sort_order).map(member => member.name),
  }));
}

export async function signInFamily(name: string, pin: string): Promise<boolean> {
  if (!name || !/^[0-9]{4}$/.test(pin)) return false;
  const db = database();
  const { data: member, error: memberError } = await db.from('family_members')
    .select('id, family_id').eq('name', name).maybeSingle();
  if (memberError) throw memberError;
  if (!member) return false;
  const { data: family, error: familyError } = await db.from('families')
    .select('pin_hash').eq('id', member.family_id).single();
  if (familyError) throw familyError;
  if (!await verifyFamilyPin(pin, family.pin_hash)) return false;

  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + sessionSeconds * 1000);
  const { error } = await db.from('family_sessions').insert({
    token_hash: tokenHash(token), member_id: member.id, expires_at: expires.toISOString(),
  });
  if (error) throw error;
  (await cookies()).set(cookieName, token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: sessionSeconds, expires,
  });
  return true;
}

export const getCurrentMember = cache(async (): Promise<FamilyMember | null> => {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const db = database();
  const { data: session, error } = await db.from('family_sessions')
    .select('member_id').eq('token_hash', tokenHash(token))
    .gt('expires_at', new Date().toISOString()).maybeSingle();
  if (error) throw error;
  if (!session) return null;
  const { data: member, error: memberError } = await db.from('family_members')
    .select('id, name').eq('id', session.member_id).single();
  if (memberError) throw memberError;
  return member;
});

export async function signOutFamily() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) {
    const { error } = await database().from('family_sessions').delete().eq('token_hash', tokenHash(token));
    if (error) throw error;
  }
  jar.delete(cookieName);
}
