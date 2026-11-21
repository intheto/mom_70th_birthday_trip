create table public.families (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  sort_order integer not null,
  pin_hash text not null,
  created_at timestamptz not null default now()
);

create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id),
  name text not null unique,
  sort_order integer not null,
  created_at timestamptz not null default now()
);
create index family_members_family_id_idx on public.family_members (family_id);

create table public.family_sessions (
  token_hash text primary key,
  member_id uuid not null references public.family_members(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  constraint family_sessions_expiry check (expires_at > created_at)
);
create index family_sessions_member_id_idx on public.family_sessions (member_id);

create table public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.family_members(id),
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index guestbook_entries_member_id_idx on public.guestbook_entries (member_id);
create index guestbook_entries_created_idx on public.guestbook_entries (created_at desc, id desc);

-- 네 자리 가족 암호는 Next.js 서버에서 검증합니다.
-- 브라우저의 Data API 직접 접근은 허용하지 않습니다.
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.family_sessions enable row level security;
alter table public.guestbook_entries enable row level security;
revoke all on public.families, public.family_members, public.family_sessions, public.guestbook_entries from anon, authenticated;
grant all on public.families, public.family_members, public.family_sessions, public.guestbook_entries to service_role;
