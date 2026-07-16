-- 1. Añadir campos a la tabla usuarios
alter table public.usuarios 
add column es_superadmin boolean default false not null,
add column requiere_cambio_password boolean default false not null;

-- 2. Añadir campos a la tabla firmas
alter table public.firmas
add column ciudad text,
add column pais text,
add column zona_horaria text,
add column informacion_contacto text,
add column logo_url text;

-- 3. Modificar el trigger de nuevo usuario para NO crear firma automáticamente
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    -- Create user profile only
    insert into public.usuarios (id, email, nombre_completo)
    values (new.id, new.email, new.raw_user_meta_data->>'nombre_completo');
    
    return new;
end;
$$;

-- 4. Modificar políticas de firmas para permitir al superadmin ver y crear
create or replace function public.is_superadmin()
returns boolean
language sql
security definer set search_path = public
as $$
  select es_superadmin from public.usuarios where id = auth.uid();
$$;

create policy "Superadmins pueden ver todas las firmas v2" 
on public.firmas for all 
using (public.is_superadmin());

create policy "Superadmins ven a todos los usuarios v2"
on public.usuarios for all
using (public.is_superadmin());

create policy "Superadmins ven a todos los miembros v2"
on public.miembros_firma for all
using (public.is_superadmin());

-- 5. GRANTS for service_role
grant all on table public.firmas to service_role;
grant all on table public.usuarios to service_role;
grant all on table public.miembros_firma to service_role;
