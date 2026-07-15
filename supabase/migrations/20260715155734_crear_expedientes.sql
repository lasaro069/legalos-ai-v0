-- 1. Tipos Enum para Expedientes
create type estado_expediente as enum ('activo', 'archivado', 'cerrado');
create type riesgo_expediente as enum ('bajo', 'medio', 'alto', 'critico');
create type prioridad_expediente as enum ('baja', 'normal', 'alta', 'urgente');

-- 2. Tabla de Expedientes
create table public.expedientes (
    id uuid default uuid_generate_v4() primary key,
    firma_id uuid references public.firmas(id) on delete cascade not null,
    nombre text not null,
    descripcion text,
    area_juridica text,
    tipo_proceso text,
    estado estado_expediente default 'activo' not null,
    etapa text,
    riesgo riesgo_expediente default 'bajo' not null,
    prioridad prioridad_expediente default 'normal' not null,
    responsable_id uuid references public.miembros_firma(id) on delete restrict,
    auxiliar_id uuid references public.miembros_firma(id) on delete set null,
    radicado text,
    autoridad text,
    ciudad text,
    cuantia numeric(15,2),
    cliente text, -- Texto libre (feedback del MVP)
    partes text,  -- Texto libre (feedback del MVP)
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.expedientes enable row level security;

-- Policies para Expedientes
create policy "Expedientes: Los miembros pueden ver los expedientes de su firma" 
on public.expedientes for select 
using (
    firma_id in (select public.get_user_firmas())
);

create policy "Expedientes: Los miembros pueden crear expedientes en su firma" 
on public.expedientes for insert 
with check (
    firma_id in (select public.get_user_firmas())
);

create policy "Expedientes: Los miembros pueden actualizar expedientes de su firma" 
on public.expedientes for update 
using (
    firma_id in (select public.get_user_firmas())
)
with check (
    firma_id in (select public.get_user_firmas())
);

create policy "Expedientes: Solo propietarios/responsables pueden eliminar" 
on public.expedientes for delete 
using (
    firma_id in (select public.get_user_firmas())
    and (
        exists (
            select 1 from public.miembros_firma 
            where miembros_firma.id = expedientes.responsable_id 
            and miembros_firma.usuario_id = auth.uid()
        )
        or
        exists (
            select 1 from public.miembros_firma 
            where miembros_firma.firma_id = expedientes.firma_id
            and miembros_firma.usuario_id = auth.uid()
            and miembros_firma.rol = 'propietario'
        )
    )
);

-- Grants
grant select, insert, update, delete on table public.expedientes to authenticated, anon;
