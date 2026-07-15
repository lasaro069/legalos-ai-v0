# Plan de Implementación: Fundación Multi-tenant y Seguridad (LegalOS)

Este plan detalla los pasos técnicos para construir el Nivel 1 del MVP (Fundación Multi-tenant) de acuerdo a lo definido en el `roadmap_proyecto.md`. Nos enfocaremos en establecer una base sólida y segura sobre Supabase, que garantice que cada firma tenga sus datos aislados mediante Row Level Security (RLS).

> [!IMPORTANT]
> ## User Review Required
> Por favor revisa este plan. Para poder ejecutarlo correctamente, necesitarás crear un proyecto en [Supabase](https://supabase.com/) y proporcionar las credenciales (URL y API Key anon) para conectarlo al proyecto Next.js. ¿Estás de acuerdo con el esquema de base de datos propuesto abajo?

## Open Questions

> [!WARNING]
> 1. **Proyecto Supabase:** ¿Ya tienes un proyecto de Supabase creado para este desarrollo, o prefieres que documente los comandos de Supabase CLI para levantarlo localmente en tu máquina usando Docker? (Normalmente es más rápido usar la nube gratuita de Supabase para empezar).
> 2. **Diseño UI:** ¿Tienes algún diseño específico para las pantallas de Login/Registro, o quieres que construya una interfaz moderna, profesional y alineada con un software jurídico premium utilizando TailwindCSS?

## Proposed Changes

La implementación se dividirá en tres grandes bloques: Base de Datos, Conexión Backend/Frontend, y Vistas de Usuario.

### Base de Datos (Supabase PostgreSQL)
Definiremos el esquema inicial mediante SQL, estableciendo las tablas core y sus políticas de seguridad (RLS).

#### [NEW] Scripts SQL para Supabase (Migración Inicial)
*   **Tabla `firmas`**: `id` (UUID), `nombre` (Texto), `created_at` (Timestamp).
*   **Tabla `usuarios`**: `id` (UUID referenciando a `auth.users`), `email`, `nombre_completo`, `created_at`.
*   **Tabla `miembros_firma`**: `id`, `firma_id`, `usuario_id`, `rol` (propietario, abogado, auxiliar), `estado` (activo, invitado, inactivo).
*   **Triggers (Disparadores)**: Para insertar un registro automáticamente en `usuarios` cuando alguien se registre en `auth.users`.
*   **Políticas RLS (Row Level Security)**: 
    *   Los usuarios solo pueden ver las `firmas` a las que pertenecen según `miembros_firma`.
    *   Los usuarios solo pueden ver a otros `usuarios` que compartan la misma firma.

---

### Integración Next.js y Supabase
Instalaremos las dependencias necesarias y configuraremos el cliente SSR para App Router.

#### [MODIFY] package.json
*   Instalar `@supabase/supabase-js` y `@supabase/ssr`.

#### [NEW] .env.local
*   Configurar variables de entorno (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

#### [NEW] utils/supabase/client.ts
*   Cliente Supabase para componentes del lado del cliente (Navegador).

#### [NEW] utils/supabase/server.ts
*   Cliente Supabase para Server Components y Server Actions.

#### [NEW] middleware.ts
*   Middleware de Next.js para refrescar la sesión automáticamente y proteger rutas privadas (ej. redirigir a `/login` si no está autenticado, e impedir entrar a `/login` si ya está dentro).

---

### Pantallas de Autenticación (UI)
Crearemos los componentes y páginas funcionales.

#### [NEW] app/(auth)/login/page.tsx
*   Pantalla de inicio de sesión con email y contraseña.

#### [NEW] app/(auth)/register/page.tsx
*   Pantalla de registro. Al registrarse, el sistema deberá crear automáticamente una `Firma` por defecto asignando al usuario como "propietario".

#### [NEW] app/auth/callback/route.ts
*   Route Handler para intercambiar el código seguro por una sesión cuando se utiliza confirmación por correo electrónico o reseteo de contraseña.

#### [NEW] app/dashboard/page.tsx
*   Pantalla principal protegida (Bandeja del Día o Vista de Firma) que solo será accesible si hay una sesión activa, verificando que el usuario cargue exitosamente el contexto de su "Firma".

## Verification Plan

### Manual Verification
1. Ejecutar la aplicación e intentar acceder a `/dashboard`. El sistema debe redirigir a `/login`.
2. Registrar un nuevo usuario en `/register`. Validar en Supabase que:
   - Se crea en `auth.users`.
   - El trigger lo inserta en `public.usuarios`.
   - Se crea una `firma` para él.
   - Se crea un registro en `miembros_firma` vinculando al usuario como propietario de la nueva firma.
3. Iniciar sesión con el usuario y acceder a `/dashboard`. Debería mostrar la interfaz protegida.
4. (Opcional) Probar crear un segundo usuario, y validar a nivel base de datos que debido al RLS, el usuario 1 no puede ver la firma ni los datos del usuario 2.
