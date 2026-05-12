
create table public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  nivel text not null default 'iniciante' check (nivel in ('iniciante','intermédio','avançado')),
  pontos integer not null default 0,
  criado_em timestamptz not null default now()
);

alter table public.perfis enable row level security;

create policy "Ver próprio perfil" on public.perfis for select using (auth.uid() = id);
create policy "Atualizar próprio perfil" on public.perfis for update using (auth.uid() = id);
create policy "Inserir próprio perfil" on public.perfis for insert with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
