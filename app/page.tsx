import { FamilyLogin } from '@/features/family-login';
import { getCurrentMember, getFamilyGroups, hasFamilySessionCookie } from '@/features/family-login/server';
import { redirect } from 'next/navigation';
import { loginAction } from './actions';

export default async function Home({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  let families;
  let member;
  try {
    member = await getCurrentMember();
    if (!member) families = await getFamilyGroups();
  } catch {
    return <FamilyLogin families={[]} loginAction={loginAction} initialError="가족 정보를 불러오지 못했어요. 잠시 후 새로고침해 주세요." />;
  }
  if (member) redirect('/home');
  const { expired } = await searchParams;
  return <FamilyLogin families={families ?? []} loginAction={loginAction} initialError={expired || await hasFamilySessionCookie() ? '로그인 유지 기간이 끝났어요. 다시 로그인해 주세요.' : ''} />;
}
