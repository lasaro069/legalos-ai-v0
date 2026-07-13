# LegalOS AI - Auditoria CTO definitiva, arquitectura maestra y plan de construccion

Fecha de auditoria: 12 de junio de 2026  
Alcance: congelar vision tecnica, modelo de dominio, arquitectura multi-tenant, IA, escalabilidad y roadmap antes de iniciar backend real.  
Postura: CTO fundador responsable de construir LegalOS durante los proximos 5 anos.

## 1. Resumen ejecutivo

Mi recomendacion CTO es clara: LegalOS debe construirse alrededor de `Expediente` y `Actuacion`.

No alrededor del cliente.  
No alrededor del documento.  
No alrededor de la IA.  
No alrededor de un dashboard.

La arquitectura correcta es:

`Expediente -> Actuaciones -> Documentos / Terminos / Audiencias / Tareas / Notas / IA / Financiero`

La entidad central debe ser `Expediente` porque es el contenedor juridico de verdad. La entidad operativa principal debe ser `Actuacion` porque es el evento juridico que explica que paso, que consecuencias produjo y que trabajo nace de ahi.

Decision brutalmente honesta: el prototipo actual ya va mejor encaminado que un CRM juridico comun, pero todavia tiene tres riesgos fuertes antes del backend:

1. El dominio esta medio congelado, pero no completamente: existen actuaciones, terminos, audiencias y documentos, pero todavia conviven con una logica de `cliente/caso/dashboard/asistente` que puede deformar el producto.
2. El control de terminos se ve importante en UI, pero aun no tiene las garantias duras que requiere un sistema real: calendario juridico, validacion, auditoria irreversible, escalamiento, trazabilidad y proteccion contra errores humanos.
3. La IA esta bien ubicada filosoficamente, pero `Hallazgo IA` todavia no existe como entidad auditable de negocio. Si se inicia backend sin esa entidad, despues habra que rehacer el modulo de documentos/IA.

La arquitectura propuesta con Next.js, Supabase, PostgreSQL, Supabase Auth, R2, OpenAI, Vercel, Sentry y PostHog es correcta para 30, 100, 300 y 1000 abogados si se toman desde el dia 1 estas decisiones:

- Todas las tablas tenant-owned deben tener `firm_id`, incluso tablas hijas y tablas puente.
- RLS debe estar activado desde la primera migracion, no al final.
- Los terminos deben ser una entidad de riesgo, no una tarea con fecha.
- Los documentos deben almacenarse en object storage y solo metadata, texto procesado y relaciones viven en Postgres.
- La IA debe crear propuestas auditables, nunca registros finales automaticos.
- El chat de expediente debe usar solo informacion del expediente actual, con trazabilidad de fuentes.
- Debe existir un sistema de auditoria inmutable desde beta.
- Debe existir una cola/background worker desde el modulo documental/IA/alertas. Vercel API sola no es suficiente para procesos largos ni alertas confiables.

Recomendacion final: no construir mas UI antes de congelar el dominio y levantar backend fundacional. El siguiente paso correcto no es "hacer mas pantallas"; es crear la base multi-tenant, RLS, auditoria, expedientes, partes, actuaciones y terminos con pruebas.

## 2. Que es LegalOS

LegalOS es un sistema operativo del expediente juridico para abogados independientes y firmas pequenas en Colombia.

Su promesa no es "guardar informacion". Su promesa es:

- decir que debe atender el abogado hoy;
- explicar que esta pasando en cada expediente;
- mostrar que actuaciones ocurrieron y que consecuencias generaron;
- evitar perdida de terminos;
- preparar audiencias con contexto;
- usar IA como asistente operativo, no como decisor juridico.

LegalOS debe sentirse como el puesto de mando del expediente. El abogado no entra a "ver datos"; entra a decidir que sigue, que vence, que riesgo existe y que registro juridico explica la situacion.

## 3. Que NO es LegalOS

LegalOS no debe convertirse en:

- CRM juridico.
- Agenda juridica con formularios decorados.
- Gestor documental tradicional.
- Chatbot juridico.
- Dashboard corporativo.
- Sistema contable.
- Herramienta de marketing para abogados.
- Repositorio pasivo de archivos.

El cliente existe, pero no manda la arquitectura. El documento existe, pero no manda el flujo. La IA existe, pero no protagoniza. La agenda existe, pero es consecuencia de audiencias, terminos y tareas, no el centro del producto.

## 4. Filosofia del producto

La filosofia definitiva debe ser:

1. El expediente es el contenedor juridico.
2. La actuacion es el evento juridico.
3. El documento es evidencia, soporte o comunicacion.
4. El termino es riesgo temporal.
5. La audiencia es hito procesal.
6. La tarea es trabajo interno.
7. La nota es memoria operativa.
8. La IA es una capa de asistencia contextual.
9. El financiero acompana el expediente, no dirige el producto.

Regla de oro: todo lo importante debe poder responder "de donde salio".

Un termino sin origen es peligroso.  
Una tarea sin expediente es ruido.  
Un documento sin clasificacion juridica es archivo muerto.  
Una sugerencia IA sin decision humana es riesgo.  
Una audiencia sin resultado posterior rompe la historia del expediente.

## 5. Arquitectura funcional

La arquitectura funcional debe tener tres vistas madre:

### Bandeja del Dia

Pregunta principal: que debo hacer hoy.

Debe priorizar:

- terminos vencidos o proximos;
- audiencias proximas;
- tareas vencidas o criticas;
- expedientes con riesgo alto;
- hallazgos IA pendientes de validar;
- documentos pendientes de revisar;
- cartera critica cuando afecte operacion del expediente.

No debe convertirse en dashboard de vanidad. Debe ser accionable.

### Expediente

Pregunta principal: que esta pasando en este caso.

Debe incluir:

- resumen juridico;
- radicado y autoridad;
- partes procesales;
- actuaciones;
- documentos;
- terminos;
- audiencias;
- tareas;
- notas;
- IA contextual;
- financiero del expediente;
- auditoria y actividad.

La pantalla del expediente es la pantalla madre del producto.

### Actuaciones

Pregunta principal: que ocurrio juridicamente y que consecuencias genero.

Cada actuacion puede generar:

- documento asociado;
- termino;
- audiencia;
- tarea;
- nota;
- riesgo;
- actualizacion de estado;
- actuacion posterior.

Las actuaciones deben ser la linea de vida juridica del expediente.

## 6. Arquitectura tecnica

Stack recomendado:

- Frontend: Next.js, React, TypeScript, Tailwind, shadcn/ui.
- Backend de datos: Supabase sobre PostgreSQL.
- Auth: Supabase Auth.
- Storage: Cloudflare R2 para binarios documentales.
- API: Next.js API/Server Actions como capa de aplicacion.
- IA: OpenAI para extraccion, resumen, redaccion asistida y chat contextual.
- Deploy: Vercel.
- Monitoreo: Sentry para errores y performance; PostHog para analitica de producto.

Veredicto CTO: el stack es correcto para el momento de LegalOS. No hace falta meter microservicios, Kubernetes ni infraestructura enterprise desde el dia 1.

Pero faltan tres componentes de arquitectura:

1. Background jobs: necesario para OCR, analisis IA, reintentos, alertas, digest diario y procesamiento documental. Puede ser Inngest, Trigger.dev, QStash, Supabase Edge Functions programadas o un worker propio. No recomiendo depender solo de requests HTTP de Vercel para esto.
2. Email/notification provider: necesario para alertas de terminos y audiencias. Opciones razonables: Resend, Postmark, SendGrid o proveedor transaccional equivalente.
3. Sistema de auditoria: no es "nice to have". En LegalTech es parte del producto.

Arquitectura por capas:

- Capa UI: Next.js App Router, componentes, formularios, vistas.
- Capa aplicacion: operaciones de negocio, validaciones, permisos de accion, orquestacion IA.
- Capa datos: PostgreSQL, RLS, constraints, indices, vistas/materialized views cuando sea necesario.
- Capa storage: R2, signed URLs, versionado, metadata en Postgres.
- Capa IA: jobs asincronos, prompts versionados, resultados estructurados, hallazgos auditables.
- Capa observabilidad: Sentry, PostHog, logs de aplicacion, audit log de negocio.

## 7. Modelo de dominio

Modelo de dominio recomendado:

### Fundacional

- `firm`: despacho o firma.
- `firm_member`: usuario dentro de una firma.
- `role`: rol operativo.
- `permission`: permiso granular.
- `audit_event`: registro inmutable de acciones relevantes.

### Juridico

- `expediente`: contenedor juridico.
- `radicado`: identificador procesal, actual o historico.
- `party`: persona natural, juridica, autoridad o interviniente.
- `expediente_party`: rol de una parte dentro de un expediente.
- `actuacion`: evento juridico.
- `document`: metadata documental.
- `document_version`: version de archivo.
- `document_relation`: relacion del documento con actuacion, audiencia, termino u otro registro.
- `termino`: plazo/riesgo temporal.
- `audiencia`: hito procesal.
- `hearing_checklist_item`: preparacion de audiencia.
- `task`: trabajo interno.
- `note`: nota interna.

### IA

- `ai_analysis_run`: ejecucion de IA.
- `ai_finding`: hallazgo IA.
- `ai_suggestion`: propuesta estructurada.
- `ai_decision`: aceptacion, edicion o descarte por humano.
- `document_text_chunk`: texto extraido y fragmentado por documento.
- `case_context_snapshot`: snapshot opcional para respuestas reproducibles.

### Financiero

- `fee_agreement`: acuerdo u honorario pactado.
- `invoice` o `account_receivable`: cuenta por cobrar.
- `payment`: pago recibido.
- `expense`: gasto recuperable, solo si el MVP lo exige.

### Integraciones futuras

- `external_case_source`: fuente externa, por ejemplo Rama Judicial.
- `external_case_event`: evento consultado externamente.
- `sync_job`: ejecucion de sincronizacion.
- `sync_mapping`: mapeo entre expediente interno y fuente externa.

## 8. Entidades principales

### Firm

Representa el tenant. Todo lo que pertenezca a una firma debe colgar de `firm_id`.

Campos conceptuales:

- id;
- nombre;
- plan;
- estado;
- ciudad/pais;
- configuracion regional;
- preferencias de alertas;
- created_at, updated_at.

### Firm Member

Representa la membresia de un usuario en una firma.

Campos conceptuales:

- firm_id;
- user_id;
- role_id;
- estado;
- nombre profesional;
- tarjeta profesional;
- telefono;
- fecha de invitacion;
- fecha de aceptacion.

### Expediente

Contenedor juridico.

Campos conceptuales:

- firm_id;
- nombre;
- descripcion;
- area juridica;
- tipo de proceso;
- etapa procesal;
- estado;
- riesgo;
- responsable juridico;
- auxiliar asignado;
- autoridad/juzgado;
- ciudad;
- cuantia;
- fecha de apertura;
- fecha de cierre;
- radicado principal;
- proxima accion.

### Actuacion

Evento juridico.

Campos conceptuales:

- firm_id;
- expediente_id;
- tipo;
- titulo;
- fecha;
- descripcion;
- origen;
- responsable;
- fuente;
- puede_generar_termino;
- estado de validacion;
- created_by;
- audited_at.

### Termino

Plazo juridico u operativo de riesgo.

Campos conceptuales:

- firm_id;
- expediente_id;
- titulo;
- tipo;
- fecha_inicio;
- fecha_limite;
- hora_limite;
- zona_horaria;
- calendario_aplicable;
- estado;
- prioridad;
- riesgo;
- consecuencia;
- responsable;
- validador;
- origen;
- fuente;
- requiere_doble_validacion;
- notificaciones_configuradas;
- completado_at;
- cancelado_at;
- motivo_cancelacion.

### Documento

Archivo y metadata juridica.

Campos conceptuales:

- firm_id;
- expediente_id;
- titulo;
- tipo;
- categoria;
- estado;
- storage_bucket;
- storage_key;
- mime_type;
- size_bytes;
- checksum/hash;
- version_actual;
- texto_extraido_estado;
- clasificacion;
- uploaded_by;
- uploaded_at.

### Hallazgo IA

Entidad auditable que representa algo detectado por IA.

Campos conceptuales:

- firm_id;
- expediente_id;
- document_id;
- analysis_run_id;
- tipo: resumen, dato_detectado, actuacion_sugerida, termino_sugerido, tarea_sugerida, audiencia_sugerida, riesgo, inconsistencia;
- titulo;
- detalle;
- payload_sugerido;
- confidence;
- fuente_textual;
- pagina o rango del documento si existe;
- estado: sugerido, aceptado, editado, descartado;
- decision_by;
- decision_at;
- created_record_type;
- created_record_id.

### Audiencia

Hito procesal.

Campos conceptuales:

- firm_id;
- expediente_id;
- tipo;
- fecha;
- hora;
- modalidad;
- autoridad;
- sala/enlace;
- objetivo;
- estado;
- responsable;
- auxiliar;
- resultado;
- actuacion_resultado_id;
- created_by.

### Tarea

Trabajo interno.

Campos conceptuales:

- firm_id;
- expediente_id;
- titulo;
- descripcion;
- tipo;
- estado;
- prioridad;
- fecha_limite;
- responsable;
- fuente;
- source_type;
- source_id;
- completed_at.

## 9. Relaciones

Relaciones maestras:

- Una firma tiene muchos usuarios via `firm_member`.
- Una firma tiene muchos expedientes.
- Un expediente tiene muchas partes.
- Una parte puede aparecer en muchos expedientes con roles distintos.
- Un expediente tiene muchas actuaciones.
- Una actuacion pertenece a un expediente.
- Un documento pertenece siempre a un expediente base.
- Un documento puede relacionarse con una o muchas actuaciones, audiencias o terminos.
- Un termino pertenece siempre a un expediente.
- Un termino debe tener fuente o justificacion manual.
- Una audiencia pertenece siempre a un expediente.
- Una audiencia puede tener documentos, pruebas, checklist, tareas y terminos derivados.
- Una tarea pertenece preferiblemente a expediente; si nace de cliente, debe intentar conectarse a expediente cuando exista.
- Un hallazgo IA pertenece a documento y expediente.
- Un hallazgo IA puede generar una sugerencia.
- Una sugerencia IA puede convertirse en actuacion, termino, tarea, audiencia o dato de expediente solo despues de decision humana.

Regla arquitectonica: usar relaciones tipadas siempre que sea posible. Evitar un polimorfismo opaco tipo `source_type/source_id` como unica verdad. Puede existir para UX y trazabilidad, pero en datos criticos como terminos conviene tener columnas explicitas: `source_actuacion_id`, `source_document_id`, `source_audiencia_id`, con validacion de que exista una fuente o una justificacion manual.

## 10. Multi-tenant

Decision CTO: si, todas las tablas con datos de firma deben incluir `firm_id`.

Incluye:

- expedientes;
- actuaciones;
- documentos;
- document_versions;
- document_relations;
- terminos;
- audiencias;
- tareas;
- notas;
- parties creadas por firma;
- expediente_parties;
- ai_analysis_runs;
- ai_findings;
- ai_decisions;
- invoices;
- payments;
- audit_events;
- notifications;
- tablas puente.

Excepciones:

- catalogos globales de solo lectura;
- `auth.users` de Supabase;
- tablas de paises/ciudades si se usan como catalogo;
- plantillas globales mantenidas por LegalOS, siempre que no contengan datos de firma;
- configuracion interna de plataforma.

Justificacion:

### Seguridad

`firm_id` permite RLS simple, auditable y repetible. Supabase recomienda RLS para tablas expuestas y permite combinarlo con Supabase Auth para seguridad extremo a extremo. La arquitectura debe asumir que cualquier tabla en schema expuesto necesita RLS activado desde el inicio.

### Aislamiento

No basta con filtrar por usuario. Un abogado puede pertenecer a varias firmas. La unidad real de aislamiento es firma, no usuario.

### Rendimiento

Los indices deben iniciar por `firm_id` en casi todas las consultas:

- firm_id + expediente_id;
- firm_id + fecha_limite;
- firm_id + responsable_id;
- firm_id + estado;
- firm_id + radicado_normalizado;
- firm_id + source ids;
- firm_id + created_at.

Esto permite que Postgres reduzca el universo de busqueda antes de ordenar o unir.

### Escalabilidad

Con `firm_id` en todas las tablas, LegalOS puede llegar a 1000 abogados sin redisenar el nucleo. Sin `firm_id`, el sistema se vuelve fragil: RLS mas compleja, queries menos claras, migraciones dolorosas y mayor riesgo de fuga de datos.

Regla: duplicar `firm_id` en hijas aunque se pueda derivar por `expediente_id`. La consistencia se protege con claves compuestas, constraints o triggers. La seguridad y la operacion valen mas que una normalizacion academica perfecta.

## 11. Roles

### MVP

Roles minimos:

#### Propietario

Puede:

- ver toda la firma;
- gestionar miembros;
- configurar alertas;
- crear, editar, archivar y cerrar expedientes;
- validar terminos;
- ver financiero;
- exportar informacion;
- revisar auditoria.

#### Abogado

Puede:

- ver expedientes asignados o compartidos;
- crear actuaciones;
- validar terminos;
- preparar audiencias;
- subir documentos;
- aceptar/editar/descartar hallazgos IA;
- crear tareas;
- registrar notas;
- revisar financiero de sus expedientes si la firma lo permite.

#### Auxiliar

Puede:

- ver expedientes asignados;
- cargar documentos;
- crear borradores de actuaciones;
- crear tareas;
- preparar checklist;
- proponer terminos;
- actualizar datos operativos.

No debe poder:

- validar definitivamente terminos juridicos;
- cerrar expediente;
- eliminar documentos;
- aceptar decisiones IA de alto riesgo sin abogado;
- modificar permisos.

### Futuro

Roles futuros:

- socio;
- administrador;
- financiero;
- paralegal;
- invitado externo;
- auditor;
- solo lectura.

Recomendacion: no quemar permisos como enum rigido. Usar rol base + permisos granulares. El nombre del rol puede cambiar; el permiso debe permanecer estable.

## 12. Expediente

El expediente debe ser la pantalla madre y la entidad central.

Debe responder:

- cual es el radicado;
- que autoridad conoce;
- que partes intervienen;
- en que etapa esta;
- que ha ocurrido;
- que vence;
- que audiencia sigue;
- que documentos importan;
- que tareas estan abiertas;
- que riesgos existen;
- que debe hacer el abogado ahora.

Campos indispensables desde MVP:

- nombre;
- radicado principal;
- autoridad/juzgado;
- area juridica;
- tipo de proceso;
- etapa;
- estado;
- cuantia;
- responsable;
- auxiliar;
- descripcion ejecutiva;
- riesgo;
- proxima accion.

Estados recomendados:

- activo;
- en estudio;
- conciliacion;
- suspendido;
- terminado;
- archivado;
- cerrado.

Advertencia: "Investigacion" como estado de expediente en el prototipo es ambiguo para procesos judiciales. Puede existir como etapa interna, pero no como estado juridico general sin definicion.

## 13. Actuaciones

La actuacion debe ser el evento canonico del expediente.

Tipos iniciales:

- radicacion de demanda;
- contestacion;
- auto;
- notificacion;
- memorial;
- audiencia;
- sentencia;
- recurso;
- conciliacion;
- comunicacion relevante;
- actuacion administrativa/notarial;
- otra.

Cada actuacion debe tener:

- fecha juridica;
- fecha de registro;
- descripcion;
- responsable;
- origen;
- documentos asociados;
- consecuencias;
- derivados.

Derivados posibles:

- termino;
- tarea;
- audiencia;
- documento;
- nota;
- actualizacion de etapa;
- riesgo.

Decision CTO: una audiencia realizada debe poder generar una actuacion posterior de resultado. Un documento como auto admisorio debe poder generar una actuacion. Un hallazgo IA puede sugerir una actuacion, pero el abogado la crea o edita.

## 14. Documentos

Documentos no deben vivir en Postgres como binarios. Deben vivir en Cloudflare R2 o storage equivalente compatible con S3. Postgres guarda metadata, relaciones, texto extraido y estados.

### Almacenamiento

Recomendado:

- R2 bucket privado;
- object keys por firma y expediente;
- signed URLs de corta duracion;
- checksum por archivo;
- versionado logico en Postgres;
- no exponer rutas directas como autorizacion;
- permisos siempre desde Postgres/RLS, no desde el nombre del archivo.

### Clasificacion

Categorias iniciales:

- documento procesal;
- prueba;
- anexo;
- poder;
- providencia;
- sentencia;
- comunicacion;
- contrato;
- soporte financiero;
- otro.

### Versiones

Debe existir `document_version`.

Estados:

- pendiente;
- en revision;
- analizado;
- aprobado;
- firmado;
- radicado;
- reemplazado;
- archivado.

### Relaciones

Un documento puede estar relacionado con:

- expediente;
- actuacion;
- audiencia;
- termino;
- parte;
- cuenta de cobro;
- hallazgo IA.

Recomendacion: no limitar documento a una sola asociacion. En derecho real, un documento puede soportar una actuacion, ser prueba para audiencia y originar termino.

## 15. Hallazgos IA

`Hallazgo IA` debe ser entidad propia desde el primer backend real.

Flujo correcto:

1. Abogado sube documento.
2. Documento queda en estado pendiente o en revision.
3. UI muestra "Analizar con IA".
4. Abogado ejecuta analisis.
5. Se crea `ai_analysis_run`.
6. Se crean `ai_findings` y `ai_suggestions`.
7. Abogado acepta, edita o descarta cada hallazgo.
8. Si acepta, se crea el registro final.
9. Se registra `ai_decision` y `audit_event`.

Tipos de hallazgo:

- resumen;
- radicado detectado;
- juzgado detectado;
- partes detectadas;
- fecha detectada;
- cuantia detectada;
- tipo de proceso detectado;
- riesgo;
- actuacion sugerida;
- termino sugerido;
- tarea sugerida;
- audiencia sugerida;
- inconsistencia;
- dato faltante.

Estados:

- sugerido;
- aceptado;
- editado y aceptado;
- descartado;
- expirado;
- reemplazado.

Regla: la IA propone. El abogado valida. El sistema audita.

## 16. Control de Terminos

Este es el modulo mas importante de LegalOS.

Si LegalOS falla en terminos, falla el producto.

### Principios

- Un termino no es una tarea.
- Una tarea puede ayudar a cumplir un termino.
- Un termino debe tener fuente.
- Un termino debe tener responsable.
- Un termino debe tener consecuencia.
- Un termino sugerido por IA no es valido hasta revision humana.
- Un termino cancelado no se elimina.
- Un termino cumplido debe poder tener evidencia.

### Estados recomendados

- sugerido;
- borrador;
- pendiente_validacion;
- activo;
- proximo;
- vence_hoy;
- vencido;
- cumplido_pendiente_evidencia;
- cumplido;
- cancelado;
- sustituido;
- en_disputa.

Los estados `proximo`, `vence_hoy` y `vencido` pueden ser derivados, pero deben existir como vista o job para consultas y alertas consistentes. No deben depender solo del frontend.

### Riesgos

Riesgo debe calcularse con:

- fecha limite;
- prioridad;
- consecuencia;
- fuente;
- si fue validado;
- numero de responsables;
- evidencia de cumplimiento;
- proximidad a audiencia;
- historial de vencimientos del expediente.

Niveles:

- bajo;
- medio;
- alto;
- critico.

### Responsables

Todo termino debe tener:

- responsable juridico principal;
- responsable operativo opcional;
- validador;
- creador.

En MVP, el responsable juridico debe ser abogado. El auxiliar puede crear/proponer, pero no validar terminos juridicos criticos sin abogado.

### Origen

Origenes:

- actuacion;
- documento;
- audiencia;
- manual;
- sugerencia IA;
- integracion futura.

Para origen manual se exige justificacion.

### Validaciones

Reglas duras:

- no crear termino sin expediente;
- no crear termino sin responsable;
- no crear termino sin fecha;
- no crear termino de IA como activo sin validacion;
- no cancelar sin motivo;
- no marcar cumplido sin registrar accion o evidencia minima;
- no editar fecha de termino critico sin auditoria;
- no cambiar responsable sin auditoria;
- detectar duplicados por expediente, fecha, titulo y fuente.

### Alertas

Alertas minimas:

- al crear termino critico;
- 7 dias antes;
- 3 dias antes;
- 1 dia antes;
- el dia del vencimiento;
- despues de vencido;
- si no tiene responsable;
- si fue sugerido por IA y no validado;
- si fue cancelado;
- si cambia fecha.

Canales:

- Bandeja del Dia;
- email;
- notificacion in-app;
- digest diario;
- futuro WhatsApp solo si se controla trazabilidad y consentimiento.

### Como evitar perdida de terminos

Arquitectura anti-perdida:

1. Termino con entidad propia.
2. RLS y permisos claros.
3. Doble validacion para terminos de alto riesgo.
4. Alertas redundantes.
5. Digest diario por responsable.
6. Vista de terminos sin responsable.
7. Vista de terminos sin fuente.
8. Vista de vencidos no cerrados.
9. Auditoria de cambios de fecha/estado.
10. Evidencia de cumplimiento.
11. Escalamiento al propietario si se acerca vencimiento critico.
12. Job programado, no solo logica de UI.

## 17. Audiencias

La audiencia debe ser hito procesal, no solo evento de calendario.

Debe incluir:

- expediente;
- tipo;
- fecha y hora;
- modalidad;
- juzgado/autoridad;
- sala o enlace;
- objetivo;
- responsable;
- auxiliar;
- checklist;
- documentos asociados;
- pruebas;
- preguntas;
- teoria del caso;
- resultado;
- actuaciones derivadas;
- terminos derivados;
- tareas derivadas.

Estados:

- programada;
- confirmada;
- en preparacion;
- realizada;
- aplazada;
- cancelada;
- pendiente_resultado.

Flujo recomendado:

1. Crear audiencia.
2. Asociar documentos y pruebas.
3. Crear checklist.
4. Preparar con IA bajo demanda.
5. Registrar resultado.
6. Convertir resultado en actuacion.
7. Crear terminos/tareas derivados.
8. Auditar todo.

La audiencia sin resultado rompe la historia del expediente. Debe quedar como alerta.

## 18. Centro financiero

MVP realista:

- honorarios pactados;
- cuentas de cobro;
- pagos;
- cartera;
- estado por expediente;
- responsable de cobro;
- vencimientos financieros.

No construir todavia:

- contabilidad completa;
- conciliacion bancaria;
- facturacion electronica DIAN;
- impuestos;
- nomina;
- reportes financieros complejos.

Entidades MVP:

- fee_agreement;
- invoice/account_receivable;
- payment;
- financial_note.

Regla: el financiero acompana el expediente. Sirve para saber si hay honorarios pendientes antes de audiencia o hito importante. No debe desplazar el foco juridico.

## 19. IA V1

IA V1 debe ser conservadora, barata, contextual y auditable.

Casos de uso V1:

### Documento

Al hacer clic en "Analizar con IA":

- resumir documento;
- detectar radicado;
- detectar juzgado;
- detectar partes;
- detectar fechas;
- detectar cuantia;
- detectar tipo de proceso;
- detectar riesgos;
- sugerir actuacion;
- sugerir termino;
- sugerir tarea;
- sugerir audiencia.

### Expediente

Chat del expediente:

- resume este expediente;
- que actuaciones existen;
- que terminos estan pendientes;
- que audiencias existen;
- que riesgos veo;
- que documentos son importantes;
- que tareas siguen abiertas.

Restriccion: usar solo datos del expediente actual.

### Audiencia

Preparacion:

- resumen del expediente;
- actuaciones relevantes;
- documentos importantes;
- checklist;
- preguntas sugeridas;
- riesgos.

### Redaccion asistida

Borradores:

- memorial;
- correo;
- nota;
- minuta;
- escrito simple.

Siempre mostrar: "Requiere revision del abogado."

## 20. IA futura

IA futura debe crecer por profundidad, no por protagonismo.

Futuro razonable:

- chat de expediente con citacion de fuentes internas;
- busqueda semantica por expediente;
- comparacion de documentos;
- deteccion de inconsistencias;
- matriz probatoria;
- generacion de cronologia juridica;
- resumen para audiencia;
- plantillas por area juridica;
- extraccion avanzada de providencias;
- analisis de cartera juridica;
- priorizacion predictiva de riesgo operativo.

No recomiendo en fase temprana:

- recomendaciones juridicas autonomas;
- prediccion de resultado judicial como feature comercial;
- generacion automatica de escritos listos para radicar;
- integracion externa masiva sin control;
- agentes que creen registros sin confirmacion.

Arquitectura IA futura:

- embeddings por documento y expediente;
- chunks con `firm_id` y `expediente_id`;
- retrieval limitado por expediente;
- prompts versionados;
- evaluaciones de calidad;
- logs de costo y latencia;
- red teaming legal;
- exclusion de contenido sensible en analitica.

## 21. Rama Judicial futura

No implementar todavia.

Pero preparar arquitectura para:

- radicado normalizado;
- multiples radicados por expediente;
- fuente externa;
- mapping entre expediente LegalOS y expediente externo;
- sync manual primero;
- sync programado despues;
- historial de eventos externos;
- auditoria de importaciones;
- comparacion entre evento externo y actuacion interna.

Entidades futuras:

- external_case_source;
- external_case_mapping;
- external_case_event;
- external_document_reference;
- sync_job;
- sync_error.

Regla: Rama Judicial no debe escribir directamente en actuaciones finales. Debe importar eventos propuestos o pendientes de revision. El abogado valida que el evento externo corresponde al expediente y decide si se convierte en actuacion.

## 22. Riesgos tecnicos

### Riesgo 1: iniciar backend sin `firm_id` universal

Consecuencia: reescritura de permisos y datos al crecer.

Mitigacion: `firm_id` desde primera migracion en toda tabla tenant-owned.

### Riesgo 2: RLS incompleta

Consecuencia: fuga de datos entre firmas.

Mitigacion: RLS activado por defecto, pruebas de acceso por rol y tenant, politicas revisadas en PR.

### Riesgo 3: terminos como tareas

Consecuencia: perdida de plazos juridicos.

Mitigacion: entidad `termino` independiente con estados, validacion, alertas y auditoria.

### Riesgo 4: documentos sin versionado

Consecuencia: confusion probatoria y perdida de trazabilidad.

Mitigacion: `document_version`, hash y relaciones historicas.

### Riesgo 5: IA sin entidad auditable

Consecuencia: no se sabra que propuso, quien acepto ni que se cambio.

Mitigacion: `ai_analysis_run`, `ai_finding`, `ai_decision`.

### Riesgo 6: jobs largos en request web

Consecuencia: timeouts, analisis incompletos y alertas no confiables.

Mitigacion: background jobs.

### Riesgo 7: Postgres sin indices por tenant

Consecuencia: dashboards lentos a 300+ abogados.

Mitigacion: indices compuestos por `firm_id`, estado, fechas, responsable y expediente.

### Riesgo 8: analitica con datos sensibles

Consecuencia: riesgo de confidencialidad.

Mitigacion: PostHog solo con eventos anonimizados o pseudonimizados; nunca enviar radicados, nombres de clientes, texto documental ni pretensiones.

## 23. Riesgos de producto

### Riesgo 1: volverse CRM

Mitigacion: bajar Clientes de jerarquia y reforzar Expediente como centro.

### Riesgo 2: IA como protagonista

Mitigacion: IA contextual, bajo demanda, dentro de documento/expediente/audiencia.

### Riesgo 3: demasiados modulos antes del backend

Mitigacion: congelar dominio y construir verticales completas, no pantallas sueltas.

### Riesgo 4: "dashboard bonito" sin operacion

Mitigacion: Bandeja del Dia debe ordenar accion real, no indicadores.

### Riesgo 5: formularios libres para conceptos juridicos criticos

Mitigacion: catalogos controlados donde importa: estados, origenes, roles, tipos de actuacion, estados de termino.

### Riesgo 6: falta de lenguaje juridico colombiano

Mitigacion: mantener nomenclatura de expediente, actuacion, termino, audiencia, radicado, juzgado/autoridad, partes.

## 24. Auditoria del prototipo actual

Archivos revisados:

- `components/sidebar.tsx`
- `types/index.ts`
- `lib/mock-data.ts`
- `lib/store.tsx`
- `lib/source-resolver.ts`
- `app/dashboard/page.tsx`
- `app/cases/page.tsx`
- `app/cases/[id]/page.tsx`
- `app/cases/new/page.tsx`
- `app/documents/page.tsx`
- `app/documents/[id]/page.tsx`
- `components/document-ai-analysis.tsx`
- `components/ai-response.tsx`
- `app/deadlines/page.tsx`
- `app/hearings/page.tsx`
- `app/hearings/[id]/page.tsx`
- `app/tasks/page.tsx`
- `app/clients/page.tsx`
- `app/clients/[id]/page.tsx`
- `app/billing/page.tsx`
- `app/ai/page.tsx`
- `app/settings/page.tsx`

### Lectura tecnica del repo actual

- El prototipo es una app Next.js frontend navegable.
- `package.json` usa Next.js 14.2.5, React 18 y Tailwind 3.
- No hay dependencias reales de Supabase, OpenAI, R2, Sentry ni PostHog en el codigo actual.
- El estado vive en `lib/store.tsx` con `useState` y datos mock.
- Los datos base viven en `lib/mock-data.ts`.
- Los tipos viven en `types/index.ts`.
- No hay backend, migraciones, API real, auth, RLS, storage ni jobs.
- `components/ui.tsx` implementa componentes propios; no hay instalacion formal de shadcn/ui todavia.

### Lo que esta bien

- La navegacion ya pone Bandeja del Dia primero.
- Expedientes existen como modulo fuerte.
- El detalle de expediente incluye partes, actuaciones, terminos, audiencias, documentos, tareas, notas, financiero y equipo.
- `CaseProceeding` ya existe en tipos.
- `CaseDeadline` ya existe como entidad separada de tarea.
- `PartyRole` ya va mas alla de cliente/contraparte.
- El modulo de documentos ya habla de fechas y hallazgos.
- El componente de IA documental respeta el principio: analiza bajo demanda, propone, no crea automaticamente.
- El modulo de terminos ya contempla origen, responsable, riesgo, cancelacion justificada y validacion de sugerencia IA.
- Audiencias tienen checklist, documentos, pruebas, resultado, terminos y tareas derivadas.
- Financiero ya esta conectado a expediente, no aislado.
- `source-resolver` muestra una intencion correcta de trazabilidad.

### Errores conceptuales o riesgos

1. `Clientes` sigue siendo modulo principal de navegacion. Debe existir, pero no al mismo nivel emocional que Expedientes y Terminos.
2. `Asistente Juridico` como modulo top-level contradice "la IA no es protagonista". Puede quedar como laboratorio interno o centro de capacidades, pero en producto real debe vivir dentro de flujos.
3. El codigo usa `cases` y `LegalCase`. Producto dice `Expediente`. No es fatal, pero el lenguaje interno debe decidirse antes del backend.
4. `DocumentFinding` no es suficiente para Hallazgo IA real. Le faltan analysis_run, decision, source excerpt, payload, audit, created_record.
5. Las fechas estan como strings mezcladas entre `DD/MM/YYYY` e ISO. Esto es inaceptable para terminos reales.
6. Hay fechas hardcodeadas en Bandeja y Terminos. Sirve para demo, pero no debe sobrevivir al backend.
7. No hay `firm_id`, auth, RLS ni permisos reales.
8. No hay almacenamiento real. Los archivos se leen como `File` de formulario, pero no se persisten.
9. No hay auditoria real.
10. No hay versionado documental.
11. No hay calendario judicial ni dias habiles.
12. La cancelacion de terminos existe visualmente, pero no hay regla de autorizacion.
13. La tarea puede nacer de fuentes, pero no hay proteccion contra reemplazar terminos por tareas.
14. Financiero es mock, util para demo, pero aun no define cuentas de cobro/pagos con rigor.
15. Hay caracteres mal codificados (`Â·`) y ausencia general de tildes. Para demo comercial de LegalTech en Colombia, eso reduce confianza.

### Navegacion recomendada

Orden post-login:

1. Bandeja del Dia
2. Expedientes
3. Control de Terminos
4. Audiencias
5. Documentos
6. Tareas
7. Financiero
8. Clientes/Partes
9. Ajustes

IA no deberia ser item principal para el usuario final en MVP. Sus entradas naturales:

- Analizar con IA en documento.
- Preguntar al expediente.
- Preparar audiencia con IA.
- Redactar borrador desde expediente/documento.

### UX

El prototipo comunica madurez operativa, pero debe corregir:

- copy con acentos y codificacion;
- fechas reales y locales;
- menos tarjetas decorativas donde hay tablas operativas;
- mas jerarquia en expediente;
- acciones de alto riesgo con confirmacion;
- estados no ambiguos;
- visualizacion de "fuente" en terminos y tareas como elemento permanente.

### Nomenclatura

Congelar:

- Expediente, no caso como palabra de producto.
- Actuacion, no evento generico.
- Termino, no deadline como concepto de usuario.
- Audiencia, no calendario.
- Parte, no solo cliente/contraparte.
- Hallazgo IA, no solo finding.

## 25. MVP para 30 abogados beta

Objetivo: validar que LegalOS evita perdida de control operativo en expedientes reales.

MVP beta debe incluir:

### Fundacion

- Supabase Auth.
- Firmas.
- Miembros.
- Roles MVP.
- RLS.
- Audit log.
- Migrations.

### Expediente

- Crear/editar expediente.
- Radicado.
- Autoridad/juzgado.
- Area juridica.
- Tipo de proceso.
- Etapa.
- Responsable.
- Partes.
- Actuaciones.

### Documentos

- Upload a R2.
- Metadata en Postgres.
- Version inicial.
- Relacion con expediente.
- Analizar con IA bajo demanda.
- Hallazgos IA.
- Aceptar/editar/descartar hallazgo.

### Terminos

- Crear termino.
- Origen.
- Responsable.
- Estado.
- Riesgo.
- Alertas in-app.
- Digest email minimo.
- Cancelacion con motivo.
- Cumplimiento con evidencia.

### Audiencias

- Crear audiencia.
- Checklist.
- Documentos asociados.
- Resultado.
- Actuacion posterior.
- Terminos derivados.

### Tareas

- Crear tareas.
- Asociar fuente.
- Responsable.
- Estado.

### Bandeja del Dia

- Vista por usuario.
- Vista propietario.
- Terminos criticos.
- Audiencias proximas.
- Tareas vencidas.
- Hallazgos IA pendientes.

### Financiero minimo

- Honorario por expediente.
- Cuenta por cobrar.
- Pago.
- Estado de cartera.

No incluir en beta:

- integracion Rama Judicial;
- facturacion electronica;
- WhatsApp automatizado;
- prediccion judicial;
- IA juridica externa;
- multi-idioma;
- contabilidad completa.

## 26. Preparacion para 100 abogados pagos

Antes de cobrar a 100 abogados:

- RLS con pruebas automatizadas.
- Backups y plan de restauracion.
- Auditoria visible para eventos criticos.
- Monitoreo con Sentry.
- Analitica PostHog sin PII.
- Indices por `firm_id`, fechas, responsable, estado.
- Jobs confiables para alertas.
- Emails transaccionales.
- Export basico por expediente.
- Permisos por rol pulidos.
- Onboarding de firma.
- Soporte y reporte de incidentes.
- Logs de IA: costo, latencia, errores, decision humana.
- Limites por plan: usuarios, almacenamiento, analisis IA.

Cuellos de botella probables a 100:

- consultas de Bandeja del Dia;
- terminos con filtros por fecha;
- storage y previews de documentos;
- jobs IA;
- errores de permisos;
- soporte por confusion de roles.

## 27. Arquitectura para 1000 abogados

1000 abogados no exige microservicios desde el dia 1, pero exige disciplina de datos.

### Decisiones desde dia 1

- `firm_id` universal.
- RLS universal.
- audit log.
- indices compuestos.
- background jobs.
- storage externo.
- document text separado de metadata.
- IA asincrona.
- permisos granulares.
- separacion entre evento juridico y trabajo interno.

### Cuellos de botella a 300+

- Postgres CPU por dashboards.
- RLS mal indexada.
- consultas con joins sin `firm_id`.
- documentos grandes.
- OCR/IA paralelo.
- notificaciones masivas.
- audit log creciendo.
- busqueda textual/vectorial.

### Preparacion a 1000

- particionar audit log por fecha si crece demasiado;
- considerar materialized views para Bandeja del Dia;
- colas con reintentos;
- rate limiting por firma;
- presupuesto IA por firma;
- observabilidad por tenant;
- export asincrono;
- busqueda documental dedicada si Postgres empieza a sufrir;
- replicas de lectura si consultas crecen;
- plan enterprise para firmas grandes.

### Lo que NO haria antes de tiempo

- microservicios;
- multi-region activa;
- Kubernetes;
- data warehouse propio;
- motor de workflow complejo;
- integracion profunda con Rama antes de tener expediente/terminos perfecto.

## 28. Recomendacion final como CTO

Congelar vision asi:

LegalOS es un sistema operativo del expediente juridico. Su entidad central es Expediente. Su entidad operativa principal es Actuacion. Su modulo mas critico es Control de Terminos. Su IA es contextual, bajo demanda, auditable y siempre subordinada a decision humana.

La arquitectura debe iniciar por backend fundacional, no por mas pantallas:

1. Firmas, usuarios, roles y RLS.
2. Audit log.
3. Expedientes.
4. Partes.
5. Actuaciones.
6. Terminos.
7. Documentos con storage.
8. Hallazgos IA.
9. Audiencias.
10. Tareas.
11. Financiero MVP.

Mi recomendacion sobre el roadmap original: mover "Backend real" mucho antes. No debe esperar a Fase 5. Si primero se siguen agregando pantallas, se va a solidificar una arquitectura falsa basada en estado local y strings. El backend debe nacer temprano para que el producto piense como SaaS multi-tenant real.

## Roadmap maestro recomendado

### Fase 0 - Auditoria de dominio juridico

Duracion: 1 a 2 semanas.

Objetivos:

- validar terminologia con abogados colombianos;
- congelar entidades;
- definir estados;
- definir permisos;
- definir eventos auditables;
- definir calendario juridico minimo;
- definir tipos de actuaciones por area.

Entregables:

- glosario;
- mapa de dominio;
- matriz de estados;
- matriz de permisos;
- criterios de beta.

### Fase 1 - Backend fundacional multi-tenant

Objetivos:

- Supabase Auth;
- firms;
- firm_members;
- roles;
- RLS;
- audit_events;
- migrations;
- seeds;
- pruebas RLS.

No construir features sin esto.

### Fase 2 - Expediente + Partes + Actuaciones

Objetivos:

- CRUD expediente;
- radicados;
- partes procesales;
- actuaciones;
- linea de vida;
- relaciones basicas;
- auditoria.

Criterio de exito: un abogado puede entender un expediente solo viendo actuaciones y datos base.

### Fase 3 - Control de Terminos V1

Objetivos:

- terminos con origen;
- validacion;
- responsable;
- estados;
- alertas in-app;
- digest email;
- vencidos;
- cancelacion justificada;
- cumplimiento con evidencia.

Criterio de exito: ningun termino critico queda sin responsable, fuente o alerta.

### Fase 4 - Documentos + Storage + Hallazgos IA

Objetivos:

- R2;
- metadata;
- document_versions;
- upload;
- OCR/text extraction si aplica;
- Analizar con IA;
- ai_analysis_run;
- ai_findings;
- decision humana;
- creacion de actuacion/termino/tarea/audiencia desde sugerencia.

Criterio de exito: IA propone sin crear automaticamente y todo queda auditado.

### Fase 5 - Audiencias + Tareas

Objetivos:

- calendario de audiencias;
- checklist;
- documentos/pruebas asociados;
- resultado;
- actuacion posterior;
- terminos derivados;
- tareas derivadas.

Criterio de exito: una audiencia realizada actualiza la historia del expediente.

### Fase 6 - Financiero MVP

Objetivos:

- honorarios;
- cuentas por cobrar;
- pagos;
- cartera por expediente/cliente;
- alertas financieras simples.

Criterio de exito: el despacho sabe que tiene por cobrar sin convertir LegalOS en sistema contable.

### Fase 7 - IA contextual de expediente

Objetivos:

- chat de expediente;
- resumen;
- terminos pendientes;
- actuaciones;
- riesgos;
- documentos importantes;
- tareas abiertas;
- preparacion de audiencia;
- redaccion asistida.

Criterio de exito: respuestas basadas solo en fuentes del expediente.

### Fase 8 - Piloto 30 abogados

Objetivos:

- 5 a 10 firmas pequenas;
- uso real por 4 a 8 semanas;
- medir terminos creados, alertas atendidas, documentos analizados, hallazgos aceptados;
- entrevistas semanales;
- soporte cercano.

### Fase 9 - Escalamiento 100 abogados pagos

Objetivos:

- onboarding;
- planes;
- limites;
- soporte;
- monitoreo;
- seguridad;
- pruebas de carga basicas;
- reportes de uso.

### Fase 10 - Escalamiento 300+

Objetivos:

- optimizacion Postgres;
- jobs robustos;
- vistas materializadas si aplica;
- busqueda avanzada;
- permisos avanzados;
- financiero mejorado;
- preparacion para integraciones.

### Fase 11 - Arquitectura 1000 abogados

Objetivos:

- aislamiento operacional por tenant;
- observabilidad por firma;
- escalamiento de IA;
- particionamiento selectivo;
- integraciones externas;
- SLA y soporte enterprise.

## Uso de IA para programar LegalOS

### Codex

Uso ideal:

- implementar cambios repo-wide;
- crear migraciones con revision humana;
- escribir pruebas;
- revisar RLS;
- refactorizar componentes;
- detectar regresiones;
- hacer QA tecnico.

Regla: Codex puede escribir, pero el CTO revisa dominio, permisos y migraciones.

### Claude Code

Uso ideal:

- segunda opinion arquitectonica;
- analisis de dominio;
- revision de documentos largos;
- contraste de modelos de datos;
- deteccion de inconsistencias conceptuales.

### Cursor

Uso ideal:

- pair programming rapido en UI;
- iterar formularios y componentes;
- trabajar con contexto de archivo abierto;
- pulir experiencia visual.

### GitHub Copilot

Uso ideal:

- autocompletado local;
- snippets repetitivos;
- tests pequeños;
- tipos y helpers.

No usarlo como arquitecto.

### ChatGPT

Uso ideal:

- producto;
- copy legal;
- prompts IA;
- QA manual;
- casos de prueba;
- documentacion;
- entrevistas beta;
- analisis de feedback.

### Flujo recomendado

1. CTO define ADR o ticket con alcance.
2. Codex implementa vertical completa en rama.
3. Cursor ayuda en UI puntual.
4. Copilot acelera detalles repetitivos.
5. Claude o ChatGPT revisan arquitectura y producto.
6. PR con checklist: dominio, permisos, RLS, pruebas, auditoria, UX.
7. QA manual con escenarios juridicos.
8. Merge solo con migraciones revisadas.

### Como evitar deuda tecnica con IA

- no aceptar migraciones sin entenderlas;
- no permitir strings libres para estados criticos;
- no duplicar modelos en frontend/backend sin contrato;
- no crear features sin audit log;
- no saltarse pruebas RLS;
- no dejar prompts sin version;
- no dejar IA crear registros finales automaticamente;
- no mezclar datos sensibles en logs de producto.

## Fuentes externas consultadas

- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Storage: https://supabase.com/docs/guides/storage
- Cloudflare R2 S3 API: https://developers.cloudflare.com/r2/api/s3/api/
- Vercel Next.js: https://vercel.com/docs/frameworks/full-stack/nextjs
- Sentry para Next.js: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- PostHog Docs: https://posthog.com/docs
- OpenAI Retrieval: https://developers.openai.com/api/docs/guides/retrieval

## Veredicto final

LegalOS tiene una oportunidad real si se mantiene obsesivamente fiel al expediente.

La version correcta no es "un software para abogados con IA".  
La version correcta es "el sistema que impide que el expediente se vuelva invisible".

Construir alrededor de Expediente y Actuacion es la decision correcta. Construir terminos como entidad critica es obligatorio. Construir IA como hallazgos auditables es la forma segura. Construir multi-tenant con `firm_id` desde el dia 1 es innegociable.

Mi decision CTO: congelar esta arquitectura y empezar backend real por fundacion multi-tenant + expediente + actuaciones + terminos. Todo lo demas debe servir a ese nucleo.
