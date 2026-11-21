'use server';
import { getCurrentMember } from '@/features/family-login/server';
import { recordNewsReads } from '@/features/news/server';
import type { ReadReceipt } from '@/features/news';
import { revalidatePath } from 'next/cache';
export async function readNewsAction(rows: ReadReceipt[]) {
  const member = await getCurrentMember();
  if (!member) return { error: '다시 로그인해 주세요.' };
  try { await recordNewsReads(member.id, rows); revalidatePath('/home'); return { error: '' }; }
  catch { return { error: '읽음 기록을 저장하지 못했어요. 다시 시도해 주세요.' }; }
}
