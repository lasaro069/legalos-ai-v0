# Listas Desplegables de Ubicación

Este plan detalla los pasos para reorganizar y transformar los campos de ubicación (País, Departamento, Ciudad) en selectores dependientes dentro del formulario de registro.

## Proposed Changes

### 1. Fuente de Datos (Dataset)
#### [NEW] `lib/colombia-data.ts`
Crearemos un archivo con la estructura de datos que relacione los departamentos de Colombia con sus respectivas ciudades/municipios. 
Para mantener la aplicación rápida y sin depender de APIs externas (que pueden fallar o requerir pago), utilizaremos una lista estática en código.

### 2. Formulario de Onboarding
#### [MODIFY] `app/(auth)/onboarding/page.tsx`
- **Reorganización:** Moveremos los campos para que sigan el orden lógico: País -> Departamento -> Ciudad. Esto aplicará tanto para la sección del "Propietario" como para la de la "Firma".
- **País:** Seguirá siendo un campo de texto (con "Colombia" por defecto) o un `<select>`. Si el país es "Colombia", se activan las listas. Si el usuario escribe otro país, los campos de departamento y ciudad se pueden comportar como texto libre (para no limitar usuarios internacionales).
- **Departamento:** Se transformará en un `<select>` que cargará las opciones desde nuestro archivo de datos.
- **Ciudad:** Se transformará en un `<select>` cuyas opciones se filtrarán y actualizarán dinámicamente basándose en el departamento que el usuario haya seleccionado en el paso anterior. Si el usuario cambia el departamento, la ciudad seleccionada se limpiará automáticamente.

## Open Questions

> [!IMPORTANT]
> **Sobre los Municipios de Colombia:**
> Colombia tiene más de 1,100 municipios. Para este desarrollo inicial (MVP), ¿te parece bien si incluyo una lista con los departamentos completos pero solo con sus ciudades/municipios principales, o prefieres que inserte la lista absoluta de todos los 1,100 municipios del país?

> [!NOTE]
> **Soporte Internacional:**
> ¿Deseas que los campos de Departamento y Ciudad se conviertan de vuelta en campos de texto (input normal) si el usuario decide borrar "Colombia" y escribir otro país en el campo "País"? Esto garantiza que usuarios de otros países no se queden atascados sin poder llenar su ubicación.
