# Plan de Implementación: Gestión Directa de Equipo (Admin)

Habilitaremos una sección para que los administradores y propietarios de la firma puedan gestionar su equipo y añadir miembros directamente (sin esperar a que acepten una invitación).

## User Review Required

> [!NOTE]
> Para lograr esto, crearemos una nueva pestaña en el menú principal llamada **"Equipo"** (sugerido) o la ubicaremos en los **Ajustes ⚙️**. ¿Prefieres que "Equipo" tenga su propia pestaña en la barra superior junto a "Directorio", o que solo se acceda desde el ícono de Ajustes (⚙️)? 
> *Por defecto: la ubicaré en la barra superior para mayor accesibilidad.*

## Proposed Changes

### [NEW] [app/dashboard/equipo/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/equipo/page.tsx)
- Crear la vista principal del equipo, mostrando todos los miembros actuales de la firma y sus roles (Propietario, Admin, Abogado, etc.).
- Si el usuario es propietario/admin, mostrar un botón destacado "Añadir Miembro".

### [NEW] [app/dashboard/equipo/nuevo/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/equipo/nuevo/page.tsx)
- Crear el formulario para registrar un nuevo miembro directamente.
- Campos: Nombre completo, Correo electrónico, Contraseña asignada, Rol.

### [NEW] [app/dashboard/equipo/acciones.ts](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/equipo/acciones.ts)
- Implementar la Server Action `agregarMiembroDirecto(formData)`.
- Utilizará el `SUPABASE_SERVICE_ROLE_KEY` (privilegios de administrador del sistema) para:
  1. Crear la cuenta de usuario en la autenticación con la contraseña asignada, marcándolo como "invitado directo" para evitar que se le cree una firma por defecto.
  2. Insertar al usuario en la tabla `miembros_firma` con el rol seleccionado y asociarlo a la firma del administrador actual.

### [MODIFY] [components/layout/Navbar.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/components/layout/Navbar.tsx)
- Añadir el enlace "Equipo" al menú de navegación.

## Verification Plan
1. Entrar con la cuenta de administrador.
2. Navegar a "Equipo" y ver la lista actual.
3. Hacer clic en "Añadir Miembro".
4. Llenar el formulario (ej. "abogado@gomezasociados.com", asignar clave "legalos123").
5. Verificar que el usuario aparece en la lista de la firma y puede iniciar sesión inmediatamente con esas credenciales.
