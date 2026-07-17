# Módulo de Agenda - Plan de Implementación

Este plan tiene como objetivo construir el módulo de **Agenda**, donde se registrarán todos los vencimientos, audiencias, reuniones y términos procesales de la firma. Estos eventos alimentan directamente la sección de "Alertas" de tu Bandeja del Día.

## User Review Required

> [!IMPORTANT]
> El sistema permite relacionar un evento con un **Expediente** específico. ¿Deseas que este campo sea *obligatorio* (es decir, todo evento debe pertenecer a un caso) o *opcional* (para poder agendar reuniones generales de la firma que no están atadas a un caso)?

## Open Questions

> [!NOTE]
> 1. Para la vista principal de la Agenda, ¿prefieres un formato de **Lista agrupada por fechas** (Ej. "Hoy", "Esta Semana", "Próximo Mes") que es muy eficiente para ver vencimientos, o prefieres que construyamos una **Cuadrícula de Calendario Mensual** clásica?
> 2. El sistema maneja 5 tipos de eventos: Término Procesal, Audiencia, Reunión, Vencimiento Interno y Otro. ¿Te parecen bien estos tipos o quieres agregar/quitar alguno?

## Proposed Changes

### Componente de Agenda (Frontend y Backend)

#### [NEW] [page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/agenda/page.tsx)
- Crear la página principal de la Agenda.
- Incluir un botón de "Nuevo Evento".
- Mostrar los eventos consultando la tabla `eventos_agenda`, ordenados cronológicamente por `fecha_inicio`.
- Incluir diseño visual para destacar eventos urgentes o vencidos (ej. en color rojo).

#### [NEW] [nuevo/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/agenda/nuevo/page.tsx)
- Crear el formulario para añadir un evento.
- Campos: Título, Descripción, Tipo de Evento, Fecha y Hora de Inicio, Fecha y Hora de Fin (opcional), Expediente Asociado (con un menú desplegable de los expedientes activos) y Abogado Responsable.

#### [NEW] [acciones.ts](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/agenda/acciones.ts)
- Implementar la Server Action `guardarEvento` para procesar el formulario e insertarlo en la base de datos de Supabase.

## Verification Plan

### Manual Verification
1. Entrar al módulo de Agenda desde el menú de navegación.
2. Hacer clic en "Nuevo Evento" y crear una "Audiencia" vinculada a uno de los expedientes existentes, fijando la fecha para mañana.
3. Verificar que aparece listada en la página principal de la Agenda.
4. Ir al Dashboard (Bandeja del Día) y verificar que esta nueva audiencia aparece automáticamente en el panel de "Alertas Tempranas".
