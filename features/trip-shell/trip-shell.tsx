'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Airplane01Icon, Calendar03Icon, CheckListIcon, FavouriteIcon, Home01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const destinations = [
  { href: '/home', label: '홈', icon: Home01Icon },
  { href: '/preparation', label: '준비하기', icon: CheckListIcon },
  { href: '/schedule', label: '여행 스케쥴', icon: Calendar03Icon },
  { href: '/travel', label: '여행 정보', icon: Airplane01Icon },
  { href: '/guestbook', label: '방명록', icon: FavouriteIcon },
];

function LogoutButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="ghost" size="sm" disabled={pending}>{pending ? '나가는 중…' : '로그아웃'}</Button>;
}

export function TripShell({ name, logoutAction, children }: {
  name: string; logoutAction: () => Promise<void>; children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = destinations.find(item => item.href === pathname)?.label ?? '홈';
  return (
    <div className="mx-auto flex h-dvh w-full max-w-2xl flex-col bg-background text-foreground">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
        <h1 className="min-w-0 text-3xl font-bold leading-tight tracking-tight">{title}</h1>
        <div className="flex shrink-0 flex-col items-end gap-1"><span className="text-sm font-semibold">{name} 님</span><form action={logoutAction}><LogoutButton /></form></div>
      </header>
      <main id="trip-content" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">{children}</main>
      <nav aria-label="주요 메뉴" className="grid shrink-0 grid-cols-5 border-t bg-background pb-[env(safe-area-inset-bottom)]">
        {destinations.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} className={cn('flex min-h-16 flex-col items-center justify-center gap-1 whitespace-nowrap text-xs', pathname === item.href ? 'font-bold text-primary' : 'text-muted-foreground')}><span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center"><HugeiconsIcon icon={item.icon} size={24} strokeWidth={1.5} /></span>{item.label}</Link>)}
      </nav>
    </div>
  );
}
