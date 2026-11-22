'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export function FlightResearchCard() {
  const [open, setOpen] = useState(false);

  return (
    <section aria-labelledby="flight-research-title">
      <Card className="[--card-spacing:--spacing(5)]">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline">항공권 리서치</Badge>
            <span className="text-xs text-muted-foreground">왕복 · 직항</span>
          </div>
          <CardTitle>
            <h2 id="flight-research-title" className="break-keep text-2xl font-semibold leading-snug tracking-tight">
              <span className="mb-1 block text-sm font-medium tracking-normal text-muted-foreground">2026년 11월 22일 기준</span>
              항공권 최저가 리서치 결과
            </h2>
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-x-3 gap-y-1">
            <span>2027.05.13–05.16</span><span>가족 10명</span><span>대한항공 운항</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 bg-muted p-4">
            <span className="text-xs text-muted-foreground">10명 왕복 · 확인한 최저 조회 합계</span>
            <strong className="text-3xl font-bold tracking-tight tabular-nums">7,267,800<span className="ml-1 text-lg">원</span></strong>
            <p className="break-keep text-xs leading-loose">인천 06:55 출국 · 간사이 18:15 또는 19:45 귀국</p>
          </div>
          <p className="break-keep text-xs leading-loose text-muted-foreground">
            성인 운임 7명 + 소아 3명<br />
            5명씩 두 번 조회한 합계로, 10석 확약·최종 결제가는 아니에요.
          </p>
          <Separator />
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-primary">가족 일정 추천</span>
            <strong className="break-keep text-base font-semibold">김포 09:15 출국 · 19:35 귀국</strong>
            <p className="break-keep text-xs leading-loose">
              왕복 조회 합계 <strong className="tabular-nums">7,380,100원</strong><br />
              최저 조합보다 가족 전체 <strong className="tabular-nums">112,300원</strong> 높아요.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="lg" />}>
              자세히 보기<HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" aria-hidden="true" />
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="flex h-dvh max-w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
              <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
                <DialogHeader>
                  <DialogTitle>항공권 최저가 리서치 결과</DialogTitle>
                  <DialogDescription>2026.11.22 기준 · 전체 보고서</DialogDescription>
                </DialogHeader>
                <DialogClose render={<Button variant="ghost" size="icon" aria-label="전체 보고서 닫기" />}>
                  <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" />
                </DialogClose>
              </div>
              <iframe
                src="/reports/osaka-flights-2026-11-22.html"
                title="2026년 11월 22일 항공권 최저가 리서치 전체 보고서"
                className="min-h-0 w-full flex-1 border-0"
                onLoad={event => {
                  // iframe 안의 키 입력은 상위 Dialog로 전파되지 않는다.
                  event.currentTarget.contentDocument?.addEventListener('keydown', event => {
                    if (event.key === 'Escape') {
                      event.preventDefault();
                      setOpen(false);
                    }
                  });
                }}
              />
            </DialogContent>
          </Dialog>
          <p className="text-xs text-muted-foreground">가격순 5개 선택지 · 할인 조건 · 예약 방법</p>
        </CardFooter>
      </Card>
    </section>
  );
}
