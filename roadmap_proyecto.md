LEGALOS AI
DOCUMENTO 02
ALCANCE OFICIAL DEL MVP Y ROADMAP DE CONSTRUCCIÓN
Versión: 1.0
Fecha: 18 de junio de 2026
Estado: Propuesta lista para revisión y congelación
Clasificación: Documento interno estratégico, funcional y técnico
Documento relacionado: Documento Maestro 01 — Visión, Arquitectura Funcional y Modelo de Dominio
Horizonte: MVP para 30 abogados beta, lanzamiento comercial para 100 usuarios y preparación para crecimiento posterior
________________________________________
1. PROPÓSITO DEL DOCUMENTO
Este documento define qué debe construirse, en qué orden debe construirse y qué debe excluirse de LegalOS AI durante sus primeras etapas.
Su función es evitar:
•	Crecimiento descontrolado del alcance.
•	Desarrollo de módulos innecesarios.
•	Construcción de pantallas sin backend real.
•	Duplicación de funciones.
•	Cambios constantes de prioridad.
•	Uso ineficiente del tiempo del desarrollador.
•	Acumulación de deuda técnica.
•	Lanzamiento prematuro con fallas de seguridad.
•	Confusión entre prototipo, MVP, beta y producto comercial.
•	Incorporación de inteligencia artificial antes de tener trazabilidad.
•	Escalamiento sin aislamiento multi-tenant.
•	Pérdida de foco sobre Expedientes, Actuaciones y Términos.
Este documento debe servir como referencia para:
•	Fundadores.
•	Product manager.
•	Socio desarrollador.
•	Diseñadores.
•	Desarrolladores.
•	Equipo de QA.
•	Herramientas de programación asistida por IA.
•	Asesores.
•	Futuros miembros del equipo.
Toda función nueva debe evaluarse contra el alcance definido aquí.
________________________________________
2. RELACIÓN CON EL DOCUMENTO MAESTRO 01
El Documento 01 definió:
•	Qué es LegalOS.
•	Qué no es LegalOS.
•	Expediente como entidad central.
•	Actuación como entidad operativa principal.
•	Término como riesgo temporal.
•	Audiencia como hito procesal.
•	Documento como soporte contextual.
•	IA como asistencia auditable.
•	Firma como unidad de aislamiento.
•	Bandeja del Día como entrada operativa.
El Documento 02 responde:
•	¿Qué parte de esa visión se construye primero?
•	¿Qué debe estar listo para el piloto?
•	¿Qué puede esperar?
•	¿Qué dependencias existen?
•	¿Cómo se mide el avance?
•	¿Cuándo puede abrirse el sistema a abogados reales?
•	¿Cuándo puede comenzar a cobrarse?
•	¿Qué funciones deben mantenerse fuera del MVP?
________________________________________
3. DEFINICIÓN OFICIAL DEL MVP
MVP significa Producto Mínimo Viable.
En LegalOS, “mínimo” no significa incompleto, inseguro o improvisado.
El MVP debe ser:
•	Limitado en alcance.
•	Completo en sus flujos principales.
•	Seguro para información jurídica.
•	Utilizable con expedientes reales.
•	Trazable.
•	Multi-tenant.
•	Auditable.
•	Confiable en términos y audiencias.
•	Capaz de obtener feedback real.
•	Preparado para crecer sin reescribir el núcleo.
3.1. Definición oficial
El MVP de LegalOS es una plataforma multi-tenant que permite a abogados y firmas pequeñas:
1.	Crear y administrar su firma.
2.	Invitar miembros.
3.	Crear clientes y partes.
4.	Crear expedientes.
5.	Registrar actuaciones.
6.	Gestionar documentos.
7.	Controlar términos.
8.	Programar y preparar audiencias.
9.	Asignar tareas.
10.	Consultar una Bandeja del Día.
11.	Analizar documentos con IA bajo demanda.
12.	Revisar y decidir sobre hallazgos IA.
13.	Registrar honorarios, cuentas por cobrar y pagos básicos.
14.	Conservar auditoría de acciones críticas.
15.	Recibir alertas operativas.
3.2. Objetivo principal del MVP
Validar que LegalOS ayuda a abogados reales a mantener control sobre sus expedientes y reduce el riesgo de desorganización, olvido de términos y pérdida de contexto.
3.3. Hipótesis principal
Si LegalOS concentra expediente, actuaciones, términos, documentos, audiencias y tareas en un sistema sencillo y confiable, los abogados lo utilizarán de manera recurrente y estarán dispuestos a pagar por mantener control de su operación jurídica.
________________________________________
4. DIFERENCIA ENTRE PROTOTIPO, ALPHA, BETA Y PRODUCTO COMERCIAL
4.1. Prototipo navegable
Es la versión actual o preliminar que permite:
•	Visualizar pantallas.
•	Probar navegación.
•	Validar jerarquías.
•	Simular datos.
•	Validar lenguaje.
•	Recoger opiniones.
No debe usarse como producto real porque carece de:
•	Backend.
•	Persistencia.
•	Seguridad real.
•	Autenticación.
•	RLS.
•	Storage.
•	Auditoría.
•	Jobs.
•	Alertas confiables.
4.2. Alpha interna
Primera versión con backend real utilizada únicamente por:
•	Fundadores.
•	Socio desarrollador.
•	Equipo interno.
•	Uno o dos abogados de extrema confianza.
Objetivo:
•	Detectar errores graves.
•	Validar flujos.
•	Probar datos reales controlados.
•	Ajustar permisos.
•	Corregir inconsistencias.
4.3. Beta cerrada
Versión utilizada por abogados seleccionados.
Objetivo:
•	Validar uso semanal.
•	Medir comportamiento.
•	Recibir feedback.
•	Detectar fallas operativas.
•	Verificar costos.
•	Confirmar disposición de pago.
4.4. Producto comercial
Versión suficientemente estable para cobrar de forma regular.
Debe contar con:
•	Seguridad.
•	Backups.
•	Monitoreo.
•	Soporte.
•	Límites por plan.
•	Onboarding.
•	Condiciones legales.
•	Capacidad de restauración.
•	Procesos de incidentes.
•	Métricas.
•	Facturación o mecanismo de cobro definido.
________________________________________
5. USUARIOS OBJETIVO DEL MVP
5.1. Perfil principal
•	Abogado independiente.
•	Litigante.
•	Firma pequeña.
•	Equipos entre una y diez personas.
•	Profesionales que gestionan entre 10 y 200 expedientes.
•	Usuarios acostumbrados a Excel, WhatsApp, Word y Drive.
•	Usuarios con baja o media madurez tecnológica.
5.2. Roles del MVP
•	Propietario.
•	Abogado.
•	Auxiliar.
5.3. Áreas jurídicas prioritarias
El modelo debe permitir:
•	Civil.
•	Penal.
•	Familia.
•	Laboral.
•	Comercial.
•	Administrativo.
•	Constitucional.
•	Tránsito.
No es obligatorio crear automatizaciones específicas para todas las áreas durante el MVP.
Sí es obligatorio que el modelo pueda clasificarlas desde el comienzo.
________________________________________
6. PRINCIPIOS PARA CONTROLAR EL ALCANCE
6.1. Construir verticales completas
Una vertical completa incluye:
Interfaz
→ Validación
→ Backend
→ Base de datos
→ Seguridad
→ Auditoría
→ Pruebas
→ Manejo de errores
No se considera terminado un módulo que solo tenga pantalla.
6.2. Construir primero el núcleo
Prioridad:
Firma y seguridad
→ Expediente
→ Actuación
→ Término
→ Documento
→ Audiencia
→ Tarea
→ IA
→ Financiero
6.3. No ampliar el alcance sin compensación
Toda función nueva debe implicar al menos una de estas decisiones:
•	Sustituir otra función.
•	Mover otra función al futuro.
•	Aumentar plazo.
•	Aumentar equipo.
•	Aumentar presupuesto.
6.4. Seguridad antes que velocidad comercial
LegalOS manejará datos sensibles.
No debe abrirse un piloto con información real si no existen:
•	RLS.
•	Aislamiento entre firmas.
•	Documentos privados.
•	Gestión segura de secretos.
•	Auditoría mínima.
•	Backups.
•	Pruebas de permisos.
6.5. La IA entra después del dominio
La IA no debe construirse antes de tener:
•	Expedientes reales.
•	Documentos reales.
•	Actuaciones reales.
•	Términos reales.
•	Auditoría.
•	Estructura de hallazgos.
•	Decisión humana.
________________________________________
7. NIVELES OFICIALES DE ALCANCE
LegalOS se divide en cuatro niveles.
Nivel 1 — MVP técnico interno
Objetivo:
•	Backend real.
•	Firma.
•	Usuarios.
•	Expedientes.
•	Actuaciones.
•	Términos.
•	Documentos básicos.
•	Seguridad.
Usuarios:
•	Equipo fundador.
•	Socio desarrollador.
Nivel 2 — Beta cerrada de 30 abogados
Objetivo:
•	Uso jurídico real.
•	Validar operación.
•	Validar términos.
•	Validar documentos.
•	Validar IA limitada.
•	Validar soporte.
Usuarios:
•	3, luego 5, 10, 20 y 30 abogados.
Nivel 3 — Producto comercial para 100 usuarios
Objetivo:
•	Cobro recurrente.
•	Onboarding.
•	Soporte estructurado.
•	Límites por plan.
•	Métricas.
•	Estabilidad.
•	Escalabilidad.
Nivel 4 — Crecimiento posterior
Objetivo:
•	300 a 1.000 abogados.
•	Integraciones.
•	Funciones avanzadas.
•	Mayor automatización.
•	Planes empresariales.
________________________________________
8. ALCANCE FUNCIONAL DEL MVP
________________________________________
8.1. FUNDACIÓN MULTI-TENANT
Objetivo
Crear la base segura sobre la que funcionará todo LegalOS.
Incluye
•	Supabase Auth.
•	Registro.
•	Inicio de sesión.
•	Recuperación de contraseña.
•	Cierre de sesión.
•	Firma.
•	Membresía.
•	Invitaciones.
•	Roles.
•	Contexto de firma.
•	Estados de membresía.
•	RLS.
•	Auditoría inicial.
•	Migraciones.
•	Seeds de prueba.
•	Entorno de desarrollo.
•	Entorno de staging.
•	Variables de entorno.
No incluye inicialmente
•	Inicio de sesión social.
•	SSO corporativo.
•	Múltiples métodos avanzados de autenticación.
•	MFA obligatorio.
•	Directorio empresarial.
•	Jerarquías complejas.
•	Un usuario con múltiples firmas en la primera interfaz, aunque el modelo puede prepararse.
Criterios de aceptación
•	Dos firmas no pueden leer datos entre sí.
•	El propietario puede invitar un miembro.
•	Un invitado puede aceptar.
•	Un usuario suspendido pierde acceso.
•	Un auxiliar no puede ejecutar acciones reservadas.
•	Todas las tablas privadas tienen RLS.
•	Las pruebas multi-tenant son satisfactorias.
________________________________________
8.2. GESTIÓN DE FIRMA
Incluye
•	Nombre.
•	Logo opcional.
•	Ciudad.
•	País.
•	Zona horaria.
•	Información de contacto.
•	Propietario.
•	Miembros.
•	Roles.
•	Estado.
•	Preferencias básicas.
•	Configuración de alertas.
Excluye
•	Sedes.
•	Departamentos complejos.
•	Centros de costos.
•	Equipos empresariales.
•	Organigramas.
•	Configuración avanzada por área.
________________________________________
8.3. CLIENTES Y CONTACTOS
Objetivo
Registrar las personas y entidades relacionadas con la firma.
Incluye
•	Persona natural.
•	Persona jurídica.
•	Nombre.
•	Identificación.
•	Tipo de identificación.
•	Correo.
•	Teléfono.
•	Dirección.
•	Ciudad.
•	Observaciones.
•	Estado.
•	Expedientes relacionados.
•	Búsqueda.
•	Prevención básica de duplicados.
Excluye
•	Campañas comerciales.
•	Embudos de venta.
•	Leads.
•	Automatización de marketing.
•	Correos masivos.
•	CRM comercial avanzado.
•	WhatsApp integrado.
Criterios
•	Un cliente puede tener varios expedientes.
•	Una persona puede ser parte sin ser cliente.
•	Se advierten posibles duplicados.
•	El cliente no domina la navegación.
________________________________________
8.4. PARTES PROCESALES
Incluye
•	Persona o entidad.
•	Rol en el expediente.
•	Calidad jurídica.
•	Representante.
•	Apoderado.
•	Observaciones.
•	Estado.
•	Relación con cliente.
Roles iniciales
•	Demandante.
•	Demandado.
•	Accionante.
•	Accionado.
•	Investigado.
•	Víctima.
•	Denunciante.
•	Denunciado.
•	Recurrente.
•	Opositor.
•	Convocante.
•	Convocado.
•	Tercero.
•	Testigo.
•	Perito.
•	Apoderado.
•	Representante.
•	Autoridad.
•	Otro.
Criterios
•	Una persona puede tener roles diferentes.
•	El sistema diferencia cliente y parte.
•	Una parte puede aparecer en varios expedientes.
________________________________________
8.5. EXPEDIENTES
Objetivo
Concentrar la información jurídica y operativa principal.
Incluye
•	Crear.
•	Editar.
•	Consultar.
•	Archivar.
•	Cerrar.
•	Reabrir con autorización.
•	Nombre.
•	Descripción.
•	Área jurídica.
•	Tipo de proceso.
•	Estado.
•	Etapa.
•	Riesgo.
•	Prioridad.
•	Responsable.
•	Auxiliar.
•	Fecha de apertura.
•	Fecha de cierre.
•	Radicado.
•	Autoridad.
•	Ciudad.
•	Cuantía.
•	Cliente.
•	Partes.
•	Próxima acción.
•	Etiquetas limitadas.
•	Historial básico.
•	Búsqueda.
•	Filtros.
•	Paginación.
Excluye inicialmente
•	Expedientes masivos.
•	Automatización completa por área.
•	Flujos procesales configurables.
•	Plantillas procesales avanzadas.
•	Integración con Rama Judicial.
•	Predicción de resultado.
•	Asignación automática.
Criterios
•	Todo expediente pertenece a una firma.
•	Todo expediente tiene responsable.
•	Todo expediente tiene área.
•	Todo expediente tiene estado.
•	Un expediente cerrado conserva su historia.
•	Las partes pueden agregarse y retirarse con auditoría.
•	El radicado puede normalizarse para búsqueda.
________________________________________
8.6. RADICADOS Y AUTORIDADES
Incluye
•	Radicado principal.
•	Radicados secundarios.
•	Valor visible.
•	Valor normalizado.
•	Tipo.
•	Instancia.
•	Autoridad.
•	Ciudad.
•	Fecha.
•	Estado.
Excluye
•	Consulta automática externa.
•	Verificación automática.
•	Sincronización con Rama Judicial.
________________________________________
8.7. ACTUACIONES
Objetivo
Construir la línea de vida jurídica del expediente.
Incluye
•	Crear actuación.
•	Editar con auditoría.
•	Consultar.
•	Orden cronológico.
•	Tipo.
•	Título.
•	Fecha jurídica.
•	Fecha de registro.
•	Descripción.
•	Origen.
•	Fuente.
•	Responsable.
•	Documento asociado.
•	Términos derivados.
•	Tareas derivadas.
•	Audiencias derivadas.
•	Cambio de etapa.
•	Cambio de estado.
•	Anulación justificada.
•	Sugerencia IA posterior.
Tipos iniciales
•	Demanda.
•	Admisión.
•	Inadmisión.
•	Rechazo.
•	Contestación.
•	Auto.
•	Notificación.
•	Traslado.
•	Memorial.
•	Requerimiento.
•	Audiencia.
•	Sentencia.
•	Recurso.
•	Conciliación.
•	Comunicación.
•	Actuación administrativa.
•	Actuación notarial.
•	Otra.
Criterios
•	Toda actuación pertenece a un expediente.
•	Toda actuación registra autor.
•	La fecha jurídica y la fecha de creación son diferentes.
•	Anular no elimina.
•	Los derivados conservan la relación de origen.
•	El expediente puede comprenderse mediante su línea de actuaciones.
________________________________________
8.8. CONTROL DE TÉRMINOS
Objetivo
Prevenir pérdida de plazos y controlar riesgos.
Incluye
•	Crear término.
•	Sugerir término.
•	Validar término.
•	Fecha inicial.
•	Fecha límite.
•	Hora límite opcional.
•	Zona horaria.
•	Tipo.
•	Estado.
•	Prioridad.
•	Riesgo.
•	Consecuencia.
•	Responsable jurídico.
•	Responsable operativo.
•	Validador.
•	Origen.
•	Fuente.
•	Justificación manual.
•	Alertas.
•	Cumplimiento.
•	Evidencia.
•	Cancelación.
•	Sustitución.
•	Auditoría.
•	Prevención de duplicados.
•	Vista de vencidos.
•	Vista de próximos.
•	Vista sin responsable.
•	Vista sin fuente.
Estados principales
•	Sugerido.
•	Borrador.
•	Pendiente de validación.
•	Activo.
•	Cumplido pendiente de evidencia.
•	Cumplido.
•	Cancelado.
•	Sustituido.
•	En disputa.
Estados temporales derivados
•	Próximo.
•	Vence hoy.
•	Vencido.
Alertas mínimas
•	Al crear término crítico.
•	Siete días antes.
•	Tres días antes.
•	Un día antes.
•	Día de vencimiento.
•	Después del vencimiento.
•	Sin responsable.
•	Sin validar.
•	Cambio de fecha.
•	Cancelación.
Excluye inicialmente
•	Motor jurídico automático completo.
•	Cálculo universal de términos por área.
•	Calendarios oficiales automatizados para toda Colombia.
•	Festivos judiciales avanzados.
•	Reglas procesales configurables.
•	WhatsApp automático.
Criterios
•	Ningún término activo queda sin responsable.
•	Ningún término activo queda sin fecha.
•	Ningún término de IA se activa automáticamente.
•	Los cambios de fecha se auditan.
•	La cancelación exige motivo.
•	El cumplimiento registra evidencia o acción.
•	Los jobs de alertas funcionan en segundo plano.
•	La Bandeja del Día refleja términos reales.
________________________________________
8.9. DOCUMENTOS
Objetivo
Almacenar archivos privados con contexto y trazabilidad.
Incluye
•	Carga.
•	Descarga autorizada.
•	Visualización cuando sea posible.
•	Metadata.
•	Categoría.
•	Tipo.
•	Estado.
•	Expediente.
•	Actuación asociada.
•	Audiencia asociada.
•	Término asociado.
•	Tamaño.
•	MIME.
•	Hash.
•	Usuario que carga.
•	Fecha.
•	Versión.
•	Relación documental.
•	Archivar.
•	Reemplazar mediante nueva versión.
•	Procesamiento básico.
•	Estado de extracción.
•	URLs firmadas.
Formatos iniciales
•	PDF.
•	DOCX.
•	JPG.
•	PNG.
Otros formatos pueden incorporarse después.
Excluye
•	Editor colaborativo.
•	Firma electrónica.
•	Conversión masiva.
•	OCR avanzado para todo tipo de archivo desde el primer día.
•	Edición de Word dentro de LegalOS.
•	Radicación externa.
•	Sincronización con Drive.
Criterios
•	Los binarios no viven en Postgres.
•	Los archivos son privados.
•	Las URLs expiran.
•	El usuario no puede descargar archivos de otra firma.
•	Reemplazar crea versión.
•	El documento conserva su expediente.
•	El almacenamiento registra checksum.
________________________________________
8.10. HALLAZGOS IA
Objetivo
Permitir análisis documental sin perder control humano.
Incluye
•	Botón “Analizar con IA”.
•	Ejecución bajo demanda.
•	Estado pendiente.
•	Estado procesando.
•	Estado completado.
•	Estado fallido.
•	Resumen.
•	Datos detectados.
•	Fechas.
•	Radicado.
•	Autoridad.
•	Partes.
•	Riesgos.
•	Actuación sugerida.
•	Término sugerido.
•	Tarea sugerida.
•	Audiencia sugerida.
•	Fuente textual.
•	Página cuando sea posible.
•	Confianza.
•	Aceptar.
•	Editar y aceptar.
•	Descartar.
•	Registro de decisión.
•	Registro del objeto creado.
•	Costo.
•	Modelo.
•	Prompt versionado.
•	Hash de documento.
Excluye
•	Creación automática.
•	Radicación.
•	Decisiones procesales.
•	Predicción judicial.
•	Chat jurídico abierto.
•	Investigación jurídica externa.
•	Generación automática de demandas completas.
•	Agentes autónomos.
Criterios
•	Toda propuesta tiene fuente.
•	Toda creación exige decisión humana.
•	Se conserva propuesta original.
•	Se registra quién decidió.
•	No se cobra doble por un reintento fallido.
•	El sistema evita analizar repetidamente el mismo archivo sin advertencia.
•	Los errores quedan visibles y reintentables.
________________________________________
8.11. AUDIENCIAS
Incluye
•	Crear.
•	Editar.
•	Reprogramar.
•	Cancelar.
•	Tipo.
•	Fecha.
•	Hora.
•	Modalidad.
•	Autoridad.
•	Lugar.
•	Enlace.
•	Responsable.
•	Auxiliar.
•	Objetivo.
•	Checklist.
•	Documentos.
•	Pruebas.
•	Tareas.
•	Resultado.
•	Actuación resultante.
•	Términos derivados.
•	Preparación con IA limitada.
Excluye
•	Videoconferencia integrada.
•	Grabación.
•	Transcripción automática.
•	Agenda externa bidireccional.
•	Sincronización compleja con calendarios.
•	Preparación predictiva.
Criterios
•	Una audiencia realizada registra resultado.
•	Una audiencia sin resultado genera alerta.
•	Reprogramar conserva fecha anterior.
•	Puede generar actuación.
•	Puede generar término.
•	Puede generar tareas.
________________________________________
8.12. TAREAS
Incluye
•	Crear.
•	Asignar.
•	Prioridad.
•	Estado.
•	Fecha.
•	Descripción.
•	Responsable.
•	Fuente.
•	Expediente.
•	Actuación.
•	Documento.
•	Término.
•	Audiencia.
•	Comentario básico.
•	Finalización.
•	Cancelación.
Excluye
•	Gestión de proyectos.
•	Dependencias complejas.
•	Diagramas Gantt.
•	Automatizaciones tipo workflow.
•	Tareas recurrentes avanzadas.
•	Gestión de capacidad.
Criterios
•	Toda tarea tiene responsable.
•	Toda tarea muestra origen.
•	Una tarea no sustituye un término.
•	Completar tarea no cierra término automáticamente.
•	Las tareas vencidas aparecen en Bandeja.
________________________________________
8.13. BANDEJA DEL DÍA
Objetivo
Mostrar al usuario qué debe atender.
Incluye
•	Vista personal.
•	Vista del propietario.
•	Términos vencidos.
•	Términos de hoy.
•	Términos próximos.
•	Audiencias próximas.
•	Tareas vencidas.
•	Tareas prioritarias.
•	Hallazgos IA pendientes.
•	Documentos pendientes.
•	Audiencias sin resultado.
•	Expedientes de riesgo.
•	Acciones directas.
•	Filtros básicos.
Excluye
•	Dashboard BI avanzado.
•	Gráficos financieros complejos.
•	Widgets personalizables.
•	Constructor de dashboards.
•	Métricas empresariales profundas.
Criterios
•	Los datos provienen del backend.
•	Las prioridades se actualizan.
•	Cada tarjeta permite actuar.
•	No se muestran datos decorativos.
•	La consulta funciona con paginación o límites apropiados.
________________________________________
8.14. CENTRO FINANCIERO MÍNIMO
Incluye
•	Honorario pactado.
•	Cuenta por cobrar.
•	Concepto.
•	Valor.
•	Fecha.
•	Vencimiento.
•	Estado.
•	Pago.
•	Saldo.
•	Cliente.
•	Expediente.
•	Soporte.
•	Observación.
•	Cartera básica.
Excluye
•	Contabilidad.
•	Facturación electrónica.
•	Impuestos.
•	Nómina.
•	Conciliación bancaria.
•	Estados financieros.
•	Reportes contables.
•	Integración DIAN.
•	Manejo de retenciones.
Criterios
•	El expediente muestra situación económica básica.
•	Los pagos reducen saldo.
•	No pueden duplicarse fácilmente.
•	Los cambios quedan auditados.
•	El financiero no domina la navegación.
________________________________________
8.15. NOTIFICACIONES
Incluye
•	In-app.
•	Correo.
•	Alertas de términos.
•	Alertas de audiencias.
•	Tareas asignadas.
•	Invitaciones.
•	Hallazgos pendientes.
•	Digest diario básico.
•	Estado leído/no leído.
Excluye
•	WhatsApp.
•	SMS.
•	Push móvil.
•	Preferencias avanzadas.
•	Automatización comercial.
________________________________________
8.16. AUDITORÍA
Incluye
Eventos críticos:
•	Creación.
•	Edición.
•	Archivado.
•	Cierre.
•	Cambio de fecha.
•	Cambio de responsable.
•	Cancelación.
•	Descarga documental.
•	Decisión IA.
•	Cambio de permisos.
•	Registro financiero.
•	Reprogramación.
•	Eliminación lógica.
Excluye
•	Interfaz empresarial avanzada de auditoría.
•	Exportación forense completa.
•	Firma criptográfica de cada evento.
Criterios
•	El registro es inmutable para usuarios normales.
•	Contiene valores anteriores y nuevos cuando aplica.
•	Identifica usuario, firma, entidad y fecha.
•	No expone contenido sensible innecesario.
________________________________________
8.17. BÚSQUEDA Y FILTROS
Incluye
•	Expediente.
•	Radicado.
•	Cliente.
•	Parte.
•	Documento por título.
•	Responsable.
•	Estado.
•	Área.
•	Fecha.
•	Término.
•	Audiencia.
Excluye
•	Búsqueda semántica global inicial.
•	Buscador jurisprudencial.
•	Indexación avanzada externa.
________________________________________
9. REQUISITOS NO FUNCIONALES DEL MVP
9.1. Seguridad
•	RLS activa.
•	Documentos privados.
•	Secrets protegidos.
•	Validación servidor.
•	Sesiones seguras.
•	Sin claves privadas en frontend.
•	Pruebas entre tenants.
•	Rate limiting en funciones críticas.
9.2. Integridad
•	Claves foráneas.
•	Campos obligatorios.
•	Estados controlados.
•	Restricciones.
•	Prevención de duplicados.
•	Soft delete.
•	Auditoría.
9.3. Rendimiento
Objetivos iniciales razonables:
•	Navegación común perceptiblemente rápida.
•	Listados paginados.
•	Consultas por firma indexadas.
•	Carga documental con progreso.
•	IA asíncrona.
•	No bloquear la interfaz durante procesos largos.
9.4. Disponibilidad
El MVP no requiere SLA enterprise.
Sí requiere:
•	Monitoreo.
•	Detección de errores.
•	Backups.
•	Procedimiento de restauración.
•	Rollback.
•	Estado visible de jobs fallidos.
9.5. Accesibilidad
•	Contraste.
•	Tamaños legibles.
•	Navegación por teclado básica.
•	Labels.
•	Mensajes de error.
•	Estados visibles.
•	Responsive.
9.6. Compatibilidad
Prioridad:
•	Chrome.
•	Edge.
•	Safari reciente.
•	Escritorio.
•	Portátil.
•	Tablet.
•	Celular para consulta y acciones simples.
9.7. Observabilidad
•	Sentry.
•	Logs.
•	Métricas.
•	Errores por módulo.
•	Jobs fallidos.
•	Latencia.
•	Uso de IA.
•	Costos.
9.8. Privacidad
•	No enviar PII a analítica.
•	No registrar textos jurídicos en logs.
•	Separar auditoría y telemetría.
•	Limitar acceso.
•	Conservar trazabilidad de descargas.
________________________________________
10. ROADMAP MAESTRO DE CONSTRUCCIÓN
________________________________________
FASE 0 — CIERRE DE DOMINIO Y PREPARACIÓN
Objetivo
Cerrar decisiones antes del backend.
Duración estimada
Una a dos semanas.
Trabajo
•	Aprobar Documento 01.
•	Aprobar Documento 02.
•	Definir glosario.
•	Definir estados.
•	Definir áreas.
•	Definir roles.
•	Definir permisos iniciales.
•	Definir eventos auditables.
•	Definir criterios de beta.
•	Revisar prototipo.
•	Corregir nomenclatura.
•	Identificar componentes reutilizables.
•	Crear backlog.
•	Crear issues.
•	Crear ADR iniciales.
Entregables
•	Dominio congelado.
•	Alcance congelado.
•	Backlog priorizado.
•	Matriz de roles preliminar.
•	Mapa de dependencias.
•	Convenciones.
Criterio de salida
No existen dudas estructurales sobre:
•	Expediente.
•	Actuación.
•	Término.
•	Documento.
•	Audiencia.
•	Tarea.
•	Hallazgo IA.
________________________________________
FASE 1 — FUNDACIÓN TÉCNICA
Objetivo
Preparar el repositorio para desarrollo real.
Trabajo
•	Rama develop.
•	Convenciones Git.
•	CI.
•	Lint.
•	Typecheck.
•	Build.
•	Variables.
•	Supabase local o desarrollo.
•	Proyecto staging.
•	Estructura de carpetas.
•	Configuración de errores.
•	Diseño inicial de migraciones.
•	Seeds.
•	Feature flags básicos.
•	Manejo central de errores.
Entregables
•	Pipeline básico.
•	Entorno reproducible.
•	Readme técnico.
•	Scripts.
•	Plantilla de PR.
•	Plantilla de issues.
Criterio de salida
Otro desarrollador puede clonar, instalar, configurar y ejecutar el proyecto.
________________________________________
FASE 2 — BACKEND MULTI-TENANT
Objetivo
Crear aislamiento y control de acceso.
Trabajo
•	Auth.
•	Firms.
•	Firm members.
•	Roles.
•	Permisos iniciales.
•	Invitaciones.
•	RLS.
•	Auditoría inicial.
•	Sesiones.
•	Layout protegido.
•	Contexto de firma.
•	Pruebas RLS.
Entregables
•	Registro.
•	Login.
•	Firma.
•	Invitaciones.
•	Roles.
•	Matriz de acceso.
Criterio de salida
Firma A no puede ver, consultar, modificar ni descargar datos de Firma B.
Bloqueo
Ningún módulo jurídico debe ponerse en producción antes de aprobar esta fase.
________________________________________
FASE 3 — EXPEDIENTES, CLIENTES, PARTES Y ACTUACIONES
Objetivo
Construir la columna vertebral.
Trabajo
•	Contactos.
•	Clientes.
•	Partes.
•	Expedientes.
•	Radicados.
•	Autoridades.
•	Actuaciones.
•	Línea de tiempo.
•	Estados.
•	Riesgos.
•	Búsqueda.
•	Filtros.
•	Auditoría.
Entregables
•	CRUD completo.
•	Detalle de expediente.
•	Línea de actuaciones.
•	Asignación de miembros.
•	Cierre y archivo.
Criterio de salida
Un abogado puede registrar y comprender un expediente real sin usar datos mock.
________________________________________
FASE 4 — CONTROL DE TÉRMINOS
Objetivo
Construir el módulo de riesgo más crítico.
Trabajo
•	Entidad término.
•	Estados.
•	Orígenes.
•	Fuente.
•	Responsables.
•	Validación.
•	Alertas.
•	Jobs.
•	Digest.
•	Cumplimiento.
•	Evidencia.
•	Cancelación.
•	Sustitución.
•	Auditoría.
•	Vistas operativas.
Entregables
•	Vista de términos.
•	Creación.
•	Validación.
•	Alertas.
•	Bandeja parcial.
•	Jobs programados.
Criterio de salida
No existe término activo sin:
•	Expediente.
•	Fecha.
•	Responsable.
•	Origen.
•	Estado.
•	Alerta.
________________________________________
FASE 5 — DOCUMENTOS Y STORAGE
Objetivo
Gestionar archivos privados y versionados.
Trabajo
•	Cloudflare R2.
•	Buckets privados.
•	Upload.
•	Signed URLs.
•	Metadata.
•	Hash.
•	Versiones.
•	Relaciones.
•	Preview.
•	Descarga.
•	Auditoría.
•	Estados de procesamiento.
Entregables
•	Carga segura.
•	Versionado.
•	Descarga autorizada.
•	Documentos por expediente.
Criterio de salida
Un usuario no puede descargar documentos de otra firma manipulando URLs o IDs.
________________________________________
FASE 6 — HALLAZGOS IA
Objetivo
Agregar IA contextual y controlada.
Trabajo
•	Jobs IA.
•	Analysis runs.
•	Findings.
•	Suggestions.
•	Decisions.
•	Prompt versioning.
•	Cost tracking.
•	Hash.
•	Reintentos.
•	Manejo de errores.
•	Fuentes.
•	Creación controlada.
Entregables
•	Analizar documento.
•	Resumen.
•	Datos.
•	Sugerencias.
•	Aceptar.
•	Editar.
•	Descartar.
•	Auditoría.
Criterio de salida
La IA nunca crea un registro jurídico final sin decisión humana.
________________________________________
FASE 7 — AUDIENCIAS Y TAREAS
Objetivo
Completar operación procesal.
Trabajo
•	Audiencias.
•	Checklist.
•	Documentos.
•	Pruebas.
•	Resultado.
•	Actuación posterior.
•	Términos derivados.
•	Tareas.
•	Responsables.
•	Alertas.
Entregables
•	Calendario operativo.
•	Vista de audiencia.
•	Preparación.
•	Resultado.
•	Tareas integradas.
Criterio de salida
Toda audiencia realizada puede cerrar su ciclo con resultado y derivados.
________________________________________
FASE 8 — BANDEJA DEL DÍA Y FINANCIERO
Objetivo
Convertir información en acción diaria.
Trabajo
•	Consultas agregadas.
•	Priorización.
•	Vista personal.
•	Vista propietario.
•	Riesgo.
•	Términos.
•	Audiencias.
•	Tareas.
•	Hallazgos.
•	Financiero básico.
•	Cuentas.
•	Pagos.
•	Cartera.
Entregables
•	Bandeja real.
•	Acciones rápidas.
•	Financiero vinculado.
Criterio de salida
El usuario puede iniciar su día y saber qué atender.
________________________________________
FASE 9 — HARDENING, QA Y SEGURIDAD
Objetivo
Preparar la alpha y el piloto.
Trabajo
•	Pruebas unitarias.
•	Integración.
•	E2E.
•	RLS.
•	Multi-tenant.
•	Documentos.
•	IA.
•	Fechas.
•	Términos.
•	Backups.
•	Restauración.
•	Sentry.
•	PostHog seguro.
•	Rendimiento.
•	Responsive.
•	Accesibilidad.
•	Corrección de textos.
•	Errores.
•	Rate limiting.
Entregables
•	Reporte QA.
•	Checklist de seguridad.
•	Plan de recuperación.
•	Bugs priorizados.
•	Release candidata.
Criterio de salida
No existen errores P0 o P1 abiertos.
________________________________________
FASE 10 — ALPHA INTERNA
Objetivo
Probar LegalOS con un grupo muy pequeño.
Usuarios
•	Fundadores.
•	Socio.
•	Dos o tres abogados conocidos.
Duración recomendada
Dos a cuatro semanas.
Actividades
•	Cargar expedientes controlados.
•	Crear términos.
•	Subir documentos.
•	Probar IA.
•	Registrar audiencias.
•	Probar permisos.
•	Restaurar datos.
•	Recoger feedback diario.
Criterio de salida
•	Los flujos críticos funcionan.
•	No hay fugas de datos.
•	Términos generan alertas.
•	Documentos permanecen disponibles.
•	IA no crea registros sola.
•	Los usuarios entienden la navegación.
________________________________________
FASE 11 — BETA PROGRESIVA HASTA 30 ABOGADOS
Etapa 1 — Tres abogados
Objetivo:
•	Acompañamiento diario.
•	Corregir errores obvios.
Etapa 2 — Cinco abogados
Objetivo:
•	Probar variedad de áreas.
•	Probar roles.
Etapa 3 — Diez abogados
Objetivo:
•	Medir soporte.
•	Medir uso semanal.
•	Evaluar estabilidad.
Etapa 4 — Veinte abogados
Objetivo:
•	Probar carga.
•	Medir costos IA.
•	Medir notificaciones.
Etapa 5 — Treinta abogados
Objetivo:
•	Validar producto.
•	Confirmar retención.
•	Preparar modelo comercial.
Regla
No avanzar automáticamente por número de días.
Avanzar solo cuando los criterios de la etapa anterior se cumplan.
________________________________________
FASE 12 — PREPARACIÓN PARA 100 USUARIOS PAGOS
Objetivo
Convertir beta en producto comercial.
Incluye
•	Planes.
•	Límites.
•	Cobros.
•	Onboarding.
•	Tutoriales.
•	Soporte.
•	Exportación.
•	Políticas.
•	Backups reforzados.
•	Métricas.
•	Costos.
•	Monitoreo.
•	Mejoras de rendimiento.
•	Búsqueda.
•	Permisos refinados.
•	Administración de consumo.
•	Status page o comunicación de incidentes.
•	Contratos y términos comerciales.
Criterio de salida
LegalOS puede recibir, atender y cobrar a 100 usuarios sin depender de soporte improvisado.
________________________________________
11. MAPA DE DEPENDENCIAS
Dominio congelado
↓
Fundación técnica
↓
Auth + Firma + RLS
↓
Expedientes + Partes
↓
Actuaciones
↓
Términos
↓
Documentos
↓
Hallazgos IA
↓
Audiencias + Tareas
↓
Bandeja del Día
↓
Financiero
↓
QA + Seguridad
↓
Alpha
↓
Beta
↓
100 usuarios
Dependencias críticas
•	IA depende de documentos.
•	Documentos dependen de expedientes.
•	Términos dependen de expedientes y fuentes.
•	Audiencias dependen de expedientes.
•	Bandeja depende de términos, audiencias y tareas.
•	Financiero depende de clientes y expedientes.
•	Todo depende de firma, permisos y RLS.
________________________________________
12. VERSIONES PROPUESTAS
v0.1 — Prototipo
•	Navegación.
•	Datos mock.
•	Validación de UX.
v0.2 — Fundación
•	Auth.
•	Firma.
•	RLS.
•	Auditoría.
v0.3 — Núcleo jurídico
•	Expedientes.
•	Partes.
•	Actuaciones.
v0.4 — Control operativo
•	Términos.
•	Documentos.
•	Tareas.
v0.5 — IA y audiencias
•	Hallazgos.
•	Audiencias.
•	Derivados.
v0.6 — Alpha
•	Bandeja.
•	Financiero.
•	QA inicial.
v0.7 — Beta cerrada
•	3 a 10 abogados.
v0.8 — Beta ampliada
•	20 a 30 abogados.
v0.9 — Preparación comercial
•	Planes.
•	Onboarding.
•	Soporte.
•	Monitoreo.
v1.0 — Lanzamiento comercial
•	Hasta 100 usuarios.
________________________________________
13. MATRIZ DE ALCANCE
Función	MVP técnico	Beta 30	Antes de 100	Futuro
Auth	Sí	Sí	Sí	Sí
Firmas	Sí	Sí	Sí	Sí
Roles básicos	Sí	Sí	Sí	Sí
Permisos avanzados	No	Parcial	Sí	Sí
Expedientes	Sí	Sí	Sí	Sí
Partes	Sí	Sí	Sí	Sí
Actuaciones	Sí	Sí	Sí	Sí
Términos	Sí	Sí	Sí	Sí
Alertas in-app	Sí	Sí	Sí	Sí
Alertas email	Parcial	Sí	Sí	Sí
WhatsApp	No	No	No	Posible
Documentos privados	Sí	Sí	Sí	Sí
Versionado	Sí	Sí	Sí	Sí
OCR	Limitado	Limitado	Mejorado	Sí
Hallazgos IA	Limitado	Sí	Sí	Sí
Chat de expediente	No	Opcional	Sí	Sí
Audiencias	Sí	Sí	Sí	Sí
Tareas	Sí	Sí	Sí	Sí
Bandeja del Día	Parcial	Sí	Sí	Sí
Financiero básico	Parcial	Sí	Sí	Sí
Contabilidad completa	No	No	No	No prioritaria
Portal cliente	No	No	No	Futuro
Rama Judicial	No	No	No	Futuro
Firma electrónica	No	No	No	Futuro
App móvil nativa	No	No	No	Futuro
Auditoría	Sí	Sí	Sí	Sí
Backups	Sí	Sí	Sí	Sí
Exportación	No	Básica	Sí	Sí
Analítica	Técnica	Producto	Completa	Completa
________________________________________
14. DEFINICIÓN DE PREPARADO
Una tarea está preparada para desarrollo cuando contiene:
•	Problema.
•	Objetivo.
•	Usuario.
•	Alcance.
•	Fuera de alcance.
•	Archivos o módulos.
•	Reglas de negocio.
•	Permisos.
•	Auditoría.
•	Criterios de aceptación.
•	Casos de error.
•	Dependencias.
•	Diseño aprobado cuando aplique.
________________________________________
15. DEFINICIÓN DE TERMINADO
Una función está terminada cuando:
•	El código existe.
•	Compila.
•	Pasa lint.
•	Pasa typecheck.
•	Tiene validación.
•	Tiene permisos.
•	Respeta firm_id.
•	Tiene RLS.
•	Tiene auditoría si aplica.
•	Maneja carga.
•	Maneja errores.
•	Maneja estado vacío.
•	Es responsive.
•	Fue probada.
•	Tiene migración.
•	Tiene documentación.
•	Está desplegada en staging.
•	Fue aprobada.
•	No rompe otras funciones.
Una pantalla visual sin backend no está terminada.
________________________________________
16. PRIORIZACIÓN DEL BACKLOG
Cada función se evaluará con:
•	Impacto jurídico.
•	Impacto operativo.
•	Frecuencia de uso.
•	Riesgo.
•	Dependencias.
•	Complejidad.
•	Coste.
•	Valor para beta.
•	Valor comercial.
Prioridad P0
•	Fuga de datos.
•	Término perdido.
•	Documentos inaccesibles.
•	Plataforma caída.
•	Corrupción de datos.
Prioridad P1
•	No crear expediente.
•	No crear término.
•	No cargar documento.
•	No recibir alertas críticas.
•	Fallo de permisos.
Prioridad P2
•	Filtro incorrecto.
•	UX confusa.
•	Error parcial.
•	Problema no crítico.
Prioridad P3
•	Ajuste visual.
•	Texto.
•	Espaciado.
•	Mejora cosmética.
________________________________________
17. CONTROL DE CAMBIOS DE ALCANCE
Toda propuesta nueva debe incluir:
1.	Nombre.
2.	Problema.
3.	Usuario.
4.	Impacto.
5.	Dependencias.
6.	Riesgo.
7.	Tiempo estimado.
8.	Función que desplaza.
9.	Fase propuesta.
10.	Decisión final.
Las decisiones posibles son:
•	Aprobada para MVP.
•	Aprobada para beta.
•	Aprobada para 100 usuarios.
•	Pospuesta.
•	Rechazada.
•	Requiere investigación.
________________________________________
18. CRITERIOS PARA ABRIR LA BETA
Producto
•	Expedientes funcionales.
•	Actuaciones funcionales.
•	Términos funcionales.
•	Documentos privados.
•	Audiencias.
•	Tareas.
•	Bandeja.
•	IA limitada.
•	Financiero básico.
Seguridad
•	RLS probada.
•	Dos firmas aisladas.
•	URLs firmadas.
•	Secrets seguros.
•	Roles probados.
•	Auditoría.
•	Backups.
Operación
•	Soporte.
•	Canal de incidentes.
•	Monitoreo.
•	Restauración.
•	Tutorial.
•	Datos demo.
Calidad
•	Sin P0.
•	Sin P1 críticos.
•	Builds estables.
•	Pruebas E2E.
•	Responsive.
•	Errores controlados.
Legal y privacidad
•	Términos y condiciones.
•	Política de privacidad.
•	Autorizaciones.
•	Advertencia de IA.
•	Tratamiento de datos.
________________________________________
19. CRITERIOS DE ÉXITO DEL PILOTO
Uso
•	Usuarios activos semanalmente.
•	Expedientes creados.
•	Actuaciones registradas.
•	Documentos cargados.
•	Términos creados.
•	Audiencias gestionadas.
•	Hallazgos revisados.
Valor
•	El abogado consulta LegalOS varias veces por semana.
•	Usa la Bandeja del Día.
•	Registra términos.
•	Encuentra documentos.
•	Puede explicar el estado de un expediente.
•	Considera que reduce desorganización.
•	Estaría dispuesto a pagar.
Calidad
•	No hay fuga de datos.
•	No se pierden documentos.
•	Las alertas críticas se entregan.
•	Los errores se recuperan.
•	Los costos IA son sostenibles.
Señales negativas
•	Usuarios no vuelven.
•	Solo usan LegalOS como archivo.
•	No crean términos.
•	Siguen dependiendo totalmente de Excel.
•	La navegación resulta confusa.
•	El soporte consume demasiado tiempo.
•	La IA genera desconfianza.
•	Los costos superan el margen previsto.
________________________________________
20. MÉTRICAS DEL MVP
Activación
•	Firmas creadas.
•	Invitaciones aceptadas.
•	Primer expediente creado.
•	Primer documento cargado.
•	Primer término creado.
Uso
•	Usuarios activos diarios.
•	Usuarios activos semanales.
•	Expedientes activos.
•	Actuaciones por expediente.
•	Términos por usuario.
•	Audiencias.
•	Tareas completadas.
IA
•	Análisis ejecutados.
•	Hallazgos.
•	Aceptados.
•	Editados.
•	Descartados.
•	Coste por análisis.
•	Coste por firma.
•	Errores.
•	Latencia.
Operación
•	Errores por módulo.
•	Alertas entregadas.
•	Jobs fallidos.
•	Tiempo de respuesta.
•	Documentos cargados.
•	Almacenamiento.
Negocio
•	Retención.
•	Intención de pago.
•	Conversión a pago.
•	Costo de soporte.
•	Costo de infraestructura.
•	Margen estimado.
________________________________________
21. RESPONSABILIDADES
Fundador y responsable jurídico-producto
•	Validar lógica jurídica.
•	Aprobar alcance.
•	Priorizar.
•	Probar UX.
•	Recoger feedback.
•	Validar lenguaje.
•	Evitar crecimiento descontrolado.
•	Aprobar decisiones de producto.
Socio desarrollador
•	Arquitectura técnica.
•	Backend.
•	Seguridad.
•	Migraciones.
•	RLS.
•	Storage.
•	Jobs.
•	Deploy.
•	Monitoreo.
•	Pruebas.
•	Documentación técnica.
Herramientas de IA
•	Proponer.
•	Programar bajo instrucciones.
•	Revisar.
•	Crear pruebas.
•	Detectar errores.
•	Documentar.
No pueden decidir unilateralmente:
•	Dominio.
•	Permisos.
•	Seguridad.
•	Migraciones.
•	Alcance.
•	Reglas jurídicas.
________________________________________
22. RIESGOS DEL ROADMAP
Riesgo: seguir mejorando solo el prototipo
Mitigación:
•	Congelar UI.
•	Iniciar backend.
Riesgo: intentar construir todas las áreas jurídicas
Mitigación:
•	Modelo general.
•	Automatización especializada posterior.
Riesgo: IA antes de auditoría
Mitigación:
•	Hallazgos y decisiones antes de automatizar.
Riesgo: términos demasiado complejos
Mitigación:
•	V1 manual y validada.
•	Motor automático futuro.
Riesgo: exceso de integraciones
Mitigación:
•	Ninguna integración externa crítica en MVP.
Riesgo: desarrollador único
Mitigación:
•	Alcance pequeño.
•	Documentación.
•	PR.
•	Backups.
•	Código modular.
Riesgo: soporte intensivo
Mitigación:
•	Piloto progresivo.
•	Tutoriales.
•	Base de conocimiento.
•	Firmas seleccionadas.
Riesgo: deuda técnica generada por IA
Mitigación:
•	Plan antes de código.
•	Revisión.
•	Pruebas.
•	Commits pequeños.
•	No aceptar migraciones sin entenderlas.
________________________________________
23. ESTIMACIÓN GENERAL DE TIEMPO
La duración depende de:
•	Dedicación del desarrollador.
•	Experiencia.
•	Calidad del prototipo.
•	Cantidad de cambios.
•	Disponibilidad del fundador.
•	Integraciones elegidas.
•	Nivel de QA.
•	Complejidad del calendario jurídico.
Escenario de un desarrollador principal
Estimación razonable:
•	Cierre de dominio: 1–2 semanas.
•	Fundación y multi-tenant: 3–5 semanas.
•	Expedientes y actuaciones: 4–6 semanas.
•	Términos: 3–5 semanas.
•	Documentos: 3–5 semanas.
•	IA: 3–5 semanas.
•	Audiencias y tareas: 3–4 semanas.
•	Bandeja y financiero: 2–4 semanas.
•	QA y alpha: 3–5 semanas.
Rango total aproximado:
25 a 41 semanas
Escenario con dos desarrolladores coordinados
Rango aproximado:
18 a 30 semanas
Estas cifras no son una promesa contractual. Sirven para evitar expectativas irreales de construir un SaaS jurídico seguro en pocas semanas.
________________________________________
24. BACKLOG INICIAL POR ÉPICAS
Épica 1 — Fundación
•	Configuración.
•	CI.
•	Supabase.
•	Ambientes.
•	Errores.
Épica 2 — Identidad y firma
•	Auth.
•	Firma.
•	Miembros.
•	Roles.
•	Invitaciones.
Épica 3 — Expediente
•	CRUD.
•	Radicados.
•	Autoridad.
•	Estados.
•	Riesgo.
Épica 4 — Personas
•	Contactos.
•	Clientes.
•	Partes.
•	Roles procesales.
Épica 5 — Actuaciones
•	Timeline.
•	Tipos.
•	Derivados.
•	Auditoría.
Épica 6 — Términos
•	Creación.
•	Validación.
•	Alertas.
•	Cumplimiento.
•	Evidencia.
Épica 7 — Documentos
•	R2.
•	Versiones.
•	Relaciones.
•	Signed URLs.
Épica 8 — IA
•	Runs.
•	Findings.
•	Decisions.
•	Costs.
Épica 9 — Audiencias
•	Agenda.
•	Checklist.
•	Resultado.
•	Derivados.
Épica 10 — Tareas
•	Asignación.
•	Estados.
•	Fuente.
•	Bandeja.
Épica 11 — Financiero
•	Honorarios.
•	Cuentas.
•	Pagos.
•	Cartera.
Épica 12 — Operación
•	Bandeja.
•	Notificaciones.
•	Soporte.
•	Métricas.
Épica 13 — QA
•	Seguridad.
•	RLS.
•	E2E.
•	Backups.
•	Performance.
________________________________________
25. FUNCIONES POSPUESTAS
No deben bloquear el MVP:
•	Rama Judicial.
•	WhatsApp.
•	Portal cliente.
•	App móvil.
•	Firma electrónica.
•	Facturación DIAN.
•	Contabilidad.
•	Jurisprudencia.
•	Predicción.
•	Agentes autónomos.
•	Multiidioma.
•	Integraciones masivas.
•	Workflow builder.
•	Automatización completa por área.
•	Gestión documental colaborativa.
•	Red social.
•	Marketplace.
•	Reportería enterprise.
•	Inteligencia de negocios avanzada.
________________________________________
26. REGLAS DE CONGELACIÓN DEL ALCANCE
Una vez aprobado este documento:
1.	No se agregan módulos sin proceso de cambio.
2.	No se modifica la secuencia sin justificación.
3.	No se adelanta IA antes de seguridad y documentos.
4.	No se adelantan integraciones externas.
5.	No se abre beta sin RLS.
6.	No se abre beta sin backups.
7.	No se cobra sin soporte.
8.	No se considera terminada una pantalla mock.
9.	No se mezcla desarrollo de muchas fases simultáneamente.
10.	No se comprometen fechas comerciales sin revisar capacidad.
________________________________________
27. VEREDICTO FINAL
El MVP de LegalOS no debe intentar ser el software jurídico más grande.
Debe ser el sistema más confiable para controlar:
•	Expedientes.
•	Actuaciones.
•	Términos.
•	Documentos.
•	Audiencias.
•	Tareas.
La secuencia correcta es:
Congelar dominio
→ Construir seguridad multi-tenant
→ Construir expediente
→ Construir actuaciones
→ Construir términos
→ Construir documentos
→ Incorporar IA auditable
→ Completar audiencias y tareas
→ Construir Bandeja del Día
→ Probar
→ Pilotear
→ Cobrar
El éxito del MVP no se medirá por la cantidad de funciones.
Se medirá por:
•	Confianza.
•	Uso recurrente.
•	Control de términos.
•	Organización.
•	Retención.
•	Disposición de pago.
•	Capacidad de crecer sin reescribir el sistema.
