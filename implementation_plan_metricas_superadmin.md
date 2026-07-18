# Métricas Globales para Superadministrador

Este plan detalla cómo construiremos el nuevo panel de métricas avanzadas para el Superadministrador, permitiendo monitorear la actividad de todas las firmas sin acceder a su información confidencial.

## Proposed Changes

### Base de Datos

Para que el panel sea rápido y eficiente, en lugar de hacer cientos de consultas desde el servidor, crearemos una **Vista de Base de Datos (View)** o una función RPC en PostgreSQL que calcule las métricas agregadas.

#### [NEW] `supabase/migrations/[timestamp]_crear_vista_metricas.sql`
Crear una migración que defina una vista o función (ej. `get_firmas_metrics()`) que agrupe y cuente la siguiente información por cada `firma`:
- Cantidad de usuarios (desde `miembros_firma`).
- Cantidad de clientes (desde `contactos`).
- Cantidad de casos/expedientes (desde `expedientes`).
- Cantidad total de documentos subidos (desde `actuaciones` donde `documento_url` no es nulo).
- *Cálculo interno del promedio de documentos por caso.*

### Interfaz de Usuario (Frontend)

Modificaremos la página actual del superadmin para incluir estas nuevas estadísticas en un formato de tabla analítica moderna o tarjetas resumen.

#### [MODIFY] `app/superadmin/page.tsx`
- Reemplazar la tabla básica actual por un **Dashboard de Métricas**.
- Consumir la nueva vista o RPC `get_firmas_metrics`.
- Columnas a agregar en la tabla principal:
  - Nombre de la Firma
  - Usuarios
  - Clientes
  - Casos
  - Documentos (Total y Promedio por caso)
  - Consumo de IA (Se mostrará como "0" o "Próximamente" ya que aún no se implementa el motor de IA).

> [!TIP]
> **Privacidad Asegurada:** Como Superadmin, esta vista agregada solo extrae números (COUNT), sin exponer nombres de clientes, títulos de expedientes ni contenido de documentos.

## User Review Required

¿Deseas que mantengamos el formulario de **"Crear Nueva Firma"** en esta misma pantalla de métricas (quizás moviéndolo arriba o a un botón que abra un modal), o prefieres que la pantalla principal sea 100% dedicada a las métricas y el formulario pase a una sub-pestaña?
