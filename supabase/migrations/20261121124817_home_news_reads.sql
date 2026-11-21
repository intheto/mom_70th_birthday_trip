create table public.news_reads (
 member_id uuid not null references public.family_members(id) on delete cascade,
 kind text not null check (kind in ('guestbook', 'opinion')),
 news_id uuid not null,
 read_at timestamptz not null default now(),
 primary key (member_id, kind, news_id)
);
alter table public.news_reads enable row level security;
revoke all on public.news_reads from anon, authenticated;
grant all on public.news_reads to service_role;
