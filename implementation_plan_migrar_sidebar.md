# Plan de Implementación: Migración a Sidebar Lateral

Actualmente el sistema utiliza una barra de navegación superior (Navbar). Vamos a cambiar el diseño de toda la aplicación para usar el panel lateral (Sidebar) oscuro y elegante que diseñaste, inyectándole la información real de la base de datos.

## User Review Required

> [!IMPORTANT]
> Este cambio reemplazará por completo la barra superior actual en favor del menú lateral. Los enlaces de navegación (Inicio, Expedientes, Agenda, Directorio, Equipo) se moverán al panel lateral. 

> [!NOTE]
> En la imagen del panel lateral hay enlaces que no hemos construido aún (ej. "Control de Términos", "Audiencias", "Tareas", "Asistente Jurídico"). ¿Deseas que los dejemos visibles (pero inactivos o marcados como "próximamente") o prefieres que solo mostremos en el panel lateral los módulos que ya están 100% funcionales (Bandeja del Día, Expedientes, Agenda, Directorio, Equipo)?
> *Por defecto: Mostraré solo los módulos que ya hemos construido para mantener la interfaz limpia y funcional.*

## Proposed Changes

### [MODIFY] [components/sidebar.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/components/sidebar.tsx)
- Convertir el componente para aceptar `props` con la información real:
  - `firmaNombre` y `firmaSlogan` (o dejar "Sistema operativo jurídico" si no hay eslogan).
  - `usuarioNombre` y `usuarioRol`.
  - `alertasCount` para el widget de "Bandeja del día".
- Actualizar la lista de enlaces (`items`) para que coincidan con los módulos funcionales (`/dashboard`, `/dashboard/expedientes`, `/dashboard/agenda`, `/dashboard/contactos`, `/dashboard/equipo`).
- Añadir el botón de **Cerrar Sesión** en la parte inferior o junto al perfil de usuario.

### [MODIFY] [app/dashboard/layout.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/layout.tsx)
- Eliminar el `<header>` superior actual.
- Mantener las consultas a Supabase para obtener la información del usuario y la firma.
- Adicionalmente, consultar la cantidad de alertas/vencimientos urgentes para pasárselos al sidebar.
- Envolver el contenido `children` utilizando el nuevo `<AppShell>` o el `<Sidebar>` con la información real.
- Ajustar los paddings principales (`<main>`) para que el contenido no se solape con el sidebar en escritorio.

## Verification Plan
1. Iniciar sesión en la plataforma.
2. Verificar que el panel lateral izquierdo aparece correctamente con fondo oscuro.
3. Comprobar que en la parte superior del panel aparece el nombre de la firma real.
4. Comprobar que en la parte inferior aparece el nombre, correo y rol del usuario logueado.
5. Comprobar que la navegación entre secciones funciona correctamente desde el panel lateral.
