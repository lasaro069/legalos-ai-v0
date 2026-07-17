# Módulo de Directorio (Contactos) - Plan de Implementación

Este plan tiene como objetivo construir el módulo de **Directorio**, donde se gestionará la base de datos de clientes, contrapartes y contactos en general de la firma. Estos contactos son los que luego se asocian a los expedientes.

## User Review Required

> [!IMPORTANT]
> El sistema guarda los contactos con una tipología: Persona **Natural** o Persona **Jurídica**. ¿Deseas que al seleccionar "Jurídica" el campo de Tipo de Identificación cambie automáticamente a "NIT", o prefieres dejarlo manual?

## Open Questions

> [!NOTE]
> 1. Para la vista principal del Directorio (donde se listan todos), ¿prefieres una **Tabla tradicional** (filas y columnas) o un diseño en **Tarjetas** (estilo libreta de direcciones)?
> 2. Además del nombre, teléfono y correo, ¿hay algún otro dato que te gustaría ver a simple vista en el listado principal sin tener que entrar al detalle del contacto?

## Proposed Changes

### Componente de Directorio (Frontend y Backend)

#### [NEW] [page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/contactos/page.tsx)
- Crear la página principal del directorio.
- Incluir un botón de "Nuevo Contacto".
- Mostrar la lista de contactos consultando la tabla `contactos` de Supabase.

#### [NEW] [nuevo/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/contactos/nuevo/page.tsx)
- Crear el formulario para añadir un contacto.
- Campos: Tipo de Persona, Nombre/Razón Social, Tipo de Identificación, Número de Identificación, Correo, Teléfono, Dirección, Ciudad y Observaciones.

#### [NEW] [acciones.ts](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/contactos/acciones.ts)
- Implementar la Server Action `guardarContacto` para procesar el formulario e insertar los datos asegurando el enlace con la firma del usuario (`firma_id`).

#### [NEW] [[id]/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/contactos/[id]/page.tsx)
- Crear una vista de detalle del perfil del contacto.
- *Bonus*: Mostrar en este perfil una lista de los **Expedientes** asociados a este cliente.

## Verification Plan

### Manual Verification
1. Entrar al módulo de Directorio desde el menú de navegación.
2. Hacer clic en "Nuevo Contacto" y llenar el formulario probando diferentes tipos de persona (Natural/Jurídica).
3. Guardar y verificar que el contacto aparece en la lista.
4. Ir a "Nuevo Expediente" y verificar que el contacto recién creado aparece en la lista desplegable de clientes.
