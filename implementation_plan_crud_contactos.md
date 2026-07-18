# Finalizar Módulo de Contactos

El objetivo de este plan es completar las funcionalidades fundamentales del directorio de Contactos para que sea 100% operativo en producción.

## Proposed Changes

### 1. Búsqueda y Filtrado
Añadiremos una barra de búsqueda para encontrar clientes rápidamente por nombre o número de identificación.

#### [MODIFY] `app/dashboard/contactos/page.tsx`
- Convertir o crear un componente cliente interno para manejar el estado de búsqueda (`searchTerm`).
- Filtrar la lista de contactos en tiempo real basándose en el texto ingresado.

### 2. Edición de Contactos
Permitiremos actualizar la información de un cliente (ej. cambio de teléfono o dirección).

#### [MODIFY] `app/dashboard/contactos/nuevo/ContactoForm.tsx`
- Refactorizar el formulario para que acepte un objeto `initialData` opcional.
- Si existe `initialData`, el formulario servirá para actualizar; de lo contrario, para crear.
- *Opcional:* Renombrar el archivo a `components/ContactoForm.tsx` para que sea más genérico, o dejarlo en su ruta actual.

#### [NEW] `app/dashboard/contactos/[id]/editar/page.tsx`
- Crear la página de edición que cargue los datos actuales del contacto de la base de datos y renderice el `ContactoForm` prellenado.

#### [MODIFY] `app/dashboard/contactos/acciones.ts`
- Agregar la función (Server Action) `actualizarContacto(id, formData)`.

### 3. Eliminación de Contactos
Capacidad de borrar un contacto del directorio.

#### [MODIFY] `app/dashboard/contactos/[id]/page.tsx`
- Cambiar el texto estático de "Editar contacto (Próximamente)" por un botón real hacia la ruta de edición.
- Agregar un botón rojo de "Eliminar Contacto".

#### [MODIFY] `app/dashboard/contactos/acciones.ts`
- Agregar la función `eliminarContacto(id)`.

> [!WARNING]
> **Eliminación y Expedientes:** La base de datos tiene una regla `on delete set null` para el campo `cliente_id` en la tabla `expedientes`. Esto significa que si eliminamos un contacto que tiene expedientes, esos expedientes **no se borrarán**, pero quedarán "sin cliente asignado".

## User Review Required

¿Estás de acuerdo con el comportamiento de eliminación (que los expedientes queden huérfanos si borras al cliente), o prefieres que el sistema **bloquee** la eliminación si el contacto tiene expedientes activos y pida primero reasignarlos?
