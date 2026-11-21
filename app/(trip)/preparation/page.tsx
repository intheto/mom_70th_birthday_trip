import { redirect } from 'next/navigation';
import { getCurrentMember } from '@/features/family-login/server';
import { PreparationList } from '@/features/preparation';
import { getPreparation } from '@/features/preparation/server';
import { changePreparationAction, editPreparationOpinionAction, writePreparationOpinionAction } from './actions';

export default async function PreparationPage({ searchParams }: { searchParams: Promise<{ topic?: string; news?: string }> }) {
  const { topic, news } = await searchParams;
  const member = await getCurrentMember();
  if (!member) redirect('/');
  const snapshot = await getPreparation(member.id);
  return <PreparationList key={news} focusedTopic={topic} snapshot={snapshot} changeAction={changePreparationAction} writeAction={writePreparationOpinionAction} editAction={editPreparationOpinionAction} />;
}
