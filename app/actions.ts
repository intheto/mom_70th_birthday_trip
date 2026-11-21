'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCurrentMember, signInFamily, signOutFamily } from '@/features/family-login/server';
import { addGuestbookEntry } from '@/features/guestbook/server';
import type { LoginState } from '@/features/family-login';

export async function loginAction(_state: LoginState, form: FormData): Promise<LoginState> {
  try {
    if (!await signInFamily(String(form.get('name') ?? ''), String(form.get('pin') ?? ''))) {
      return { error: '가족 암호가 맞지 않아요. 선택한 이름과 암호를 다시 확인해 주세요.' };
    }
  } catch {
    return { error: '로그인을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.' };
  }
  redirect('/home');
}

export async function logoutAction() {
  await signOutFamily();
  redirect('/');
}

export async function writeGuestbookAction(_state: { error: string; saved: boolean }, form: FormData) {
  const body = String(form.get('body') ?? '').trim();
  if (!body || body.length > 2000) return { error: '이야기를 1~2,000자 사이로 입력해 주세요.', saved: false };
  let signedOut = false;
  try {
    const member = await getCurrentMember();
    if (!member) signedOut = true;
    else await addGuestbookEntry(member.id, body);
  } catch {
    return { error: '글을 저장하지 못했어요. 입력한 내용은 남아 있으니 다시 시도해 주세요.', saved: false };
  }
  if (signedOut) redirect('/?expired=1');
  revalidatePath('/guestbook');
  revalidatePath('/home');
  return { error: '', saved: true };
}
