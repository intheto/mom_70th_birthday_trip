'use client';

import { useActionState, useId, useState, useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { familyItems, personalItems, sharedItems, type CheckScope } from './catalog';
import type { MutationResult, PreparationComment, PreparationSnapshot } from './types';
import { cn } from '@/lib/utils';

type CheckAction = (scope: string, itemId: string, completed: boolean) => Promise<MutationResult>;
type CommentAction = (topic: string, previous: MutationResult, form: FormData) => Promise<MutationResult>;

function CheckItem({ scope, item, checked, disabled, changeAction }: {
  scope: CheckScope; item: { id: string; title: string; emoji: string }; checked: boolean;
  disabled?: boolean; changeAction: CheckAction;
}) {
  const id = useId();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');
  return <div className="flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <Checkbox id={id} nativeButton render={<button type="button" />} className="size-5 rounded-sm"
        checked={checked} disabled={disabled || pending} aria-label={`${item.title} 완료`} aria-describedby={error ? `${id}-error` : undefined}
        onCheckedChange={next => startTransition(async () => {
          setError('');
          try {
            const result = await changeAction(scope, item.id, next);
            setError(result.error);
          } catch { setError('저장하지 못했어요. 다시 체크해 주세요.'); }
        })} />
      <Label htmlFor={id} className={cn('flex cursor-pointer items-center gap-2 text-base font-semibold leading-relaxed peer-disabled:opacity-100', checked && 'text-muted-foreground')}>
        <span aria-hidden="true" className="inline-flex size-6 shrink-0 items-center justify-center text-lg">{item.emoji}</span>{item.title}
      </Label>
    </div>
    {pending && <p role="status" className="pl-8 text-xs text-muted-foreground">저장 중…</p>}
    {error && <p role="alert" id={`${id}-error`} className="text-sm text-destructive">{error}</p>}
  </div>;
}

function Opinion({ topic, title, comments, writeAction, initialOpen = false }: {
  initialOpen?: boolean;
  topic: string; title: string; comments: PreparationComment[]; writeAction: CommentAction;
}) {
  const id = useId();
  const [body, setBody] = useState('');
  const [open, setOpen] = useState(initialOpen);
  const [state, formAction, pending] = useActionState(async (previous: MutationResult, form: FormData) => {
    try {
      const result = await writeAction(topic, previous, form);
      if (result.saved) setBody('');
      return result;
    } catch { return { saved: false, error: '의견을 저장하지 못했어요. 다시 시도해 주세요.' }; }
  }, { saved: false, error: '' });
  return <Collapsible open={open} onOpenChange={setOpen} className="flex flex-col gap-2">
    <CollapsibleTrigger render={<Button variant="ghost" className="min-h-10 justify-start px-0 text-sm text-primary" />}>
      <span aria-hidden="true">▸</span>{title}{comments.length > 0 && <span className="text-muted-foreground">· {comments.length}</span>}
    </CollapsibleTrigger>
    <CollapsibleContent className="flex flex-col gap-4">
      {comments.length ? <ul className="flex flex-col gap-3" aria-label={`${title} 의견 목록`}>
        {comments.map(comment => <li key={comment.id} id={`news-${comment.id}`} data-news-id={comment.id} data-news-kind="opinion" className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">{comment.author}</span>
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{comment.body}</p>
        </li>)}
      </ul> : <p className="text-sm text-muted-foreground">첫 의견을 남겨주세요.</p>}
      <form action={formAction}>
        <FieldGroup className="gap-3">
          <Field data-invalid={Boolean(state.error)}>
            <FieldLabel htmlFor={id} className="sr-only">{title} 의견</FieldLabel>
            <Textarea id={id} name="body" rows={3} maxLength={2000} required disabled={pending}
              value={body} onChange={event => setBody(event.target.value)} aria-invalid={Boolean(state.error)}
              placeholder={topic === 'places' ? '가고 싶은 장소와 이유를 나눠주세요' : topic === 'food' ? '먹고 싶은 음식이나 식당을 알려주세요' : '이 준비에 대한 의견을 남겨주세요'} className="text-sm" />
            <FieldError>{state.error}</FieldError>
          </Field>
          <Button type="submit" className="min-h-10 w-fit" disabled={pending || !body.trim()}>{pending ? '저장 중…' : '의견 남기기'}</Button>
          {state.saved && <p role="status" className="text-xs text-muted-foreground">의견을 남겼어요.</p>}
        </FieldGroup>
      </form>
    </CollapsibleContent>
  </Collapsible>;
}

export function PreparationList({ snapshot, changeAction, writeAction, focusedTopic }: {
  focusedTopic?: string;
  snapshot: PreparationSnapshot; changeAction: CheckAction; writeAction: CommentAction;
}) {
  return <div className="flex flex-col gap-8">
    <section aria-labelledby="shared-checks" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1"><h2 id="shared-checks" className="text-lg font-bold">공동 체크 리스트</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">김영욱 님이 완료하면 가족 모두에게 표시돼요.</p></div>
      {sharedItems.map(item => <Card key={item.id} className="rounded-xl">
        <CardHeader><CardTitle><CheckItem scope="shared" item={item} checked={snapshot.shared[item.id] ?? false} disabled={!snapshot.canEditShared} changeAction={changeAction} /></CardTitle>
          {'description' in item && <CardDescription className="pl-8 text-sm">{item.description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pl-12">
          <Separator />
          {item.topics.map(topic => <Opinion key={topic.id} initialOpen={focusedTopic === topic.id} topic={topic.id} title={topic.title}
            comments={snapshot.comments.filter(comment => comment.topic === topic.id)} writeAction={writeAction} />)}
        </CardContent>
      </Card>)}
    </section>
    <section aria-labelledby="family-checks" className="flex flex-col gap-3">
      <h2 id="family-checks" className="text-lg font-bold">가족 체크 리스트</h2>
      <p className="text-sm text-muted-foreground">{snapshot.familyLabel}의 준비를 함께 체크해요.</p>
      <div className="flex flex-wrap gap-3">{familyItems.map(item => <Card key={item.id} size="sm" className="max-w-full rounded-xl">
        <CardHeader><CardTitle><CheckItem scope="family" item={item} checked={snapshot.family[item.id] ?? false} changeAction={changeAction} /></CardTitle></CardHeader>
      </Card>)}</div>
    </section>
    <section aria-labelledby="personal-checks" className="flex flex-col gap-3">
      <h2 id="personal-checks" className="text-lg font-bold">개별 체크 리스트</h2>
      <p className="text-sm text-muted-foreground">내 준비가 끝나면 체크해 주세요.</p>
      <div className="flex flex-wrap gap-3">{personalItems.map(item => <Card key={item.id} size="sm" className="max-w-full rounded-xl">
        <CardHeader><CardTitle><CheckItem scope="personal" item={item} checked={snapshot.personal[item.id] ?? false} changeAction={changeAction} /></CardTitle></CardHeader>
      </Card>)}</div>
    </section>
  </div>;
}
