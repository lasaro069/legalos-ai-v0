# Módulo de Expedientes - Plan de Implementación

El objetivo de este plan es completar y robustecer el módulo de **Expedientes (Casos)**, asegurando que capture toda la información necesaria (como la cuantía, estado, área jurídica) y alimente correctamente la Bandeja del Día.

## User Review Required

> [!IMPORTANT]
> Revisa los nuevos campos que agregaremos al formulario de creación de expedientes. ¿Falta algún campo crucial para tu firma?

## Open Questions

> [!NOTE]
> 1. Para el campo **Área Jurídica**, ¿prefieres que sea un texto libre o un menú desplegable con opciones predefinidas? (Ej. Civil, Penal, Laboral, Familia). Si prefieres menú, ¿cuáles serían las opciones base?
> 2. Para el campo **Estado** al crear un expediente, el valor por defecto es `activo`. ¿Deseas que el abogado pueda elegir crear un expediente como `archivado` o `cerrado` desde el principio, o solo `activo`?

## Proposed Changes

### Componente de Expedientes (Frontend y Backend)

#### [MODIFY] [nuevo/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/nuevo/page.tsx)
- Añadir campo para **Cuantía** (Numérico, esencial para el KPI del dashboard).
- Añadir campo para **Estado** (Dropdown: Activo, Archivado, Cerrado).
- Añadir campo para **Área Jurídica** (Dropdown o texto).
- Añadir campo para **Tipo de Proceso** (Texto libre, ej: Ejecutivo, Ordinario).
- Añadir campo para **Autoridad / Juzgado** (Texto libre).
- Mejorar el diseño del formulario para agrupar los campos lógicamente (Ej: "Datos Básicos", "Datos Financieros y de Riesgo", "Datos Judiciales").

#### [MODIFY] [acciones.ts](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/acciones.ts)
- Actualizar la función `guardarExpediente` para capturar e insertar los nuevos campos (`cuantia`, `estado`, `area_juridica`, `tipo_proceso`, `autoridad`) en la base de datos de Supabase.

#### [MODIFY] [[id]/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/[id]/page.tsx)
- Actualizar la vista de detalle del expediente para mostrar la Cuantía (formateada en COP), el Área Jurídica, el Tipo de Proceso y la Autoridad.

#### [MODIFY] [ExpedientesKanban.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/components/expedientes/ExpedientesKanban.tsx)
- Añadir la visualización de la cuantía en las tarjetas miniatura del tablero Kanban.

## Verification Plan

### Manual Verification
1. Ir a la vista de "Nuevo Expediente".
2. Completar todos los campos del formulario, incluyendo los nuevos (Cuantía, Estado).
3. Guardar el expediente y verificar en la vista de detalle (`[id]/page.tsx`) que los datos se renderizan correctamente.
4. Navegar al Dashboard y confirmar que la **Cuantía Activa** se ha sumado de forma automática y precisa.
