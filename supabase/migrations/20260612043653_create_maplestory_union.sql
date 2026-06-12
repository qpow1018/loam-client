create table if not exists public.maplestory_union_characters (
  id uuid primary key default gen_random_uuid(),
  class_name text not null unique,
  union_effect text not null,
  link_effect text not null,
  group_key text not null,
  default_sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint maplestory_union_characters_group_key_check
    check (group_key in ('special1', 'luk', 'str', 'dex', 'int', 'special2')),
  constraint maplestory_union_characters_default_sort_order_check
    check (default_sort_order >= 0),
  constraint maplestory_union_characters_group_sort_key
    unique (group_key, default_sort_order)
);

create table if not exists public.maplestory_union_user_states (
  user_id uuid not null references auth.users(id) on delete cascade,
  character_id uuid not null references public.maplestory_union_characters(id) on delete cascade,
  level integer,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, character_id),
  constraint maplestory_union_user_states_level_check
    check (level is null or level between 0 and 300),
  constraint maplestory_union_user_states_sort_order_check
    check (sort_order >= 0)
);

create index if not exists maplestory_union_user_states_user_id_sort_order_idx
  on public.maplestory_union_user_states (user_id, sort_order);

drop trigger if exists set_maplestory_union_characters_updated_at
  on public.maplestory_union_characters;

create trigger set_maplestory_union_characters_updated_at
  before update on public.maplestory_union_characters
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_maplestory_union_user_states_updated_at
  on public.maplestory_union_user_states;

create trigger set_maplestory_union_user_states_updated_at
  before update on public.maplestory_union_user_states
  for each row
  execute function public.set_updated_at();

grant select on public.maplestory_union_characters to authenticated;
grant select, insert, update on public.maplestory_union_user_states to authenticated;

alter table public.maplestory_union_characters enable row level security;
alter table public.maplestory_union_user_states enable row level security;

create policy "Authenticated users can view MapleStory union characters"
  on public.maplestory_union_characters
  for select
  to authenticated
  using (true);

create policy "Users can view their own MapleStory union states"
  on public.maplestory_union_user_states
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own MapleStory union states"
  on public.maplestory_union_user_states
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own MapleStory union states"
  on public.maplestory_union_user_states
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

insert into public.maplestory_union_characters (
  class_name,
  union_effect,
  link_effect,
  group_key,
  default_sort_order
)
values
  ('신궁', '크리티컬 확률 증가', '크리티컬 확률', 'special1', 0),
  ('나이트로드', '크리티컬 확률 증가', '상추뎀', 'special1', 1),
  ('메르세데스', '스킬 쿨타임 감소', '경험치 추가', 'special1', 2),
  ('데몬 어벤져', '보스 공격력 증가', '데미지 증가', 'special1', 3),
  ('블래스터', '방어율 무시 증가', '부활 무적', 'special1', 4),
  ('와일드헌터', '공격 시 확률 데미지 증가', '부활 무적', 'special1', 5),
  ('메카닉', '버프 지속시간 증가', '부활 무적', 'special1', 6),
  ('은월', '크리티컬 데미지 증가', '확률 생존', 'special1', 7),
  ('렌', '이동속도 증가', '피해 감소', 'special1', 8),
  ('제로', '경험치 증가', '공격 시 방어율 무시', 'special1', 9),
  ('팬텀', '메소 획득량 증가', '크리티컬 확률', 'special1', 10),
  ('캡틴', '소환수 지속시간 증가', '올스탯', 'special1', 11),
  ('아란', '확률 HP 회복', '콤보킬 경험치', 'special1', 12),
  ('나이트워커', '럭 증가', '공마/ 내성', 'luk', 0),
  ('섀도어', '럭 증가', '상추뎀', 'luk', 1),
  ('듀얼블레이더', '럭 증가', '상추뎀', 'luk', 2),
  ('카데나', '럭 증가', '데미지', 'luk', 3),
  ('호영', '럭 증가', '방어율 무시', 'luk', 4),
  ('제논', '힘/덱/럭 증가', '올스탯%', 'luk', 5),
  ('칼리', '럭 증가', '데미지', 'luk', 6),
  ('스트라이커', '힘 증가', '공마/ 내성', 'str', 0),
  ('카이저', '힘 증가', '최대 HP', 'str', 1),
  ('바이퍼', '힘 증가', '올스탯', 'str', 2),
  ('히어로', '힘 증가', '피 회복', 'str', 3),
  ('팔라딘', '힘 증가', '피 회복', 'str', 4),
  ('캐논마스터', '힘 증가', '올스탯', 'str', 5),
  ('아크', '힘 증가', '데미지', 'str', 6),
  ('아델', '힘 증가', '파티 데미지', 'str', 7),
  ('보우마스터', '덱 증가', '크리티컬 확률', 'dex', 0),
  ('윈드브레이커', '덱 증가', '공마/ 내성', 'dex', 1),
  ('엔젤릭버스터', '덱 증가', '극딜', 'dex', 2),
  ('패스파인더', '덱 증가', '크리티컬 확률', 'dex', 3),
  ('카인', '덱 증가', '보스 데미지', 'dex', 4),
  ('아크메이지(썬,콜)', '인트 증가', '방무, 보공', 'int', 0),
  ('비숍', '인트 증가', '방무, 보공', 'int', 1),
  ('배틀메이지', '인트 증가', '부활 무적', 'int', 2),
  ('루미너스', '인트 증가', '방어율 무시', 'int', 3),
  ('플레임위자드', '인트 증가', '공마/ 내성', 'int', 4),
  ('키네시스', '인트 증가', '크리티컬 데미지', 'int', 5),
  ('일리움', '인트 증가', '데미지', 'int', 6),
  ('라라', '인트 증가', '일몹뎀', 'int', 7),
  ('소울마스터', '최대 HP 증가', '공마/ 내성', 'special2', 0),
  ('미하일', '최대 HP 증가', '상태 이상 내성', 'special2', 1),
  ('에반', '확률 MP 회복', '룬 지속시간', 'special2', 2),
  ('다크나이트', '최대 HP 증가', '피 회복', 'special2', 3),
  ('아크메이지(불,독)', '최대 MP 증가', '방무, 보공', 'special2', 4),
  ('데몬 슬레이어', '상태이상 저항', '보공', 'special2', 5)
on conflict (class_name) do update
set
  union_effect = excluded.union_effect,
  link_effect = excluded.link_effect,
  group_key = excluded.group_key,
  default_sort_order = excluded.default_sort_order;
