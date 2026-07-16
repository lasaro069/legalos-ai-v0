# Configuración y Ajustes de la Firma

Este plan detalla los pasos para transformar la vista actual de Ajustes (`/settings`), que utiliza datos simulados (mock), en un módulo completamente funcional conectado a la base de datos de Supabase.

## Proposed Changes

### 1. Refactorización a Server Components y Data Fetching
#### [MODIFY] `app/settings/page.tsx`
- Convertiremos la página principal en un **Server Component** (`async function SettingsPage`).
- Obtendremos el usuario autenticado.
- Consultaremos la tabla `usuarios` para obtener su perfil.
- Consultaremos `miembros_firma` y `firmas` para obtener los datos de la firma a la que pertenece.
- Consultaremos el resto de los miembros del equipo (`miembros_firma` + `usuarios`) para la "Vista de equipo".
- Pasaremos esta información real a componentes cliente (Client Components) que manejarán los formularios de edición.

### 2. Formularios de Edición
#### [NEW] `app/settings/components/ProfileForm.tsx`
- Formulario interactivo para editar los datos personales del abogado (nombre, correo alterno, celular, ubicación).
#### [NEW] `app/settings/components/FirmForm.tsx`
- Formulario para que el Propietario o Administrador edite los detalles de la firma (nombre, eslogan, logo, dirección, etc.). Aquí reutilizaremos el componente `LocationSelector` que creamos para el onboarding.

### 3. Server Actions para Guardar Cambios
#### [NEW] `app/settings/actions.ts`
- `updateProfile`: Acción para actualizar la fila del usuario en `usuarios`.
- `updateFirm`: Acción para actualizar la fila de la firma en `firmas` (validando que quien ejecuta la acción tiene permisos de Propietario en esa firma).

## Open Questions

> [!IMPORTANT]
> **Preferencias Operativas:**
> Actualmente hay una sección de "Preferencias Operativas" con checks (ej. alertas de términos, modo IA, etc.). ¿Deseas que dejemos esta sección temporalmente con datos de prueba (mock) o quieres que creemos una tabla `preferencias` en la base de datos para que también sean guardadas en el servidor desde ahora?

> [!NOTE]
> **Edición de la Vista de Equipo:**
> Para esta primera fase, ¿la "Vista de Equipo" será solo de **lectura** (para ver quién está en la firma) o te gustaría que agreguemos de una vez la funcionalidad para que el Propietario pueda **invitar o eliminar** a otros miembros?
