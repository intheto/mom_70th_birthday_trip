import { redirect } from 'next/navigation';
import { getCurrentMember } from '@/features/family-login/server';
import { getGuestbookEntries } from '@/features/guestbook/server';
import { GuestbookCompose, GuestbookList } from '@/features/guestbook';
import { writeGuestbookAction } from '@/app/actions';

export default async function GuestbookPage() {
  const member = await getCurrentMember();
  if (!member) redirect('/');
  const entries = await getGuestbookEntries();
  return <div className="flex flex-col gap-6">
    <div><p className="text-xs text-primary">작은 한마디도 소중한 추억</p><h1 className="mt-2 text-3xl font-bold">방명록</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">여행을 기다리는 마음,<br />가족에게 전하고 싶은 한마디.</p></div>
    <GuestbookCompose name={member.name} writeAction={writeGuestbookAction} />
    <section aria-labelledby="guestbook-heading" className="flex flex-col gap-5"><div className="flex items-center justify-between gap-2"><h2 id="guestbook-heading" className="text-lg font-bold">가족이 남긴 이야기 <span className="text-muted-foreground">{entries.length}</span></h2><span className="text-xs text-muted-foreground">최근 글부터</span></div><GuestbookList entries={entries} /></section>
  </div>;
}
