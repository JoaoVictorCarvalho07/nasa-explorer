-- rodar no SQL Editor do Supabase

create table if not exists public.favoritos (
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  nasa_id text not null,
  titulo text not null,
  thumb text,
  criado_em timestamptz not null default now(),
  primary key (user_id, nasa_id)
);

create table if not exists public.vistos (
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  nasa_id text not null,
  titulo text not null,
  thumb text,
  nota smallint not null check (nota between 1 and 5),
  criado_em timestamptz not null default now(),
  primary key (user_id, nasa_id)
);

alter table public.favoritos enable row level security;
alter table public.vistos enable row level security;

-- cada usuário só vê e mexe nas próprias linhas
create policy "favoritos do proprio usuario" on public.favoritos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "vistos do proprio usuario" on public.vistos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
