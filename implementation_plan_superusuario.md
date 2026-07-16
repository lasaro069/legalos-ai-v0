# Implementación de Superadmin y Flujo de Registro de Firmas

Este plan aborda la creación de un usuario superadmin, la restricción de creación de firmas exclusivamente a este rol, y el flujo de bienvenida (onboarding) para los nuevos administradores de firmas (cambio de contraseña obligatoria y llenado del formulario completo de registro).

## User Review Required

> [!WARNING]
> **Cambio radical en el registro de usuarios:**
> Actualmente, cualquier persona puede ir a `/register` y crear una firma. Según este nuevo requerimiento, el registro público desaparecerá o cambiará de propósito. Únicamente el Superadmin podrá crear firmas e invitar al Administrador de la Firma (Propietario). ¿Estás de acuerdo con deshabilitar el registro público de firmas?

## Open Questions

> [!IMPORTANT]
> 1. **Datos iniciales del Superadmin:** Por defecto, crearé el superadmin con el correo `superadmin@legalos.ai` y una contraseña temporal como `Admin123!`. ¿Deseas usar un correo o contraseña específicos?
> 2. **Formulario completo de registro:** ¿Qué campos debe contener este formulario para el administrador de la firma? (ej. Nombre de la firma, teléfono, dirección, logo, etc.)

## Proposed Changes

### Base de Datos y Permisos (Supabase)

#### [MODIFY] supabase/migrations/20260715145619_init_multi_tenant.sql (o crear nueva migración)
- Agregar una columna `es_superadmin BOOLEAN DEFAULT false` a la tabla `usuarios`.
- Agregar una columna `requiere_cambio_password BOOLEAN DEFAULT false` a la tabla `usuarios`.
- Modificar el trigger `handle_new_user` para que **no** cree automáticamente una firma. Ahora solo creará el perfil en `usuarios`.
- Insertar el usuario superadmin inicial.

### Backend y Acciones (Server Actions)

#### [NEW] app/acciones/superadmin.ts (o similar)
- Crear una acción `crearFirmaYAdmin(email, passwordTemporal, ...)` que utilice `@supabase/supabase-js` con el `SERVICE_ROLE_KEY` (para bypass de seguridad) para crear el usuario en Auth, crear la fila en la tabla `firmas`, y vincular al usuario como `propietario` en `miembros_firma`.
- Marcar a ese nuevo usuario con `requiere_cambio_password = true`.

#### [MODIFY] middleware.ts
- Interceptar las peticiones de usuarios autenticados.
- Si el usuario tiene `requiere_cambio_password = true`, redirigirlo forzosamente a `/update-password`.
- Si el usuario ya cambió su contraseña pero no ha completado el formulario de registro (ej. la firma no tiene nombre o falta el nombre del propietario), redirigirlo a `/onboarding`.

### Frontend y Vistas (UI)

#### [NEW] app/(superadmin)/dashboard/page.tsx
- Un panel exclusivo para el superadmin donde vea todas las firmas y tenga un botón/formulario para "Crear nueva firma y administrador".

#### [NEW] app/(auth)/update-password/page.tsx
- Formulario para que el administrador de la firma ingrese su nueva contraseña y reemplace la temporal. Al guardar, se actualiza en Auth y se pone `requiere_cambio_password = false`.

#### [NEW] app/(auth)/onboarding/page.tsx
- Formulario completo de registro para que el administrador de la firma ingrese los detalles restantes (Nombre completo, Nombre de la firma, etc.).

#### [DELETE/MODIFY] app/(auth)/register/page.tsx
- Deshabilitar o redirigir esta página, ya que los usuarios ya no pueden registrarse libremente y crear firmas.

## Verification Plan

### Manual Verification
- Iniciar sesión con las credenciales del Superadmin y verificar el acceso al panel de control.
- Usar el panel de Superadmin para crear una nueva firma con un correo de prueba y contraseña temporal.
- Iniciar sesión en una ventana de incógnito con las credenciales del nuevo administrador de la firma.
- Verificar que el sistema obligue a cambiar la contraseña redirigiendo a `/update-password`.
- Tras cambiar la contraseña, verificar que el sistema redirija a `/onboarding` para completar el registro de la firma.
- Verificar que las políticas RLS permitan al administrador ver y usar su espacio de trabajo solo después de este flujo.
