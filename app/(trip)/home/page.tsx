import Image from 'next/image';
import Link from 'next/link';
import { getGuestbookEntries } from '@/features/guestbook/server';
import { GuestbookList } from '@/features/guestbook';
import { Badge } from '@/components/ui/badge';
import { getCurrentMember } from '@/features/family-login/server';
import { redirect } from 'next/navigation';

export default async function TripHome() {
  if (!await getCurrentMember()) redirect('/');
  const entries = await getGuestbookEntries(1);
  return <div className="flex flex-col gap-7">
    <section className="relative isolate overflow-hidden rounded-2xl border bg-muted px-5 py-7">
      <Image src="/images/family-login/osaka-pastel.png" alt="" fill sizes="(max-width: 672px) 100vw, 672px" className="-z-10 object-cover opacity-35" priority />
      <Badge variant="secondary">2027. 5. 13 – 5. 16 · 3박 4일</Badge>
      <h2 className="mt-5 text-3xl font-bold leading-tight">70년산 명품엄마와<br />오사카 가족 여행</h2>
      <p className="mt-4 text-sm leading-relaxed">함께 준비하는 시간부터<br />우리 가족의 추억이 시작돼요.</p>
    </section>
    <section aria-labelledby="recent-guestbook" className="flex flex-col gap-5"><div className="flex items-center justify-between gap-2"><h2 id="recent-guestbook" className="text-lg font-bold">방명록에서 온 한마디</h2><Link href="/guestbook" className="text-sm font-semibold text-primary">전체 보기 →</Link></div><GuestbookList entries={entries} /><Link href="/guestbook" className="text-sm font-semibold text-primary">방명록에서 이야기 나누기 →</Link></section>
  </div>;
}
