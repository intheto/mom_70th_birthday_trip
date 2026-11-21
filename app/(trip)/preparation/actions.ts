'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentMember } from '@/features/family-login/server';
import { addPreparationComment, editPreparationComment, setPreparationCheck } from '@/features/preparation/server';
import type { MutationResult } from '@/features/preparation';

export async function changePreparationAction(scope: string, itemId: string, completed: boolean): Promise<MutationResult> {
  try {
    const member = await getCurrentMember();
    if (!member) return { error: '로그인 시간이 지났어요. 다시 로그인해 주세요.', saved: false };
    await setPreparationCheck(member.id, scope, itemId, completed);
  } catch {
    return { error: '저장하지 못했어요. 변경 권한을 확인하고 다시 시도해 주세요.', saved: false };
  }
  revalidatePath('/preparation');
  revalidatePath('/home');
  return { error: '', saved: true };
}

export async function writePreparationOpinionAction(topic: string, _previous: MutationResult, form: FormData): Promise<MutationResult> {
  const body = String(form.get('body') ?? '').trim();
  if (!body || body.length > 2000) return { error: '의견을 1~2,000자 사이로 입력해 주세요.', saved: false };
  try {
    const member = await getCurrentMember();
    if (!member) return { error: '로그인 시간이 지났어요. 다시 로그인해 주세요.', saved: false };
    await addPreparationComment(member.id, topic, body);
  } catch {
    return { error: '의견을 저장하지 못했어요. 다시 시도해 주세요.', saved: false };
  }
  revalidatePath('/preparation');
  return { error: '', saved: true };
}

export async function editPreparationOpinionAction(commentId: string, _previous: MutationResult, form: FormData): Promise<MutationResult> {
  const body = String(form.get('body') ?? '').trim();
  if (!body || body.length > 2000) return { error: '의견을 1~2,000자 사이로 입력해 주세요.', saved: false };
  try {
    const member = await getCurrentMember();
    if (!member) return { error: '로그인 시간이 지났어요. 다시 로그인해 주세요.', saved: false };
    await editPreparationComment(member.id, commentId, body);
  } catch {
    return { error: '수정하지 못했어요. 본인이 작성한 의견인지 확인하고 다시 시도해 주세요.', saved: false };
  }
  revalidatePath('/preparation');
  revalidatePath('/home');
  return { error: '', saved: true };
}
