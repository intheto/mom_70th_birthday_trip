'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const destinations = [
  { href: '/home', label: '홈', icon: '⌂' },
  { href: '/preparation', label: '준비하기', icon: '☑' },
  { href: '/travel', label: '여행 정보', icon: '✈' },
  { href: '/guestbook', label: '방명록', icon: '♡' },
];

function LogoutButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="ghost" size="sm" disabled={pending}>{pending ? '나가는 중…' : '로그아웃'}</Button>;
}

export function TripShell({ name, logoutAction, children }: {
  name: string; logoutAction: () => Promise<void>; children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col bg-background text-foreground">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
        <Link href="/home" className="min-w-0 text-sm font-bold leading-relaxed">🎉 명품 엄마 칠순 경축<span className="block text-xs font-normal text-muted-foreground">오사카 가족 여행</span></Link>
        <div className="flex shrink-0 flex-col items-end gap-1"><span className="text-sm font-semibold">{name} 님</span><form action={logoutAction}><LogoutButton /></form></div>
      </header>
      <main id="trip-content" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">{children}</main>
      <nav aria-label="주요 메뉴" className="grid shrink-0 grid-cols-4 border-t bg-background pb-[env(safe-area-inset-bottom)]">
        {destinations.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} className={cn('flex min-h-16 flex-col items-center justify-center gap-1 text-xs', pathname === item.href ? 'font-bold text-primary' : 'text-muted-foreground')}><span aria-hidden="true" className="text-xl">{item.icon}</span>{item.label}</Link>)}
      </nav>
    </div>
  );
}
