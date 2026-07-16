# Ampliación del Formulario de Registro (Onboarding)

Este plan detalla los pasos necesarios para añadir los nuevos campos solicitados tanto para la información del propietario como de la firma en el proceso de registro inicial.

## Proposed Changes

### 1. Base de Datos (Supabase)
#### [NEW] Nueva Migración SQL
Se creará una nueva migración para añadir las columnas faltantes:
- **Tabla `usuarios` (Propietario):** Añadir `celular`, `telefono_fijo`, `direccion`, `ciudad`, `departamento`, `pais`.
- **Tabla `firmas`:** Añadir `departamento`, `direccion`, `telefono`, `celular`, `email`. (La columna `logo_url`, `ciudad`, `pais` y `zona_horaria` ya existen).
- **Storage:** Crear un nuevo *bucket* público llamado `logos_firmas` para almacenar las imágenes de los logos, junto con sus respectivas políticas de seguridad (RLS) para permitir subida y lectura pública.

### 2. Acciones del Servidor
#### [MODIFY] `app/(auth)/actions.ts`
- Actualizar `completeOnboardingAction` para recibir el nuevo payload ampliado.
- Guardar la información del propietario en la tabla `usuarios`.
- Guardar la información de la firma en la tabla `firmas`.

### 3. Interfaz de Usuario
#### [MODIFY] `app/(auth)/onboarding/page.tsx`
- Expandir el formulario actual dividiéndolo claramente en dos secciones visuales:
  1. **Información del propietario:** Nombre, Celular, Teléfono Fijo, Email (Solo lectura, toma el del registro), Dirección, Ciudad, Departamento, País.
  2. **Datos de la firma:** Nombre de la firma, Logo (Componente de carga de imagen local hacia el Storage de Supabase), Ciudad, Departamento, País, Zona Horaria, Dirección, Teléfono, Celular, Email de la firma.

## Open Questions

> [!IMPORTANT]
> **Sobre el Logo de la Empresa:** 
> Tengo planeado implementar un botón para subir un archivo de imagen (PNG/JPG) desde la computadora, el cual se guardará en un servidor de archivos de Supabase (Storage). ¿Estás de acuerdo con este enfoque o prefieres dejar el logo solo como un campo de texto temporal por ahora?

> [!NOTE]
> **Sobre el Email del Propietario:** 
> Ya que el usuario inició sesión con un correo, mostraré ese mismo correo en la sección del propietario como "solo lectura" (no editable en este punto, ya que está atado a su cuenta de acceso). ¿Te parece bien, o prefieres que pueda escribir un correo de contacto alternativo en su perfil?
