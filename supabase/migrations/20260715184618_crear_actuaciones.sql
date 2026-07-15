-- 1. Tipos Enum para Actuaciones
create type tipo_actuacion as enum (
    'demanda', 'admision', 'inadmision', 'rechazo', 'contestacion', 
    'auto', 'notificacion', 'traslado', 'memorial', 'requerimiento', 
    'audiencia', 'sentencia', 'recurso', 'conciliacion', 'comunicacion', 'otra'
);

-- 2. Tabla de Actuaciones
create table public.actuaciones (
    id uuid default uuid_generate_v4() primary key,
    expediente_id uuid references public.expedientes(id) on delete cascade not null,
    tipo tipo_actuacion not null,
    titulo text not null,
    descripcion text,
    fecha_juridica date not null,
    creado_por uuid references public.usuarios(id) on delete restrict not null,
    documento_url text,
    anulada boolean default false not null,
    motivo_anulacion text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.actuaciones enable row level security;

-- Policies para Actuaciones (heredan permisos del expediente)
create policy "Actuaciones: Lectura si tiene acceso al expediente" 
on public.actuaciones for select 
using (
    exists (
        select 1 from public.expedientes
        where expedientes.id = actuaciones.expediente_id
        and expedientes.firma_id in (select public.get_user_firmas())
    )
);

create policy "Actuaciones: Insercion si tiene acceso al expediente" 
on public.actuaciones for insert 
with check (
    exists (
        select 1 from public.expedientes
        where expedientes.id = actuaciones.expediente_id
        and expedientes.firma_id in (select public.get_user_firmas())
    )
);

create policy "Actuaciones: Actualizacion si tiene acceso al expediente" 
on public.actuaciones for update 
using (
    exists (
        select 1 from public.expedientes
        where expedientes.id = actuaciones.expediente_id
        and expedientes.firma_id in (select public.get_user_firmas())
    )
)
with check (
    exists (
        select 1 from public.expedientes
        where expedientes.id = actuaciones.expediente_id
        and expedientes.firma_id in (select public.get_user_firmas())
    )
);

-- Grants
grant select, insert, update, delete on table public.actuaciones to authenticated, anon;

-- 3. Supabase Storage Bucket
insert into storage.buckets (id, name, public)
values ('documentos_actuaciones', 'documentos_actuaciones', true)
on conflict (id) do nothing;

-- RLS para Storage
create policy "Storage: Los miembros pueden ver documentos de su firma"
on storage.objects for select
using (
    bucket_id = 'documentos_actuaciones'
    and auth.uid() in (
        select u.id from public.usuarios u
        join public.miembros_firma m on m.usuario_id = u.id
    )
);

create policy "Storage: Los miembros pueden subir documentos"
on storage.objects for insert
with check (
    bucket_id = 'documentos_actuaciones'
    and auth.uid() in (
        select u.id from public.usuarios u
        join public.miembros_firma m on m.usuario_id = u.id
    )
);