import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';
import { GuestbookComments } from './guestbook-comments';
import type { GuestbookEntry, WriteCommentAction } from './types';

const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
});

export function GuestbookList({ entries, name, writeCommentAction }: {
  entries: GuestbookEntry[]; name: string; writeCommentAction: WriteCommentAction;
}) {
  if (!entries.length) return <Empty><EmptyHeader><EmptyTitle>우리 가족의 첫 한마디를 기다려요</EmptyTitle><EmptyDescription>여행에 대한 기대나 전하고 싶은 말을 남겨주세요.</EmptyDescription></EmptyHeader></Empty>;
  return <div className="divide-y">{entries.map((entry, index) => <article key={entry.id} id={`news-${entry.id}`} data-news-id={entry.id} data-news-kind="guestbook" className="py-5 first:pt-0">
    <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm">{entry.author}</strong><time dateTime={entry.createdAt} className="text-xs text-muted-foreground">{dateFormat.format(new Date(entry.createdAt))}</time></div>
    <p className="mt-3 whitespace-pre-wrap wrap-anywhere text-base leading-relaxed">{entry.body}</p>
    <GuestbookComments entryId={entry.id} comments={entry.comments} name={name} writeAction={writeCommentAction} initiallyOpen={index === 0} />
  </article>)}</div>;
}
