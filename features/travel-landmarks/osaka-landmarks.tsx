import Image from 'next/image';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { landmarks } from './catalog';

export function OsakaLandmarks() {
  return (
    <div className="flex flex-col gap-6">
      {landmarks.map((landmark, index) => {
        const sourceUrl = `https://osaka-info.jp/ko/spot/${landmark.slug}/`;
        const mapUrl = `https://www.google.com/maps/search/?${new URLSearchParams({ api: '1', query: landmark.map })}`;

        return (
          <section key={landmark.id} aria-labelledby={`landmark-${landmark.id}`}>
            <Card className="gap-0 [--card-spacing:--spacing(5)]">
              <CardHeader className="gap-2 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline">랜드마크</Badge>
                  <span className="text-xs text-muted-foreground">{landmark.area}</span>
                </div>
                <CardTitle>
                  <h2 id={`landmark-${landmark.id}`} className="break-keep text-2xl font-semibold leading-snug tracking-tight">{landmark.name}</h2>
                </CardTitle>
                <span lang="ja" className="text-xs tracking-widest text-muted-foreground">{landmark.ja}</span>
                <CardDescription>{landmark.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pb-5">
                <figure className="flex flex-col gap-1">
                  <div className="relative h-36 overflow-hidden bg-muted">
                    <Image
                      src={landmark.photo}
                      alt={landmark.photoAlt}
                      fill
                      sizes="(max-width: 672px) calc(100vw - 80px), 592px"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      className="object-cover"
                      style={{ objectPosition: landmark.photoPosition }}
                    />
                  </div>
                  <figcaption className="flex flex-wrap justify-between gap-1 text-[10px] leading-relaxed text-muted-foreground">
                    <span>{landmark.kind}</span>
                    <a href={sourceUrl} target="_blank" rel="noreferrer" aria-label={`${landmark.name} 사진 출처 보기`} className="underline-offset-4 hover:underline">사진 · OSAKA-INFO ↗</a>
                  </figcaption>
                </figure>
                <p className="break-keep text-sm leading-loose">{landmark.intro}</p>
                <aside className="flex flex-col gap-2 bg-muted p-4">
                  <span className="text-xs font-medium text-primary">작은 발견</span>
                  <p className="break-keep text-sm leading-relaxed">{landmark.fact}</p>
                </aside>
              </CardContent>
              <Collapsible>
                <CollapsibleTrigger aria-label={`${landmark.name} 방문 전에 알아두기`} className="group flex w-full items-center justify-between gap-3 border-t px-5 py-4 text-left text-sm font-medium outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                  방문 전에 알아두기
                  <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="shrink-0 group-aria-expanded:rotate-180" aria-hidden="true" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-4 px-5 pb-5">
                    <p className="break-keep text-sm leading-loose">{landmark.tip}</p>
                    <Button variant="outline" render={<a href={mapUrl} target="_blank" rel="noreferrer" aria-label={`${landmark.name} 지도에서 위치 보기`} />}>지도에서 위치 보기 ↗</Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <CardFooter className="flex-wrap justify-between gap-2 py-4">
                <span className="text-muted-foreground">출처 · 오사카관광국</span>
                <a href={sourceUrl} target="_blank" rel="noreferrer" aria-label={`${landmark.name} 공식 관광 정보 보기`} className="text-muted-foreground underline underline-offset-4 hover:text-foreground">공식 관광 정보 ↗</a>
              </CardFooter>
            </Card>
          </section>
        );
      })}
    </div>
  );
}
