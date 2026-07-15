-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Table: firmas
create table public.firmas (
    id uuid default uuid_generate_v4() primary key,
    nombre text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- RLS
alter table public.firmas enable row level security;

-- 2. Table: usuarios
create table public.usuarios (
    id uuid references auth.users(id) on delete cascade primary key,
    email text,
    nombre_completo text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.usuarios enable row level security;

-- 3. Table: miembros_firma
create type rol_firma as enum ('propietario', 'abogado', 'auxiliar');
create type estado_miembro as enum ('activo', 'invitado', 'inactivo');

create table public.miembros_firma (
    id uuid default uuid_generate_v4() primary key,
    firma_id uuid references public.firmas(id) on delete cascade not null,
    usuario_id uuid references public.usuarios(id) on delete cascade not null,
    rol rol_firma default 'abogado' not null,
    estado estado_miembro default 'activo' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(firma_id, usuario_id)
);
alter table public.miembros_firma enable row level security;

-- 4. RLS Policies

-- Security definer function to avoid infinite recursion in RLS
create or replace function public.get_user_firmas()
returns setof uuid
language sql
security definer set search_path = public
as $$
  select firma_id from public.miembros_firma
  where usuario_id = auth.uid() and estado = 'activo';
$$;

-- Firmas: Only members can read their own firma
create policy "Los miembros pueden ver su firma" 
on public.firmas for select 
using (
    id in (select public.get_user_firmas())
);

-- Usuarios: Only users in the same firma can see each other
create policy "Usuarios ven a miembros de sus firmas"
on public.usuarios for select
using (
    id = auth.uid() or
    exists (
        select 1 from public.miembros_firma m2
        where m2.usuario_id = usuarios.id
        and m2.estado = 'activo'
        and m2.firma_id in (select public.get_user_firmas())
    )
);

-- Usuarios: Users can update their own profile
create policy "Usuarios pueden actualizar su propio perfil"
on public.usuarios for update
using ( id = auth.uid() );

-- Miembros_firma: Read access
create policy "Miembros pueden ver otros miembros de su firma"
on public.miembros_firma for select
using (
    firma_id in (select public.get_user_firmas())
);

-- 5. Triggers for User Signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
    new_firma_id uuid;
begin
    -- Create user profile
    insert into public.usuarios (id, email, nombre_completo)
    values (new.id, new.email, new.raw_user_meta_data->>'nombre_completo');
    
    -- Create default firma
    insert into public.firmas (nombre)
    values (coalesce(new.raw_user_meta_data->>'nombre_firma', 'Firma de ' || split_part(new.email, '@', 1)))
    returning id into new_firma_id;
    
    -- Assign user as owner of the new firma
    insert into public.miembros_firma (firma_id, usuario_id, rol, estado)
    values (new_firma_id, new.id, 'propietario', 'activo');

    return new;
end;
$$;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- 6. Grants
grant select, insert, update, delete on table public.firmas to authenticated, anon;
grant select, insert, update, delete on table public.usuarios to authenticated, anon;
grant select, insert, update, delete on table public.miembros_firma to authenticated, anon;
