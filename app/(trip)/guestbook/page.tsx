import { redirect } from 'next/navigation';
import { getCurrentMember } from '@/features/family-login/server';
import { getGuestbookEntries } from '@/features/guestbook/server';
import { GuestbookCompose, GuestbookList } from '@/features/guestbook';
import { writeGuestbookAction, writeGuestbookCommentAction } from '@/app/actions';

export default async function GuestbookPage() {
  const member = await getCurrentMember();
  if (!member) redirect('/');
  const entries = await getGuestbookEntries();
  return <div className="flex flex-col gap-6">
    <GuestbookCompose name={member.name} writeAction={writeGuestbookAction} />
    <section aria-labelledby="guestbook-heading" className="flex flex-col gap-5"><div className="flex items-center justify-between gap-2"><h2 id="guestbook-heading" className="text-base font-bold"><span className="text-primary">{entries.length}</span>개의 이야기가 쌓였어요</h2><span className="text-xs text-muted-foreground">최근 글부터</span></div><GuestbookList entries={entries} name={member.name} writeCommentAction={writeGuestbookCommentAction} /></section>
  </div>;
}
