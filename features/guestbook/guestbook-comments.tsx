'use client';

import { useActionState, useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { GuestbookComment, GuestbookState, WriteCommentAction } from './types';

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
});

export function GuestbookComments({ entryId, comments, name, writeAction, initiallyOpen = false }: {
  entryId: string; comments: GuestbookComment[]; name: string;
  writeAction: WriteCommentAction; initiallyOpen?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(initiallyOpen);
  const [body, setBody] = useState('');
  const [state, action, pending] = useActionState(async (previous: GuestbookState, form: FormData) => {
    try {
      const result = await writeAction(entryId, previous, form);
      if (result.saved) setBody('');
      return result;
    } catch {
      return { error: '댓글을 저장하지 못했어요. 내용은 남아 있으니 다시 시도해 주세요.', saved: false };
    }
  }, { error: '', saved: false });

  return <Collapsible open={open} onOpenChange={setOpen} className="mt-3">
    <CollapsibleTrigger render={<Button variant="ghost" size="sm" className="min-h-10" />}>
      댓글 {comments.length}<span aria-hidden="true">{open ? '⌃' : '⌄'}</span>
    </CollapsibleTrigger>
    <CollapsibleContent keepMounted>
      <section aria-label={`${name} 님이 참여하는 댓글`} className="mt-2 flex flex-col gap-4 rounded-xl bg-muted p-4">
        {comments.length ? <ul aria-label="댓글 목록" className="flex flex-col gap-3 divide-y">
          {comments.map(comment => <li key={comment.id} className="flex flex-col gap-1 pb-3 last:pb-0">
            <div className="flex flex-wrap items-baseline gap-2"><strong className="text-sm">{comment.author}</strong><time dateTime={comment.createdAt} className="text-xs text-muted-foreground">{dateFormat.format(new Date(comment.createdAt))}</time></div>
            <p className="whitespace-pre-wrap wrap-anywhere text-sm leading-relaxed">{comment.body}</p>
          </li>)}
        </ul> : <p className="text-sm text-muted-foreground">아직 댓글이 없어요. 첫 댓글을 남겨주세요.</p>}
        <form action={action}>
          <FieldGroup className="gap-3">
            <Field data-invalid={Boolean(state.error)}>
              <FieldLabel htmlFor={id}>{name} 님으로 댓글 남기기</FieldLabel>
              <Textarea id={id} name="body" rows={2} maxLength={500} required disabled={pending}
                value={body} onChange={event => setBody(event.target.value)} aria-invalid={Boolean(state.error)}
                placeholder="이 이야기에 답해 주세요" className="rounded-lg" />
              <FieldDescription>{body.length.toLocaleString('ko-KR')} / 500자</FieldDescription>
              {!pending && <FieldError>{state.error}</FieldError>}
            </Field>
            <div className="flex justify-end"><Button type="submit" disabled={pending || !body.trim()} className="min-h-10 rounded-lg">{pending ? '댓글 저장 중…' : '댓글 남기기'}</Button></div>
            {state.saved && !pending && <p role="status" className="text-sm text-primary">댓글을 남겼어요.</p>}
          </FieldGroup>
        </form>
      </section>
    </CollapsibleContent>
  </Collapsible>;
}
