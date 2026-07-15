# Plan de Implementación: Módulo de Expedientes (LegalOS)

Este plan detalla los pasos técnicos para construir el Nivel 2 del MVP (Gestión de Expedientes) de acuerdo a lo definido en la sección `8.5. EXPEDIENTES` del `roadmap_proyecto.md`.

## User Review Required

> [!IMPORTANT]
> **Esquema de Base de Datos inicial**
> Por favor, revisa los campos propuestos para la tabla `expedientes`. ¿Hay algún campo adicional que consideres estrictamente necesario para esta versión MVP?

## Open Questions

> [!TIP]
> **Pregunta 1: Clientes y Partes**
> El roadmap menciona "Cliente" y "Partes". ¿Quieres que en este hito también implementemos las tablas de `clientes` y `partes` para poder vincularlas al expediente, o prefieres que inicialmente (para probar rápido) dejemos esos campos como texto libre en el expediente y luego los normalizamos en su propio hito?

> [!TIP]
> **Pregunta 2: Diseño UI**
> ¿Prefieres que la vista principal de expedientes sea una tabla de datos (Data Table) con filtros avanzados, o un tablero estilo Kanban organizado por estado/etapa procesal? (Normalmente para abogados la tabla es más cómoda para buscar radicados).

## Proposed Changes

### Base de Datos y Supabase

#### [NEW] `supabase/migrations/[timestamp]_crear_expedientes.sql`
Crearemos una nueva migración que incluirá:
1.  **Tipos Enum:**
    *   `estado_expediente`: 'activo', 'archivado', 'cerrado'
    *   `riesgo_expediente`: 'bajo', 'medio', 'alto', 'critico'
    *   `prioridad_expediente`: 'baja', 'normal', 'alta', 'urgente'
2.  **Tabla `expedientes`:**
    *   `id` (uuid)
    *   `firma_id` (uuid, FK a firmas)
    *   `nombre` (text)
    *   `descripcion` (text)
    *   `area_juridica` (text)
    *   `tipo_proceso` (text)
    *   `estado` (estado_expediente)
    *   `etapa` (text)
    *   `riesgo` (riesgo_expediente)
    *   `prioridad` (prioridad_expediente)
    *   `responsable_id` (uuid, FK a miembros_firma)
    *   `auxiliar_id` (uuid, FK a miembros_firma, opcional)
    *   `radicado` (text)
    *   `autoridad` (text)
    *   `ciudad` (text)
    *   `cuantia` (numeric, opcional)
3.  **RLS Policies (Row Level Security):**
    *   Solo los miembros activos de la firma pueden seleccionar, insertar o actualizar los expedientes que pertenezcan a su `firma_id` (usando la función `get_user_firmas()` que creamos anteriormente).

---

### Frontend (Next.js App Router)

#### [MODIFY] `app/dashboard/layout.tsx` (o un nuevo `components/Sidebar.tsx`)
Agregar la navegación lateral con el enlace a "Expedientes".

#### [NEW] `app/dashboard/expedientes/page.tsx`
Página principal del módulo. Contendrá:
*   Encabezado con título y botón "Nuevo Expediente".
*   Tabla de datos (Data Table) con los expedientes de la firma.
*   Filtros de búsqueda rápida (por nombre, radicado, estado).

#### [NEW] `components/expedientes/ExpedientesTable.tsx`
Componente cliente (Client Component) para renderizar la tabla con paginación y acciones rápidas.

#### [NEW] `app/dashboard/expedientes/nuevo/page.tsx`
Página con el formulario para crear un nuevo expediente.

#### [NEW] `components/expedientes/ExpedienteForm.tsx`
Formulario reactivo construido con `react-hook-form` y validado con `zod`. Incluirá todos los campos definidos en la base de datos.

## Verification Plan

### Manual Verification
1. Ingresar con el usuario propietario y crear un nuevo expediente exitosamente.
2. Comprobar que el expediente aparece listado en la tabla.
3. Invitar (o simular) a un segundo usuario de una firma **diferente**, y confirmar que el RLS de Supabase le impide ver el expediente de la primera firma.
