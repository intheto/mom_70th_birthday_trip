'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Field, FieldLabel, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { GuestbookState } from './types';

export function GuestbookCompose({ name, writeAction }: {
  name: string;
  writeAction: (state: GuestbookState, form: FormData) => Promise<GuestbookState>;
}) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState('');
  const [state, action, pending] = useActionState(async (previous: GuestbookState, form: FormData) => {
    try {
      const result = await writeAction(previous, form);
      if (result.saved) { setBody(''); setOpen(false); }
      return result;
    } catch {
      return { error: '글을 저장하지 못했어요. 입력한 내용은 남아 있으니 다시 시도해 주세요.', saved: false };
    }
  }, { error: '', saved: false });

  return <>
    <Dialog open={open} onOpenChange={value => { if (!pending) setOpen(value); }}>
      <Card className="rounded-xl">
        <CardHeader><CardTitle>가족에게 전하고 싶은 말이 있나요?</CardTitle><CardDescription>{name} 님의 이름으로 남겨요.</CardDescription></CardHeader>
        <CardFooter><DialogTrigger render={<Button className="min-h-11 w-full" />}>한마디 남기기 ＋</DialogTrigger></CardFooter>
      </Card>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader><DialogTitle>가족에게 한마디</DialogTitle><DialogDescription>{name} 님의 이름으로 남겨요. 여행 이야기, 고마운 마음, 작은 안부도 좋아요.</DialogDescription></DialogHeader>
        <form action={action}>
          <FieldGroup>
            <Field data-invalid={Boolean(state.error)}>
              <FieldLabel htmlFor="guestbook-body">남기고 싶은 이야기</FieldLabel>
              <Textarea id="guestbook-body" name="body" rows={6} maxLength={2000} required value={body} onChange={event => setBody(event.target.value)} disabled={pending} aria-invalid={Boolean(state.error)} placeholder="가족들과 함께할 오사카 여행, 어떤 마음인가요?" />
              <FieldDescription>{body.length.toLocaleString('ko-KR')} / 2,000자</FieldDescription>
            </Field>
            {state.error && <Alert variant="destructive"><AlertDescription>{state.error}</AlertDescription></Alert>}
            <Button type="submit" disabled={pending || !body.trim()} className="min-h-11 w-full">{pending ? '이야기 저장 중…' : '방명록에 남기기'}</Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
    {state.saved && !open && <p role="status" className="text-sm text-primary">가족에게 한마디를 남겼어요.</p>}
  </>;
}
