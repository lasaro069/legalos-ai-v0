# Bandeja del Día (Dashboard) - Plan de Implementación

Este plan tiene como objetivo revitalizar la "Bandeja del Día" (Dashboard) para que deje de ser un resumen estático y se convierta en el centro de mando real de la firma, incorporando indicadores financieros y de riesgo.

## User Review Required

> [!IMPORTANT]
> Revisa los nuevos indicadores (KPIs) propuestos. ¿Te parece bien que "Cuantía en Riesgo" sume el valor de los expedientes que tienen riesgo "Alto" o "Crítico"? ¿O prefieres que sume la cuantía de *todos* los expedientes activos?

## Open Questions

> [!NOTE]
> 1. Actualmente, en la base de datos, la **Cuantía** es un campo numérico. ¿En qué moneda deberíamos formatear este valor en el Dashboard? (Ej. Pesos Colombianos `COP`, Dólares `USD`).
> 2. Para los eventos de la agenda (Alertas Urgentes), ¿qué horizonte de tiempo consideramos "Próximo"? (Actualmente son 3 días, ¿lo dejamos así o lo ampliamos a 7 días?).

## Proposed Changes

### Componente de Dashboard (Frontend y Backend)

#### [MODIFY] [page.tsx](file:///d:/PROYECTOS/PROYECTO_DUVAN/legalos-ai-v0/app/dashboard/page.tsx)
- **Consultas a Base de Datos (Supabase):**
  - Añadir consulta para contar expedientes con `riesgo = 'alto'` o `riesgo = 'critico'`.
  - Añadir consulta para sumar la `cuantia` de dichos expedientes en riesgo (Honorarios/Cuantía en riesgo).
- **Rediseño de KPIs (Tarjetas Superiores):**
  - Cambiar el layout de 3 columnas a 4 columnas (o 2 filas) para acomodar los nuevos indicadores.
  - KPI 1: **Expedientes Activos** (Azul).
  - KPI 2: **Casos en Riesgo Crítico/Alto** (Rojo oscuro).
  - KPI 3: **Cuantía en Riesgo** (Verde/Dorado para dinero).
  - KPI 4: **Vencimientos Urgentes** (Naranja/Rojo).
- **Rediseño de Alertas Tempranas (Eventos):**
  - Mejorar visualmente la lista de eventos con micro-interacciones (efectos *hover*).
  - Colorear claramente la urgencia (Vencido = Rojo, Vence hoy = Naranja intenso, Próximamente = Amarillo).
- **Rediseño de Últimas Actuaciones:**
  - Mejorar la línea de tiempo vertical para que luzca mucho más moderna y limpia.

## Verification Plan

### Manual Verification
1. Ingresar al sistema con una cuenta válida.
2. Observar la Bandeja del Día para asegurar que las tarjetas de KPIs cargan sin errores y con un diseño estético de alta calidad.
3. Insertar datos de prueba en `expedientes` con cuantías y niveles de riesgo variados para verificar que los cálculos sumen correctamente.
4. Insertar datos de prueba en `eventos_agenda` para validar la clasificación de vencimientos (Vencido, Hoy, Próximo).
