import { redirect } from 'next/navigation';
import { getCurrentMember } from '@/features/family-login/server';
import { TripShell } from '@/features/trip-shell';
import { NewsReadTracker } from '@/features/news';
import { readNewsAction } from './home/actions';
import { logoutAction } from '@/app/actions';

export default async function TripLayout({ children }: { children: React.ReactNode }) {
  const member = await getCurrentMember();
  if (!member) redirect('/');
  return <TripShell name={member.name} logoutAction={logoutAction}><NewsReadTracker save={readNewsAction} />{children}</TripShell>;
}
