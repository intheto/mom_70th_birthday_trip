import { redirect } from 'next/navigation';
import { getCurrentMember } from '@/features/family-login/server';
import { getPreparationProgress, getPreparationItemProgress } from '@/features/preparation/server';
import { sharedItems } from '@/features/preparation';
import { getUnreadNews } from '@/features/news/server';
import { travelNews } from '../travel/information';
import { HomeDashboard } from '@/features/home';

export default async function TripHome() {
  const member = await getCurrentMember();
  if (!member) redirect('/');
  const [progress, items, news] = await Promise.all([getPreparationProgress(), getPreparationItemProgress(), getUnreadNews(member.id, travelNews)]);
  const topics = Object.fromEntries(sharedItems.flatMap(item => item.topics.map(topic => [topic.id, topic.id === 'places' || topic.id === 'food' ? `${item.title} · ${topic.title}` : item.title])));
  return <HomeDashboard progress={progress} items={items} news={news} topics={topics} />;
}
