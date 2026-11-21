create table public.guestbook_comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.guestbook_entries(id) on delete cascade,
  member_id uuid not null references public.family_members(id),
  body text not null check (char_length(btrim(body)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index guestbook_comments_entry_created_idx
  on public.guestbook_comments (entry_id, created_at, id);
create index guestbook_comments_member_id_idx
  on public.guestbook_comments (member_id);

alter table public.guestbook_comments enable row level security;
revoke all on public.guestbook_comments from anon, authenticated;
grant select, insert on public.guestbook_comments to service_role;
