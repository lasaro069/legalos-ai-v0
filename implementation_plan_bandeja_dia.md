# Plan de Implementación: Bandeja del Día (Dashboard Principal)

Este plan describe la construcción del tablero operativo principal (Nivel 2 y 3 del MVP) para el abogado, basado en la sección `8.13. BANDEJA DEL DÍA` del roadmap. 

El objetivo es transformar la página de inicio en un centro de control procesal, mostrando únicamente información viva y accionable en lugar de simples métricas estáticas.

## User Review Required

> [!IMPORTANT]
> **Enfoque de Alertas Prioritarias**
> La bandeja del día traerá información de varias fuentes. Para evitar saturación visual, el plan propone enfocarse 100% en alertas de **riesgo inminente** (Vencidos, Vencen Hoy, Vencen Mañana). ¿Estás de acuerdo con este enfoque minimalista para priorizar la urgencia?

## Open Questions

> [!TIP]
> **Pregunta 1: Actuaciones Recientes vs Tareas**
> Además de los vencimientos, ¿qué otra sección te gustaría ver en la página de inicio?
> * **Opción A:** "Últimas Actuaciones Registradas" (para ver un feed de lo que ha pasado en la firma últimamente).
> * **Opción B:** "Expedientes de Alto Riesgo" (un top de casos marcados como prioritarios).

## Proposed Changes

### Backend y Base de Datos (Next.js)

No necesitamos crear nuevas tablas en Supabase, ya tenemos todo lo necesario (`expedientes`, `actuaciones`, `eventos_agenda`).
Crearemos lógicas de obtención de datos (Server Components) en la página principal para calcular las métricas:
1.  **Vencimientos Críticos:** Consulta a `eventos_agenda` donde el estado sea diferente a `realizada` y la fecha sea `<= hoy + 3 días`.
2.  **Métricas Rápidas (KPIs):** Conteo de expedientes activos totales y sumatorias de términos urgentes.

### Frontend (Next.js App Router)

#### [MODIFY] `app/dashboard/page.tsx`
*   Reemplazaremos el contenido temporal por el verdadero Dashboard.
*   **Bloque Superior (Métricas):** Tarjetas de colores indicando el total de casos, términos vencidos y términos urgentes.
*   **Columna Izquierda (Urgencias):** Una lista muy estilizada mostrando las alertas de la Agenda (lo que vence hoy y mañana). Cada ítem tendrá un botón para ir al expediente asociado.
*   **Columna Derecha (Dinámica):** Dependiendo de la respuesta a la *Pregunta 1*, mostraremos actividad reciente o expedientes prioritarios.

## Verification Plan

### Manual Verification
1. Ingresar al `/dashboard` (página de inicio al loguearse).
2. Crear eventos en la Agenda con fecha de ayer y fecha de hoy.
3. Volver al inicio y comprobar que los eventos aparecen de inmediato resaltados en rojo y naranja.
4. Validar que las métricas (conteos numéricos) cuadren perfectamente con la realidad de la base de datos de esa firma.
