# Plan de Implementación: Directorio de Clientes y Contactos

Este plan describe la construcción del módulo central de clientes para gestionar de forma estructurada a las personas naturales y jurídicas vinculadas a la firma, conforme a la sección `8.3. CLIENTES Y CONTACTOS` del roadmap.

## User Review Required

> [!IMPORTANT]
> **Relación con Expedientes**
> Actualmente, en el módulo de Expedientes, el "Cliente" es un simple campo de texto que digitamos a mano. Con este nuevo módulo de Clientes, lo ideal es crear un campo en la base de datos para que el expediente se vincule "oficialmente" al cliente del directorio (`cliente_id`). Al hacer esto, si editas el correo o teléfono del cliente en el directorio, se actualizará en todos sus casos. ¿Deseas que agregue este vínculo estricto entre Expedientes y Clientes en la base de datos?

## Open Questions

> [!TIP]
> **Pregunta 1: Partes Procesales**
> El roadmap también menciona una gestión de "Partes Procesales" (demandados, contrapartes, testigos). ¿Deseas que este directorio sea estrictamente para **Tus Clientes**, o lo diseñamos como un directorio general de **Contactos/Personas** donde cada persona tiene un rol (ej. uno es tu cliente, otro es la contraparte)? (Hacer un directorio general de contactos suele ser más flexible a largo plazo).

## Proposed Changes

### Base de Datos y Supabase

#### [NEW] `supabase/migrations/[timestamp]_crear_clientes.sql`
1.  **Tipos Enum:**
    *   `tipo_persona`: 'natural', 'juridica'
    *   `tipo_identificacion`: 'cc', 'nit', 'ce', 'pasaporte', 'otro'
    *   `estado_cliente`: 'activo', 'inactivo'
2.  **Tabla `clientes`:**
    *   `id` (uuid)
    *   `firma_id` (uuid, FK a firmas) - Multi-tenant estricto.
    *   `tipo_persona` (tipo_persona)
    *   `nombre` (text) - Nombre completo o Razón Social.
    *   `identificacion` (text) - Número de NIT o Cédula.
    *   `tipo_identificacion` (tipo_identificacion)
    *   `correo` (text)
    *   `telefono` (text)
    *   `direccion` (text)
    *   `ciudad` (text)
    *   `estado` (estado_cliente)
    *   `observaciones` (text)
    *   `creado_por` (uuid, FK a usuarios)
    *   `created_at`, `updated_at`
3.  **RLS Policies:**
    *   Protección total: los usuarios solo pueden ver/editar clientes de su `firma_id`.

#### [MODIFY] `expedientes` (Opcional, según respuesta)
*   Añadir la columna `cliente_id uuid references public.clientes(id) on delete set null` para vincularlos formalmente.

### Frontend (Next.js App Router)

#### [MODIFY] `app/dashboard/layout.tsx`
*   Agregar el enlace "Clientes" en el menú principal.

#### [NEW] `app/dashboard/clientes/page.tsx`
*   Vista de lista/tabla de clientes, con buscador por nombre o NIT/CC.

#### [NEW] `app/dashboard/clientes/nuevo/page.tsx` (y sus `acciones.ts`)
*   Formulario para registrar un cliente, cambiando dinámicamente si es persona natural o jurídica.

#### [NEW] `app/dashboard/clientes/[id]/page.tsx`
*   Vista de detalle del cliente, mostrando su información de contacto en una tarjeta y una lista de **todos los expedientes asociados** a él.

## Verification Plan

1. Ir a la pestaña "Clientes".
2. Crear un Cliente (Persona Jurídica) con NIT y datos de contacto.
3. Crear un Expediente y asociarlo a ese cliente (si se aprueba el vínculo estricto).
4. Entrar al perfil del cliente y corroborar que su expediente aparezca listado allí.
