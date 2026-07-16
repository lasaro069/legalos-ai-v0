-- 1. Tipos Enum
create type tipo_persona as enum ('natural', 'juridica');
create type tipo_identificacion as enum ('cc', 'nit', 'ce', 'pasaporte', 'otro');
create type estado_contacto as enum ('activo', 'inactivo');

-- 2. Tabla Contactos
create table public.contactos (
    id uuid not null default uuid_generate_v4() primary key,
    firma_id uuid not null references public.firmas(id) on delete cascade,
    tipo_persona tipo_persona not null default 'natural',
    nombre text not null,
    identificacion text,
    tipo_identificacion tipo_identificacion default 'cc',
    correo text,
    telefono text,
    direccion text,
    ciudad text,
    estado estado_contacto default 'activo',
    observaciones text,
    creado_por uuid not null references auth.users(id) on delete restrict,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- 3. Índices de búsqueda
create index idx_contactos_firma_id on public.contactos(firma_id);
create index idx_contactos_nombre on public.contactos(nombre);
create index idx_contactos_identificacion on public.contactos(identificacion);

-- 4. Alterar Expedientes para vincular Cliente
alter table public.expedientes add column cliente_id uuid references public.contactos(id) on delete set null;

-- 5. Row Level Security (RLS)
alter table public.contactos enable row level security;

-- Política de visualización
create policy "Contactos: Los miembros pueden ver contactos de su firma"
on public.contactos for select
using (
  firma_id in (
    select firma_id from public.miembros_firma where usuario_id = auth.uid()
  )
);

-- Política de inserción
create policy "Contactos: Los miembros pueden crear contactos en su firma"
on public.contactos for insert
with check (
  firma_id in (
    select firma_id from public.miembros_firma where usuario_id = auth.uid()
  )
);

-- Política de actualización
create policy "Contactos: Los miembros pueden actualizar contactos de su firma"
on public.contactos for update
using (
  firma_id in (
    select firma_id from public.miembros_firma where usuario_id = auth.uid()
  )
);

-- 6. Permisos (Grants)
grant select, insert, update, delete on table public.contactos to authenticated, anon;

