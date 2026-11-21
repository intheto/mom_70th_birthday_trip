-- 가족 로그인은 서버 세션으로 확인하므로 브라우저의 직접 접근을 허용하지 않는다.
create table public.preparation_shared_checks (
  item_id text primary key check (item_id in ('flight', 'hotel', 'schedule', 'osaka-pass')),
  completed boolean not null default false,
  updated_at timestamptz not null default now()
);
create table public.preparation_family_checks (
  item_id text not null check (item_id in ('medicine', 'payment')),
  family_id uuid not null references public.families(id),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (family_id, item_id)
);
create table public.preparation_personal_checks (
  item_id text not null check (item_id in ('passport', 'phone')),
  member_id uuid not null references public.family_members(id),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (member_id, item_id)
);
create table public.preparation_comments (
  id uuid primary key default gen_random_uuid(),
  topic text not null check (topic in ('flight', 'hotel', 'places', 'food', 'osaka-pass')),
  member_id uuid not null references public.family_members(id),
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index preparation_comments_topic_created_idx on public.preparation_comments(topic, created_at, id);
create index preparation_comments_member_id_idx on public.preparation_comments(member_id);

alter table public.preparation_shared_checks enable row level security;
alter table public.preparation_family_checks enable row level security;
alter table public.preparation_personal_checks enable row level security;
alter table public.preparation_comments enable row level security;
revoke all on public.preparation_shared_checks, public.preparation_family_checks,
  public.preparation_personal_checks, public.preparation_comments from anon, authenticated;
grant select, insert, update on public.preparation_shared_checks,
  public.preparation_family_checks, public.preparation_personal_checks to service_role;
grant select, insert on public.preparation_comments to service_role;
