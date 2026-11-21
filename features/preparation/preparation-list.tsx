'use client';

import { useActionState, useId, useState, useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@/components/ui/input-group';
import { Separator } from '@/components/ui/separator';
import { familyItems, personalItems, sharedItems, type CheckScope } from './catalog';
import type { MutationResult, PreparationComment, PreparationSnapshot } from './types';
import { cn } from '@/lib/utils';

type CheckAction = (scope: string, itemId: string, completed: boolean) => Promise<MutationResult>;
type EditAction = (commentId: string, previous: MutationResult, form: FormData) => Promise<MutationResult>;
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

function OpinionEditor({ comment, editAction, onClose }: {
  comment: PreparationComment; editAction: EditAction; onClose: () => void;
}) {
  const id = useId();
  const [body, setBody] = useState(comment.body);
  const [state, action, pending] = useActionState(async (previous: MutationResult, form: FormData) => {
    try {
      const result = await editAction(comment.id, previous, form);
      if (result.saved) onClose();
      return result;
    } catch { return { saved: false, error: '수정 내용을 저장하지 못했어요. 다시 시도해 주세요.' }; }
  }, { saved: false, error: '' });
  return <form action={action} aria-label="의견 수정">
    <FieldGroup className="gap-2">
      <Field data-invalid={Boolean(state.error)}>
        <FieldLabel htmlFor={id} className="sr-only">의견 수정</FieldLabel>
        <Textarea id={id} name="body" rows={2} maxLength={2000} required autoFocus disabled={pending}
          value={body} onChange={event => setBody(event.target.value)} aria-invalid={Boolean(state.error)}
          className="max-h-64 min-h-20 rounded-lg text-sm md:text-sm" />
        <FieldError>{state.error}</FieldError>
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" className="min-h-9 rounded-md" disabled={pending} onClick={onClose}>취소</Button>
        <Button type="submit" size="sm" className="min-h-9 rounded-md" disabled={pending || !body.trim() || body.trim() === comment.body}>{pending ? '저장 중…' : '저장'}</Button>
      </div>
    </FieldGroup>
  </form>;
}

function OpinionEntry({ comment, editAction }: { comment: PreparationComment; editAction: EditAction }) {
  const [editing, setEditing] = useState(false);
  return <li id={`news-${comment.id}`} data-news-id={comment.id} data-news-kind="opinion" className="flex items-start gap-2">
    <span className="shrink-0 pt-0.5 text-xs font-semibold leading-relaxed text-muted-foreground">{comment.author}</span>
    <div className="min-w-0 flex-1">
      {editing ? <OpinionEditor comment={comment} editAction={editAction} onClose={() => setEditing(false)} /> : <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm leading-relaxed">{comment.body}</p>
        {comment.canEdit && <Button type="button" variant="ghost" size="xs" className="shrink-0 rounded-md text-muted-foreground" onClick={() => setEditing(true)} aria-label={`${comment.author} 의견 수정`}>수정</Button>}
      </div>}
    </div>
  </li>;
}

function Opinion({ topic, title, itemTitle, comments, writeAction, editAction }: {
  topic: string; title: string; itemTitle: string; comments: PreparationComment[]; writeAction: CommentAction; editAction: EditAction;
}) {
  const id = useId();
  const [body, setBody] = useState('');
  const [state, formAction, pending] = useActionState(async (previous: MutationResult, form: FormData) => {
    try {
      const result = await writeAction(topic, previous, form);
      if (result.saved) setBody('');
      return result;
    } catch { return { saved: false, error: '의견을 저장하지 못했어요. 다시 시도해 주세요.' }; }
  }, { saved: false, error: '' });
  const label = topic === 'places' || topic === 'food' ? title : itemTitle;
  return <section aria-label={`${label} 의견`} className="flex min-w-0 flex-col gap-3">
    {(topic === 'places' || topic === 'food') && <h3 className="text-sm font-semibold">{title}</h3>}
    {comments.length > 0 && <ul className="flex flex-col gap-2" aria-label={`${label} 의견 목록`}>
      {comments.map(comment => <OpinionEntry key={comment.id} comment={comment} editAction={editAction} />)}
    </ul>}
    <form action={formAction}>
      <FieldGroup className="gap-2">
        <Field data-invalid={Boolean(state.error)}>
          <FieldLabel htmlFor={id} className="sr-only">{label} 의견</FieldLabel>
          <InputGroup className="items-end rounded-lg has-disabled:bg-transparent has-disabled:opacity-100">
            <InputGroupTextarea id={id} name="body" rows={1} maxLength={2000} required disabled={pending}
              value={body} onChange={event => setBody(event.target.value)} aria-invalid={Boolean(state.error)}
              placeholder={topic === 'places' ? '가고 싶은 장소는?' : topic === 'food' ? '먹고 싶은 음식은?' : '의견을 남겨주세요'} className="max-h-32 min-h-10 min-w-0 text-sm md:text-sm" />
            <InputGroupAddon align="inline-end" className="shrink-0">
              <InputGroupButton type="submit" size="sm" variant="default" className="rounded-md" disabled={pending || !body.trim()}>{pending ? '저장 중…' : '의견 남기기'}</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError>{state.error}</FieldError>
        </Field>
        {state.saved && <p role="status" className="text-xs text-muted-foreground">의견을 남겼어요.</p>}
      </FieldGroup>
    </form>
  </section>;
}

export function PreparationList({ snapshot, changeAction, writeAction, editAction }: {
  focusedTopic?: string;
  snapshot: PreparationSnapshot; changeAction: CheckAction; writeAction: CommentAction; editAction: EditAction;
}) {
  return <div className="flex flex-col gap-8">
    <section aria-labelledby="shared-checks" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1"><h2 id="shared-checks" className="text-lg font-bold">공동 체크 리스트</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">김영욱 님이 완료하면 가족 모두에게 표시돼요.</p></div>
      {sharedItems.map(item => <Card key={item.id} className="rounded-xl">
        <CardHeader><CardTitle><CheckItem scope="shared" item={item} checked={snapshot.shared[item.id] ?? false} disabled={!snapshot.canEditShared} changeAction={changeAction} /></CardTitle>
          {'description' in item && <CardDescription className="pl-8 text-sm">{item.description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pl-12">
          <Separator />
          {item.topics.map(topic => <Opinion key={topic.id} topic={topic.id} title={topic.title} itemTitle={item.title}
            comments={snapshot.comments.filter(comment => comment.topic === topic.id)} writeAction={writeAction} editAction={editAction} />)}
        </CardContent>
      </Card>)}
    </section>
    <section aria-labelledby="family-checks" className="flex flex-col gap-3">
      <h2 id="family-checks" className="text-lg font-bold">가족 체크 리스트</h2>
      <p className="text-sm text-muted-foreground">{snapshot.familyLabel}의 준비를 함께 체크해요.</p>
      <div className="flex flex-wrap gap-3">{familyItems.map(item => <Card key={item.id} size="sm" className="max-w-full rounded-xl">
        <CardHeader className="[container-type:normal]"><CardTitle><CheckItem scope="family" item={item} checked={snapshot.family[item.id] ?? false} changeAction={changeAction} /></CardTitle></CardHeader>
      </Card>)}</div>
    </section>
    <section aria-labelledby="personal-checks" className="flex flex-col gap-3">
      <h2 id="personal-checks" className="text-lg font-bold">개별 체크 리스트</h2>
      <p className="text-sm text-muted-foreground">내 준비가 끝나면 체크해 주세요.</p>
      <div className="flex flex-wrap gap-3">{personalItems.map(item => <Card key={item.id} size="sm" className="max-w-full rounded-xl">
        <CardHeader className="[container-type:normal]"><CardTitle><CheckItem scope="personal" item={item} checked={snapshot.personal[item.id] ?? false} changeAction={changeAction} /></CardTitle></CardHeader>
      </Card>)}</div>
    </section>
  </div>;
}
