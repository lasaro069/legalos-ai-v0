# Plan de Implementación: Módulo de Actuaciones (LegalOS)

Este plan detalla los pasos técnicos para construir el componente central del seguimiento jurídico: las **Actuaciones** (Nivel 2 del MVP), basado en la sección `8.7. ACTUACIONES` del `roadmap_proyecto.md`.

## User Review Required

> [!IMPORTANT]
> **Relación con Documentos**
> El roadmap indica que una actuación puede tener un "Documento asociado". Dado que la gestión avanzada de documentos es otro módulo posterior (8.9), ¿Estás de acuerdo con que, por ahora en el MVP, las actuaciones permitan simplemente subir un archivo a un *bucket* de Supabase Storage y guardar la URL en la tabla de actuaciones, en lugar de construir todo el gestor documental complejo aún?

## Open Questions

> [!TIP]
> **Pregunta 1: Interfaz del Historial**
> ¿Prefieres que las actuaciones dentro de un expediente se visualicen como una **"Línea de tiempo" (Timeline vertical)** estilo red social, o como una **Tabla cronológica tradicional**? La línea de tiempo suele ser más intuitiva para leer la "historia" de un caso.

## Proposed Changes

### Base de Datos y Supabase

#### [NEW] `supabase/migrations/[timestamp]_crear_actuaciones.sql`
Crearemos una nueva migración que incluirá:
1.  **Tipos Enum:**
    *   `tipo_actuacion`: 'demanda', 'admision', 'inadmision', 'rechazo', 'contestacion', 'auto', 'notificacion', 'traslado', 'memorial', 'requerimiento', 'audiencia', 'sentencia', 'recurso', 'conciliacion', 'comunicacion', 'otra'
2.  **Tabla `actuaciones`:**
    *   `id` (uuid)
    *   `expediente_id` (uuid, FK a expedientes)
    *   `tipo` (tipo_actuacion)
    *   `titulo` (text)
    *   `descripcion` (text)
    *   `fecha_juridica` (date) - *Fecha en la que ocurrió el hecho jurídico.*
    *   `creado_por` (uuid, FK a usuarios) - *Autor (fecha de creación automática).*
    *   `documento_url` (text, opcional)
    *   `anulada` (boolean, default false) - *Por criterio del roadmap: "Anular no elimina".*
    *   `motivo_anulacion` (text, opcional)
3.  **RLS Policies (Row Level Security):**
    *   Las políticas garantizarán que solo se puedan leer/crear actuaciones si el usuario tiene acceso al `expediente_id` padre (es decir, pertenece a la misma firma).

#### [NEW] Supabase Storage Bucket
*   Creación de un bucket privado `documentos_actuaciones` para almacenar los archivos adjuntos.

---

### Frontend (Next.js App Router)

#### [NEW] `app/dashboard/expedientes/[id]/page.tsx`
*   Vista de detalle de un expediente individual.
*   Panel superior con el resumen del caso (estado, riesgo, partes).
*   Panel principal central: Historial de Actuaciones (Timeline o Tabla según tu elección).
*   Botón flotante o panel lateral para "Registrar Actuación".

#### [NEW] `components/actuaciones/TimelineActuaciones.tsx`
*   Componente cliente para renderizar el historial cronológico (ordenado por `fecha_juridica`).

#### [NEW] `components/actuaciones/ActuacionForm.tsx`
*   Formulario en un modal (Dialog) o Slide-over para registrar un nuevo evento en el expediente.
*   Subida de archivo integrada con Supabase Storage.

## Verification Plan

### Manual Verification
1. Entrar al detalle de un expediente creado anteriormente.
2. Registrar un par de actuaciones (ej. una Demanda y luego un Auto Admisorio).
3. Adjuntar un documento en PDF.
4. Validar que aparecen ordenadas por su "fecha jurídica" en el historial y que el documento es descargable.
