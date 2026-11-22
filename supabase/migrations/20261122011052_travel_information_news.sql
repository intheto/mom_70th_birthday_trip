alter table public.news_reads drop constraint news_reads_kind_check;
alter table public.news_reads add constraint news_reads_kind_check
  check (kind in ('guestbook', 'opinion', 'travel'));
