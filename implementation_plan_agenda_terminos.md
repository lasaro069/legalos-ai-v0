# Plan de Implementación: Módulo de Agenda y Términos (LegalOS)

Este plan detalla los pasos técnicos para construir el módulo de control de vencimientos y agenda (Nivel 3 del MVP), basado en la sección `8.8. AGENDA Y TÉRMINOS` del `roadmap_proyecto.md`.

## User Review Required

> [!IMPORTANT]
> **Modelo de Eventos y Tareas**
> La agenda propuesta puede albergar desde un "Vencimiento Procesal" (que no tiene hora, solo un día límite) hasta una "Audiencia" (que sí tiene hora de inicio y fin). ¿Deseas que manejemos todo en un solo componente unificado de "Agenda", o prefieres separar conceptualmente las "Tareas/Términos" de las "Audiencias/Reuniones"? Por simplicidad inicial, el plan actual usa una tabla unificada.

## Open Questions

> [!TIP]
> **Pregunta 1: Diseño UI del Calendario**
> ¿Prefieres que la vista de agenda en el Dashboard sea un **Calendario Mensual interactivo** (tipo Google Calendar) o una **Lista de Próximos Vencimientos** (más enfocada en qué vence hoy/mañana)? (Podemos incluir ambas, pero ¿cuál sería la vista principal?)

## Proposed Changes

### Base de Datos y Supabase

#### [NEW] `supabase/migrations/[timestamp]_crear_agenda.sql`
Crearemos una nueva migración con lo siguiente:
1.  **Tipos Enum:**
    *   `tipo_evento_agenda`: 'termino_procesal', 'audiencia', 'reunion', 'vencimiento_interno', 'otro'
    *   `estado_evento`: 'pendiente', 'realizada', 'vencida', 'cancelada'
2.  **Tabla `eventos_agenda`:**
    *   `id` (uuid)
    *   `firma_id` (uuid, FK a firmas) - Aislar datos multi-tenant.
    *   `expediente_id` (uuid, FK a expedientes, opcional) - Vinculación con un caso.
    *   `titulo` (text)
    *   `descripcion` (text)
    *   `fecha_inicio` (timestamp with time zone)
    *   `fecha_fin` (timestamp with time zone, opcional)
    *   `tipo` (tipo_evento_agenda)
    *   `estado` (estado_evento)
    *   `responsable_id` (uuid, FK a usuarios) - Quién debe cumplirlo.
    *   `creado_por` (uuid, FK a usuarios)
3.  **RLS Policies (Row Level Security):**
    *   Restricción para que cada firma solo vea, edite o elimine los eventos asociados a su `firma_id`.

---

### Frontend (Next.js App Router)

#### [MODIFY] `app/dashboard/layout.tsx`
*   Agregar el enlace "Agenda" en el Navbar superior para fácil acceso.

#### [NEW] `app/dashboard/agenda/page.tsx`
*   Módulo principal de la Agenda.
*   Contendrá una vista para cambiar entre Lista y Calendario (dependiendo de la librería de UI que usemos, ej. FullCalendar o una lista propia).

#### [NEW] `components/agenda/ListaVencimientos.tsx`
*   Componente visual que resalte en rojo los eventos `vencidos`, en amarillo los que vencen en los próximos 3 días, y en verde/gris los futuros.

#### [NEW] `app/dashboard/agenda/nuevo/page.tsx` (o un Modal)
*   Formulario para crear un evento/término.
*   Permitirá buscar y seleccionar un `expediente_id` (opcional) usando un menú desplegable para atarlo a un caso.

#### [MODIFY] `app/dashboard/expedientes/[id]/page.tsx`
*   Añadir una pequeña tarjeta o sección lateral dentro del detalle de un Expediente para mostrar **"Términos Pendientes de este Expediente"**.

## Verification Plan

### Manual Verification
1. Entrar a la pestaña Agenda.
2. Crear un vencimiento para el día de hoy, vinculado a un expediente existente.
3. Crear un vencimiento para la próxima semana (ej. Audiencia).
4. Verificar que aparecen en la lista/calendario, con sus respectivos códigos de color.
5. Ir al detalle del expediente vinculado y comprobar que el vencimiento también se refleja allí.
