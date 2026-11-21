import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Castle01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function OsakaNameStory() {
  return (
    <section aria-labelledby="osaka-name-title">
      <Card className="[--card-spacing:--spacing(5)]">
        <CardHeader className="gap-3">
          <Badge variant="outline">도시 이름 이야기</Badge>
          <CardTitle><h2 id="osaka-name-title" className="text-2xl font-semibold leading-snug tracking-tight">오사카 이름에는<br />‘언덕’이 숨어 있어요</h2></CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center justify-center gap-5 bg-muted px-2 py-5" aria-label="큰 대, 언덕 판">
            <div className="flex flex-col items-center gap-2"><strong lang="ja" className="font-serif text-5xl font-normal">大</strong><span className="text-xs text-muted-foreground">크다 · 오오</span></div>
            <span className="mb-6 text-xl font-light text-muted-foreground" aria-hidden="true">+</span>
            <div className="flex flex-col items-center gap-2"><strong lang="ja" className="font-serif text-5xl font-normal">阪</strong><span className="text-xs text-muted-foreground">언덕 · 사카</span></div>
          </div>
          <p className="break-keep text-sm leading-loose">한자로 쓴 오사카, <strong lang="ja">大阪</strong>.<br />글자 뜻으로는 <strong>‘큰 언덕’</strong>으로 풀이할 수 있어요. 도시 이름에서 지형의 흔적을 만날 수 있다니 재미있죠?</p>
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={Castle01Icon} size={34} className="shrink-0 text-primary" strokeWidth={1.3} aria-hidden="true" />
            <p className="break-keep text-xs leading-loose text-muted-foreground">지금의 오사카성 일대인 <strong>우에마치 대지 북쪽</strong>에서 쓰이던 지명이 더 넓은 지역의 이름이 되었다고 해요.</p>
          </div>
          <p className="text-xs leading-loose text-muted-foreground">정확한 지명 유래에는 여러 설이 전해져요.</p>
        </CardContent>
        <Collapsible>
          <CollapsibleTrigger className="group flex w-full items-center justify-between gap-3 border-t px-5 py-4 text-left text-sm font-medium outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
            예전에는 ‘大坂’라고 썼대요
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="shrink-0 group-aria-expanded:rotate-180" aria-hidden="true" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-4 px-5 pb-5">
              <div className="flex flex-wrap items-center gap-3 bg-muted px-4 py-3">
                <span><strong lang="ja" className="font-serif text-2xl font-normal">大坂</strong> <span className="text-xs text-muted-foreground">옛 표기</span></span>
                <span className="text-muted-foreground" aria-hidden="true">→</span>
                <span><strong lang="ja" className="font-serif text-2xl font-normal text-primary">大阪</strong> <span className="text-xs text-muted-foreground">오늘날</span></span>
              </div>
              <p className="break-keep text-sm leading-loose">읽는 소리는 같지만 ‘사카’의 한자가 달라요. 두 표기는 에도 시대에도 함께 쓰였고, 메이지 시대에 <strong lang="ja">大阪</strong>이 일반적으로 쓰이게 되었어요.</p>
              <a href="https://crd.ndl.go.jp/reference/entry/index.php?id=1000090525&page=ref_view" target="_blank" rel="noreferrer" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">표기 변화 이야기 출처 ↗</a>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <CardFooter className="flex-wrap justify-between gap-2">
          <span className="text-muted-foreground">출처 · 오사카시립중앙도서관</span>
          <a href="https://crd.ndl.go.jp/reference/entry/index.php?id=1000057256&page=ref_view" target="_blank" rel="noreferrer" aria-label="오사카 이름의 유래 출처 보기" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">출처 보기 ↗</a>
        </CardFooter>
      </Card>
    </section>
  );
}
