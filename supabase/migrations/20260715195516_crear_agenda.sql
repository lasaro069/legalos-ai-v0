-- 1. Tipos Enum para Agenda
create type tipo_evento_agenda as enum (
    'termino_procesal', 'audiencia', 'reunion', 'vencimiento_interno', 'otro'
);

create type estado_evento as enum (
    'pendiente', 'realizada', 'vencida', 'cancelada'
);

-- 2. Tabla de Eventos de Agenda
create table public.eventos_agenda (
    id uuid default uuid_generate_v4() primary key,
    firma_id uuid references public.firmas(id) on delete cascade not null,
    expediente_id uuid references public.expedientes(id) on delete cascade,
    titulo text not null,
    descripcion text,
    fecha_inicio timestamp with time zone not null,
    fecha_fin timestamp with time zone,
    tipo tipo_evento_agenda not null default 'termino_procesal',
    estado estado_evento not null default 'pendiente',
    responsable_id uuid references public.usuarios(id) on delete restrict,
    creado_por uuid references public.usuarios(id) on delete restrict not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.eventos_agenda enable row level security;

-- Policies para Eventos de Agenda
create policy "Agenda: Los miembros pueden ver la agenda de su firma" 
on public.eventos_agenda for select 
using (
    firma_id in (select public.get_user_firmas())
);

create policy "Agenda: Los miembros pueden crear eventos en su firma" 
on public.eventos_agenda for insert 
with check (
    firma_id in (select public.get_user_firmas())
);

create policy "Agenda: Los miembros pueden actualizar eventos de su firma" 
on public.eventos_agenda for update 
using (
    firma_id in (select public.get_user_firmas())
)
with check (
    firma_id in (select public.get_user_firmas())
);

create policy "Agenda: Los miembros pueden eliminar eventos de su firma" 
on public.eventos_agenda for delete 
using (
    firma_id in (select public.get_user_firmas())
);

-- Grants
grant select, insert, update, delete on table public.eventos_agenda to authenticated, anon;