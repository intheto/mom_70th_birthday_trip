import { redirect } from 'next/navigation';
import { getCurrentMember } from '@/features/family-login/server';
import { TripShell } from '@/features/trip-shell';
import { logoutAction } from '@/app/actions';

export default async function TripLayout({ children }: { children: React.ReactNode }) {
  const member = await getCurrentMember();
  if (!member) redirect('/');
  return <TripShell name={member.name} logoutAction={logoutAction}>{children}</TripShell>;
}
