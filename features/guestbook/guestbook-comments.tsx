'use client';

import { useActionState, useId, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@/components/ui/input-group';
import type { GuestbookComment, GuestbookState, WriteCommentAction } from './types';

export function GuestbookComments({ entryId, comments, name, writeAction }: {
  entryId: string; comments: GuestbookComment[]; name: string;
  writeAction: WriteCommentAction;
}) {
  const id = useId();
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

  return <section aria-label={`${name} 님이 참여하는 댓글`} className="mt-4 ml-3 flex min-w-0 flex-col gap-3 rounded-lg bg-muted p-3">
    <h3 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
      <MessageSquare aria-hidden="true" className="size-3.5" />
      댓글 <span className="font-normal">{comments.length}</span>
    </h3>
    {comments.length > 0 && <ul aria-label="댓글 목록" className="flex flex-col gap-2">
      {comments.map(comment => <li key={comment.id} className="flex items-start gap-2">
        <strong className="shrink-0 pt-0.5 text-xs leading-relaxed text-muted-foreground">{comment.author}</strong>
        <p className="min-w-0 whitespace-pre-wrap wrap-anywhere text-sm leading-relaxed">{comment.body}</p>
      </li>)}
    </ul>}
    <form action={action}>
      <FieldGroup className="gap-2">
        <Field data-invalid={Boolean(state.error)}>
          <FieldLabel htmlFor={id} className="sr-only">{name} 님으로 댓글 남기기</FieldLabel>
          <InputGroup className="items-end rounded-lg bg-background has-disabled:bg-background has-disabled:opacity-100">
            <InputGroupTextarea id={id} name="body" rows={1} maxLength={500} required disabled={pending}
              value={body} onChange={event => setBody(event.target.value)} aria-invalid={Boolean(state.error)}
              placeholder="이 이야기에 답해 주세요" className="max-h-32 min-h-10 min-w-0" />
            <InputGroupAddon align="inline-end" className="shrink-0">
              <InputGroupButton type="submit" size="sm" variant="default" className="rounded-md"
                disabled={pending || !body.trim()}>{pending ? '댓글 저장 중…' : '댓글 남기기'}</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {!pending && <FieldError>{state.error}</FieldError>}
        </Field>
        {state.saved && !pending && <p role="status" className="text-xs text-muted-foreground">댓글을 남겼어요.</p>}
      </FieldGroup>
    </form>
  </section>;
}
