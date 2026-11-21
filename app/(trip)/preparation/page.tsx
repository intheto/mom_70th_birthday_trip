import { redirect } from 'next/navigation';
import { getCurrentMember } from '@/features/family-login/server';
import { PreparationList } from '@/features/preparation';
import { getPreparation } from '@/features/preparation/server';
import { changePreparationAction, writePreparationOpinionAction } from './actions';

export default async function PreparationPage() {
  const member = await getCurrentMember();
  if (!member) redirect('/');
  const snapshot = await getPreparation(member.id);
  return <PreparationList snapshot={snapshot} changeAction={changePreparationAction} writeAction={writePreparationOpinionAction} />;
}
