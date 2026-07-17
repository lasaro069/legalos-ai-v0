# Plan de Implementación: Edición de Expedientes y Actuaciones

Este plan habilitará la capacidad de actualizar y corregir la información tanto de los detalles principales de un caso (Expediente) como de los registros en su bitácora (Actuaciones).

## User Review Required

> [!NOTE]
> Todo parece claro para proceder. Solo una validación: ¿Deseas que al editar una **Actuación**, también se permita reemplazar el documento adjunto (PDF) por uno nuevo, o solo editar el texto (título, descripción, fecha)? Por defecto habilitaré la opción para reemplazar el documento si se sube uno nuevo.

## Proposed Changes

### Edición de Expediente

#### [NEW] [app/dashboard/expedientes/[id]/editar/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/[id]/editar/page.tsx)
- Crear el formulario de edición pre-llenado con los datos actuales del expediente (incluyendo cuantía, áreas, cliente, etc.).
- Compartirá la misma estructura visual que el formulario de creación.

#### [MODIFY] [app/dashboard/expedientes/[id]/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/[id]/page.tsx)
- Cambiar el texto "Editar detalles (Próximamente)" a un botón real que redirija a `/dashboard/expedientes/[id]/editar`.

#### [MODIFY] [app/dashboard/expedientes/acciones.ts](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/acciones.ts)
- Añadir la función `actualizarExpediente(formData)` que ejecute un `UPDATE` en la tabla `expedientes`.

### Edición de Actuaciones

#### [NEW] [app/dashboard/expedientes/[id]/actuaciones/[actuacionId]/editar/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/[id]/actuaciones/[actuacionId]/editar/page.tsx)
- Crear el formulario de edición pre-llenado con los datos de la actuación.
- Permitir subir un nuevo archivo (que reemplazará la URL del anterior si se proporciona uno).

#### [MODIFY] [components/actuaciones/ActuacionesTable.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/components/actuaciones/ActuacionesTable.tsx)
- Añadir un pequeño botón/ícono de "Lápiz" (Editar) en la cabecera de cada tarjeta de actuación dentro de la Línea de Tiempo.

#### [MODIFY] [app/dashboard/expedientes/acciones.ts](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/acciones.ts)
- Añadir la función `actualizarActuacion(formData)` que procese los cambios y la subida de un nuevo documento si aplica.

## Verification Plan
1. Entrar a un expediente, hacer clic en "Editar detalles", cambiar la cuantía o el riesgo, y guardar.
2. Hacer clic en el ícono de editar de una actuación en la línea de tiempo, cambiar la fecha o título, y guardar.
3. Verificar que los cambios se reflejan inmediatamente en la vista.
