# Módulo de Actuaciones - Plan de Implementación

Las actuaciones conforman la bitácora legal o historial de cada caso. Cada vez que haya un memorial, auto, notificación o cualquier movimiento, se registrará aquí.

## User Review Required

> [!IMPORTANT]
> El esquema de la base de datos permite adjuntar un documento (PDF, imagen, etc.) a cada actuación, el cual se guarda en un "Bucket" de almacenamiento.
> 
> ¿Quieres que incluyamos de una vez el botón de **"Subir Documento"** en el formulario de creación de la actuación, para que puedas adjuntar el PDF del auto o memorial de inmediato?

## Open Questions

> [!NOTE]
> 1. Para la vista dentro del expediente, ¿te gustaría que las actuaciones se muestren como una **Línea de Tiempo (Timeline)** vertical (muy visual para ver la historia cronológica) o como una **Tabla** tradicional?
> 2. Los tipos de actuaciones configurados son bastantes (demanda, admision, auto, sentencia, etc.). ¿Te parece bien usar un menú desplegable estándar o prefieres autocompletado? (Recomiendo menú desplegable estándar por simplicidad).

## Proposed Changes

### [MODIFY] [app/dashboard/expedientes/[id]/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/[id]/page.tsx)
- Añadir la sección de "Historial de Actuaciones" debajo del resumen del expediente.
- Mostrar la lista de actuaciones consultando la tabla `actuaciones` ordenada por `fecha_juridica` de manera descendente.
- Añadir un botón "Registrar Actuación" que lleve al formulario de creación.

### [NEW] [app/dashboard/expedientes/[id]/actuaciones/nuevo/page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/[id]/actuaciones/nuevo/page.tsx)
- Crear el formulario para añadir un nuevo movimiento al caso.
- Campos: Tipo de actuación, Título, Fecha de la actuación, Descripción, Archivo adjunto (opcional).

### [NEW] [app/dashboard/expedientes/acciones.ts](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/expedientes/acciones.ts)
- Implementar la función `guardarActuacion(formData)` que:
  1. Suba el archivo (si existe) al bucket `documentos_actuaciones` en Supabase Storage.
  2. Inserte el registro en la tabla `actuaciones`.
  3. Revalide el caché para que el historial se actualice instantáneamente.

## Verification Plan
1. Entrar a un Expediente existente.
2. Hacer clic en "Registrar Actuación".
3. Llenar el formulario con un título, fecha y opcionalmente subir un archivo de prueba.
4. Guardar y verificar que aparece en el historial del expediente con un link para descargar el archivo.
