'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import type { News } from '@/features/news';

type Item = { id: string; title: string; emoji: string; completed: number; total: number };
type Progress = Record<'shared' | 'family' | 'personal', { completed: number; total: number }>;
const date = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
function countdown() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const n = (key: string) => Number(parts.find(part => part.type === key)?.value);
  const days = Math.round((Date.UTC(2027, 4, 13) - Date.UTC(n('year'), n('month') - 1, n('day'))) / 86400000);
  return days > 0 ? `D−${days}` : days === 0 ? 'D-Day' : `D+${Math.abs(days)}`;
}
export function HomeDashboard({ progress, items, news, topics }: {
  progress: Progress; items: Record<keyof Progress, Item[]>; news: News[]; topics: Record<string, string>;
}) {
  const [filter, setFilter] = useState('all');
  const [day, setDay] = useState('');
  useEffect(() => { const update = () => setDay(countdown()); update(); const timer = setInterval(update, 30000); return () => clearInterval(timer); }, []);
  const groups = [ ['shared', '🤝', '공동 준비', '항목'], ['family', '🏡', '가족 준비', '체크'], ['personal', '🎒', '개별 준비', '체크'] ] as const;
  const visible = news.filter(row => filter === 'all' || row.kind === filter);
  return <div className="flex flex-col gap-7">
    <section className="relative isolate overflow-hidden rounded-2xl border bg-muted px-5 py-5">
      <Image src="/images/family-login/osaka-pastel.png" alt="" fill sizes="(max-width: 672px) 100vw, 672px" className="-z-10 object-cover opacity-20" priority />
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-primary">이정희 여사님 칠순 기념</p><h2 className="mt-2 text-xl font-bold leading-snug">함께라서 더 특별한<br />오사카 가족 여행</h2></div><div className="shrink-0 text-right text-primary"><p className="text-xs">출발까지</p><p className="text-2xl font-bold tabular-nums">{day || '…'}</p></div></div>
      <p className="mt-3 text-xs text-muted-foreground">2027. 5. 13 – 5. 16 · 3박 4일</p>
    </section>
    <section aria-labelledby="progress-heading" className="flex flex-col gap-3"><div className="flex items-center justify-between gap-2"><h2 id="progress-heading" className="text-lg font-bold">우리 가족 준비 현황</h2><Link href="/preparation" className="text-xs font-semibold text-primary">준비하기 →</Link></div>
      {groups.map(([key, emoji, title, unit]) => { const value = progress[key]; return <Card key={key} className="rounded-xl">
        <CardHeader><div className="flex items-center justify-between gap-3"><CardTitle><h3 className="flex items-center gap-2 text-base font-bold"><span aria-hidden="true">{emoji}</span>{title}</h3></CardTitle><p className="whitespace-nowrap text-xl font-bold tabular-nums">{value.completed}<span className="ml-1 text-xs font-normal text-muted-foreground">/ {value.total} {unit}</span></p></div></CardHeader>
        <CardContent className="flex flex-col gap-3"><div className="h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={title} aria-valuenow={value.completed} aria-valuemin={0} aria-valuemax={value.total}><div className="h-full rounded-full bg-primary" style={{ width: `${value.total ? value.completed / value.total * 100 : 0}%` }} /></div>
          {key === 'shared' ? <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">{items[key].map(item => <span key={item.id}>{item.completed ? '✓' : '○'} {item.title}</span>)}</div> : <details><summary className="cursor-pointer text-xs text-muted-foreground">{items[key].length}개 항목 × {items[key][0]?.total ?? 0}{key === 'family' ? '가족' : '명'}</summary><ul className="mt-3 flex flex-col gap-2">{items[key].map(item => <li key={item.id} className="flex justify-between gap-2 text-xs"><span>{item.emoji} {item.title}</span><span>{item.completed}/{item.total}{key === 'family' ? '가족' : '명'}</span></li>)}</ul></details>}
        </CardContent></Card>; })}
    </section>
    <section aria-labelledby="news-heading" className="flex flex-col gap-3"><div className="flex items-center gap-2"><h2 id="news-heading" className="text-lg font-bold">아직 못 본 새 소식</h2>{news.length > 0 && <Badge variant="secondary">{news.length}</Badge>}</div><p className="text-xs text-muted-foreground">가족이 남긴 이야기와 준비 의견이에요.</p>
      {news.length > 0 && <RadioGroup value={filter} onValueChange={setFilter} className="flex flex-wrap gap-3" aria-label="새 소식 필터">{[['all', '전체'], ['guestbook', '방명록'], ['opinion', '준비 의견']].map(([key, title]) => <div className="flex items-center gap-1.5" key={key}><RadioGroupItem id={`news-filter-${key}`} value={key} /><Label htmlFor={`news-filter-${key}`} className="text-xs">{title} {key === 'all' ? news.length : news.filter(row => row.kind === key).length}</Label></div>)}</RadioGroup>}
      {visible.length ? <ul className="divide-y">{visible.map(row => <li key={`${row.kind}:${row.id}`}><Link href={row.kind === 'guestbook' ? `/guestbook#news-${row.id}` : `/preparation?topic=${encodeURIComponent(row.topic ?? '')}&news=${row.id}#news-${row.id}`} className="flex items-start gap-3 py-4"><span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">{row.kind === 'guestbook' ? '💬' : '📝'}</span><div className="min-w-0 flex-1"><p className="text-xs text-muted-foreground">{row.kind === 'guestbook' ? '방명록' : topics[row.topic ?? ''] ?? '준비 의견'} <span className="text-primary" aria-label="새 소식">●</span></p><h3 className="mt-1 text-sm font-semibold">{row.author} 님의 {row.kind === 'guestbook' ? '새 이야기' : '새 의견'}</h3><p className="mt-1 truncate text-xs text-muted-foreground">{row.body}</p><time dateTime={row.createdAt} className="mt-1 block text-xs text-muted-foreground">{date.format(new Date(row.createdAt))}</time></div><span aria-hidden="true" className="self-center text-muted-foreground">›</span></Link></li>)}</ul> : <Empty className="rounded-xl bg-muted"><EmptyHeader><EmptyTitle>{news.length ? '이 구분의 새 소식은 모두 봤어요' : '새 소식을 모두 확인했어요'}</EmptyTitle><EmptyDescription>가족이 새로운 이야기를 남기면 알려드릴게요.</EmptyDescription></EmptyHeader></Empty>}
    </section>
  </div>;
}
