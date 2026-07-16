-- 1. Añadir campos a la tabla usuarios
alter table public.usuarios 
add column if not exists celular text,
add column if not exists telefono_fijo text,
add column if not exists direccion text,
add column if not exists ciudad text,
add column if not exists departamento text,
add column if not exists pais text,
add column if not exists correo_alterno text;

-- 2. Añadir campos a la tabla firmas
alter table public.firmas
add column if not exists departamento text,
add column if not exists direccion text,
add column if not exists telefono text,
add column if not exists celular text,
add column if not exists email text;

-- 3. Crear Storage Bucket para logos
insert into storage.buckets (id, name, public)
values ('firmas_logos', 'firmas_logos', true)
on conflict (id) do update set public = true;

-- 4. Políticas RLS para el Bucket de logos
create policy "Logos de firmas accesibles publicamente"
on storage.objects for select
using ( bucket_id = 'firmas_logos' );

create policy "Usuarios autenticados pueden subir logos"
on storage.objects for insert
with check ( bucket_id = 'firmas_logos' and auth.role() = 'authenticated' );

create policy "Usuarios autenticados pueden actualizar logos"
on storage.objects for update
using ( bucket_id = 'firmas_logos' and auth.role() = 'authenticated' );
