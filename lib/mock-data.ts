import { Activity, Client, FirmProfile, Hearing, LegalCase, LegalDocument, Task, TeamMember } from "@/types";

export const firmProfile: FirmProfile = {
  id: "firm-1",
  name: "Gamarra Legal",
  logo: "GL",
  city: "Bogota, Colombia",
  plan: "LegalOS Pro",
  lawyers: 2,
  assistants: 1,
  description: "Despacho juridico colombiano enfocado en litigios civiles, familia, laboral y tramites notariales."
};

export const teamMembers: TeamMember[] = [
  { id: "tm-1", name: "Dr. Juan Martinez", role: "Propietario", email: "juan@gamarralegal.co", city: "Bogota", active: true },
  { id: "tm-2", name: "Dra. Laura Gomez", role: "Abogado", email: "laura@gamarralegal.co", city: "Medellin", active: true },
  { id: "tm-3", name: "Camila Torres", role: "Auxiliar Juridico", email: "camila@gamarralegal.co", city: "Bogota", active: true }
];

export const clients: Client[] = [
  { id: "cl-1", name: "Maria Fernanda Alvarez", personType: "Natural", documentType: "Cedula de ciudadania", document: "52.418.903", representative: "", phone: "310 560 1234", alternatePhone: "601 440 2121", email: "maria.alvarez@email.com", preferredChannel: "WhatsApp", city: "Bogota", address: "Carrera 11 # 82-31, Bogota", notes: "Prefiere actualizaciones cortas despues de cada actuacion.", status: "Activo", origin: "Referido", lastInteraction: "Hoy, 10:30 AM", conflictAlert: false, conflictDetail: "", responsibleLawyer: "Dr. Juan Martinez" },
  { id: "cl-2", name: "Carlos Eduardo Lopez", personType: "Natural", documentType: "Cedula de ciudadania", document: "79.334.120", representative: "", phone: "311 444 9876", alternatePhone: "604 300 2121", email: "carlos.lopez@email.com", preferredChannel: "Telefono", city: "Medellin", address: "Calle 7 # 43A-20, Medellin", notes: "Requiere seguimiento previo a cada conciliacion.", status: "Activo", origin: "Web", lastInteraction: "Ayer, 3:20 PM", conflictAlert: false, conflictDetail: "", responsibleLawyer: "Dra. Laura Gomez" },
  { id: "cl-3", name: "Empresa Constructora S.A.S.", personType: "Juridica", documentType: "NIT", document: "901.123.456-7", representative: "Juliana Rios", phone: "601 123 4567", alternatePhone: "315 222 8181", email: "legal@constructora.com", preferredChannel: "Correo", city: "Bogota", address: "Avenida Chile # 10-20, Bogota", notes: "Validar aprobacion interna antes de radicar gastos extraordinarios.", status: "Activo", origin: "Cliente corporativo", lastInteraction: "Lunes, 4:15 PM", conflictAlert: true, conflictDetail: "Revisar relacion previa con contratista vinculado al proceso laboral.", responsibleLawyer: "Dr. Juan Martinez" },
  { id: "cl-4", name: "Ana Maria Gonzalez", personType: "Natural", documentType: "Cedula de ciudadania", document: "43.201.887", representative: "", phone: "312 880 8012", alternatePhone: "601 230 1000", email: "ana.gonzalez@email.com", preferredChannel: "Correo", city: "Bogota", address: "Calle 90 # 19-41, Bogota", notes: "Solicita copia de cada memorial radicado.", status: "Activo", origin: "Referido", lastInteraction: "05/06/2026", conflictAlert: false, conflictDetail: "", responsibleLawyer: "Dra. Laura Gomez" }
];

export const cases: LegalCase[] = [
  {
    id: "c-2026-0456",
    name: "Alvarez vs. Aseguradora Andina",
    filingNumber: "11001400301220260045600",
    clientId: "cl-1",
    city: "Bogota",
    legalArea: "Civil",
    processType: "Responsabilidad civil",
    proceduralStage: "Audiencia inicial",
    status: "En proceso",
    createdAt: "12/03/2026",
    nextHearing: "Audiencia inicial - 12/06/2026",
    criticalDeadline: "10/06/2026",
    court: "Juzgado 12 Civil Municipal de Bogota",
    counterparty: "Aseguradora Andina S.A.",
    opposingCounsel: "Dra. Natalia Pardo",
    amount: 185000000,
    internalOwner: "Dr. Juan Martinez",
    assistantOwner: "Camila Torres",
    risk: "Alto",
    riskScore: 86,
    description: "Demanda por danos y perjuicios derivados de accidente de transito. El expediente depende de la consistencia del dictamen pericial y la preparacion de testigos.",
    currentAction: "Preparar interrogatorio y validar notificacion del dictamen pericial",
    aiRecommendation: "Priorizar preparacion de audiencia, cerrar matriz probatoria y revisar cuantias reclamadas antes del 10 de junio.",
    timeline: [
      { date: "12/03/2026", title: "Radicacion de demanda", detail: "Demanda admitida con anexos principales.", status: "Completado" },
      { date: "22/04/2026", title: "Traslado contestado", detail: "La aseguradora propuso excepciones de culpa exclusiva.", status: "Completado" },
      { date: "10/06/2026", title: "Termino de preparacion", detail: "Cerrar preguntas, anexos y teoria del caso.", status: "En curso" },
      { date: "12/06/2026", title: "Audiencia inicial", detail: "Fijacion del litigio, conciliacion y decreto de pruebas.", status: "Pendiente" }
    ],
    evidence: [{ id: "ev-1", title: "Dictamen pericial de danos", detail: "Pendiente validar traslado y soporte tecnico.", date: "08/06/2026", kind: "Prueba" }],
    attachments: [{ id: "an-1", title: "Registro fotografico del accidente", detail: "Anexo principal de responsabilidad.", date: "12/03/2026", kind: "Anexo" }],
    deadlines: [{ id: "vd-1", title: "Cerrar preparacion de audiencia", date: "10/06/2026", time: "17:00", type: "Preparacion de audiencia", origin: "Actuacion", priority: "Alta", owner: "Dr. Juan Martinez", consequence: "Llegar a audiencia sin teoria del caso ni preguntas cerradas.", status: "Pendiente", caseId: "c-2026-0456", sourceType: "Actuacion", sourceId: "c-2026-0456" }],
    notes: [{ id: "nt-1", text: "Preparar linea de preguntas sobre nexo causal y cuantificacion de perjuicios.", author: "Dr. Juan Martinez", date: "09/06/2026" }],
    fees: [{ id: "fh-1", concept: "Cuota de preparacion de audiencia", amount: 8200000, status: "Por cobrar", dueDate: "12/06/2026" }]
  },
  {
    id: "f-2026-1122",
    name: "Lopez - Reajuste de alimentos",
    filingNumber: "05001311000420260112200",
    clientId: "cl-2",
    city: "Medellin",
    legalArea: "Familia",
    processType: "Familia",
    proceduralStage: "Conciliacion prejudicial",
    status: "Conciliacion",
    createdAt: "18/04/2026",
    nextHearing: "Conciliacion - 14/06/2026",
    criticalDeadline: "11/06/2026",
    court: "Centro de Conciliacion Medellin",
    counterparty: "Paula Andrea Restrepo",
    opposingCounsel: "Sin apoderado registrado",
    amount: 3600000,
    internalOwner: "Dra. Laura Gomez",
    assistantOwner: "Camila Torres",
    risk: "Alto",
    riskScore: 78,
    description: "Proceso de reajuste de cuota alimentaria con necesidad de soportes actualizados de ingresos, gastos del menor y capacidad economica.",
    currentAction: "Radicar liquidacion actualizada y preparar propuesta de acuerdo",
    aiRecommendation: "Consolidar soportes financieros y preparar escenario minimo de negociacion para conciliacion.",
    timeline: [
      { date: "18/04/2026", title: "Solicitud presentada", detail: "Se abrio tramite de conciliacion.", status: "Completado" },
      { date: "29/05/2026", title: "Soportes solicitados", detail: "Pendientes certificados de estudio y salud.", status: "En curso" },
      { date: "11/06/2026", title: "Entrega de liquidacion", detail: "Enviar propuesta y anexos al centro.", status: "Pendiente" },
      { date: "14/06/2026", title: "Audiencia de conciliacion", detail: "Negociacion de cuota y retroactivo.", status: "Pendiente" }
    ],
    evidence: [{ id: "ev-2", title: "Soportes de ingresos", detail: "Certificados laborales y extractos bancarios.", date: "29/05/2026", kind: "Prueba" }],
    attachments: [{ id: "an-2", title: "Registro civil del menor", detail: "Documento base para la conciliacion.", date: "18/04/2026", kind: "Anexo" }],
    deadlines: [{ id: "vd-2", title: "Radicar liquidacion actualizada", date: "11/06/2026", time: "16:00", type: "Radicacion", origin: "Documento", priority: "Alta", owner: "Dra. Laura Gomez", consequence: "Perder oportunidad de negociar con cifras actualizadas.", status: "Pendiente", caseId: "f-2026-1122", sourceType: "Documento", sourceId: "d-2" }],
    notes: [{ id: "nt-2", text: "Preparar escenario minimo y maximo de negociacion.", author: "Dra. Laura Gomez", date: "07/06/2026" }],
    fees: [{ id: "fh-2", concept: "Honorarios conciliacion", amount: 3600000, status: "Por cobrar", dueDate: "14/06/2026" }]
  },
  {
    id: "l-2026-0009",
    name: "Constructora S.A.S. vs. Contratista",
    filingNumber: "76001310500220260000900",
    clientId: "cl-3",
    city: "Cali",
    legalArea: "Laboral",
    processType: "Ordinario laboral",
    proceduralStage: "Practica de pruebas",
    status: "En proceso",
    createdAt: "05/05/2026",
    nextHearing: "Audiencia de pruebas - 19/06/2026",
    criticalDeadline: "17/06/2026",
    court: "Tribunal Superior de Cali",
    counterparty: "Andres Felipe Cano",
    opposingCounsel: "Dr. Camilo Torres",
    amount: 15400000,
    internalOwner: "Dr. Juan Martinez",
    assistantOwner: "Camila Torres",
    risk: "Medio",
    riskScore: 61,
    description: "Controversia laboral por contrato de prestacion de servicios. El punto central es acreditar autonomia e independencia del contratista.",
    currentAction: "Organizar anexos contractuales y preparar testigo tecnico",
    aiRecommendation: "Construir matriz de subordinacion y resaltar entregables pactados para audiencia de pruebas.",
    timeline: [
      { date: "05/05/2026", title: "Expediente asignado", detail: "Se recibio poder y paquete documental.", status: "Completado" },
      { date: "02/06/2026", title: "Revision contractual", detail: "Se marcaron clausulas criticas.", status: "Completado" },
      { date: "17/06/2026", title: "Preparacion de prueba", detail: "Depurar anexos y preguntas al testigo.", status: "En curso" },
      { date: "19/06/2026", title: "Audiencia de pruebas", detail: "Practica testimonial y documental.", status: "Pendiente" }
    ],
    evidence: [{ id: "ev-3", title: "Contrato de prestacion de servicios", detail: "Prueba central sobre autonomia e independencia.", date: "02/06/2026", kind: "Prueba" }],
    attachments: [{ id: "an-3", title: "Actas de entrega", detail: "Entregables pactados por el contratista.", date: "05/05/2026", kind: "Anexo" }],
    deadlines: [{ id: "vd-3", title: "Preparar testigo tecnico", date: "17/06/2026", time: "12:00", type: "Preparacion probatoria", origin: "Audiencia", priority: "Media", owner: "Dr. Juan Martinez", consequence: "Debilitar la prueba sobre ausencia de subordinacion.", status: "Pendiente", caseId: "l-2026-0009", sourceType: "Audiencia", sourceId: "h-3" }],
    notes: [{ id: "nt-3", text: "Cruzar clausulas contractuales con entregables para descartar subordinacion.", author: "Dr. Juan Martinez", date: "06/06/2026" }],
    fees: [{ id: "fh-3", concept: "Factura F-2026-0118", amount: 15400000, status: "Vencido", dueDate: "05/06/2026" }]
  },
  {
    id: "p-2026-0021",
    name: "Sucesion Gonzalez",
    filingNumber: "NOT18-2026-0021",
    clientId: "cl-4",
    city: "Bogota",
    legalArea: "Familia",
    processType: "Sucesion",
    proceduralStage: "Inventarios y avaluos",
    status: "Investigacion",
    createdAt: "22/05/2026",
    nextHearing: "Inventarios y avaluos - 24/06/2026",
    criticalDeadline: "20/06/2026",
    court: "Notaria 18 de Bogota",
    counterparty: "Herederos Gonzalez",
    opposingCounsel: "Pendiente por confirmar",
    amount: 5400000,
    internalOwner: "Dra. Laura Gomez",
    assistantOwner: "Camila Torres",
    risk: "Medio",
    riskScore: 54,
    description: "Acompanamiento en tramite sucesoral con activos inmobiliarios y posible discusion sobre mejoras realizadas por un heredero.",
    currentAction: "Solicitar certificados de libertad y avaluos actualizados",
    aiRecommendation: "Cerrar inventario patrimonial y separar activos con soporte incompleto antes de audiencia notarial.",
    timeline: [
      { date: "22/05/2026", title: "Apertura del tramite", detail: "Cliente entrego documentos iniciales.", status: "Completado" },
      { date: "03/06/2026", title: "Inventario preliminar", detail: "Se identificaron dos inmuebles y una cuenta bancaria.", status: "En curso" },
      { date: "20/06/2026", title: "Cierre de soportes", detail: "Faltan certificados de libertad.", status: "Pendiente" },
      { date: "24/06/2026", title: "Inventarios y avaluos", detail: "Presentacion de activos y pasivos.", status: "Pendiente" }
    ],
    evidence: [{ id: "ev-4", title: "Certificados de libertad", detail: "Pendientes dos certificados actualizados.", date: "03/06/2026", kind: "Prueba" }],
    attachments: [{ id: "an-4", title: "Poder especial", detail: "Anexo firmado por la cliente.", date: "22/05/2026", kind: "Anexo" }],
    deadlines: [{ id: "vd-4", title: "Cerrar soportes patrimoniales", date: "20/06/2026", time: "15:00", type: "Aporte documental", origin: "Audiencia", priority: "Media", owner: "Dra. Laura Gomez", consequence: "Nuevo aplazamiento del tramite notarial.", status: "Pendiente", caseId: "p-2026-0021", sourceType: "Audiencia", sourceId: "h-4" }],
    notes: [{ id: "nt-4", text: "Separar activos con soporte incompleto para no retrasar inventarios.", author: "Dra. Laura Gomez", date: "05/06/2026" }],
    fees: [{ id: "fh-4", concept: "Honorarios tramite sucesoral", amount: 5400000, status: "Programado", dueDate: "24/06/2026" }]
  }
];

export const documents: LegalDocument[] = [
  {
    id: "d-1",
    title: "Demanda_Alvarez_v3.pdf",
    type: "Demanda",
    category: "Documento",
    caseId: "c-2026-0456",
    hearingId: "h-1",
    status: "Analizado",
    date: "08/06/2026",
    summary: "Demanda de responsabilidad civil con pretensiones indemnizatorias, anexos medicos y dictamen pericial como soporte central.",
    importantDates: [{ id: "dd-1", label: "Audiencia inicial", date: "12/06/2026", detail: "Fecha citada en auto admisorio y agenda del expediente.", convertedToDeadline: false }],
    findings: [{ id: "df-1", title: "Cuantia y dictamen deben cruzarse", detail: "La cuantia reclamada depende de la consistencia del dictamen pericial.", priority: "Alta", convertedToTask: false }]
  },
  {
    id: "d-2",
    title: "Liquidacion_Alimentos_Lopez.xlsx",
    type: "Prueba",
    category: "Prueba",
    caseId: "f-2026-1122",
    hearingId: "h-2",
    status: "En revision",
    date: "07/06/2026",
    summary: "Matriz financiera con ingresos, gastos del menor y propuesta de reajuste para conciliacion.",
    importantDates: [{ id: "dd-2", label: "Radicar liquidacion", date: "11/06/2026", detail: "Debe enviarse antes de la conciliacion.", convertedToDeadline: true }],
    findings: [{ id: "df-2", title: "Faltan soportes recientes", detail: "Los certificados de estudio y salud no estan completos.", priority: "Alta", convertedToTask: false }]
  },
  {
    id: "d-3",
    title: "Contrato_Prestacion_Servicios.pdf",
    type: "Contrato",
    category: "Prueba",
    caseId: "l-2026-0009",
    hearingId: "h-3",
    status: "Analizado",
    date: "06/06/2026",
    summary: "Contrato base para demostrar autonomia del contratista, entregables pactados y ausencia de subordinacion.",
    importantDates: [{ id: "dd-3", label: "Audiencia de pruebas", date: "19/06/2026", detail: "Documento debe estar depurado antes de la practica testimonial.", convertedToDeadline: false }],
    findings: [{ id: "df-3", title: "Clausulas utiles para teoria del caso", detail: "Las clausulas de entregables y autonomia deben citarse en audiencia.", priority: "Media", convertedToTask: false }]
  },
  {
    id: "d-4",
    title: "Poder_Sucesion_Gonzalez.pdf",
    type: "Poder",
    category: "Anexo",
    caseId: "p-2026-0021",
    status: "Firmado",
    date: "05/06/2026",
    summary: "Poder especial firmado para adelantar tramite sucesoral ante notaria.",
    importantDates: [{ id: "dd-4", label: "Inventarios y avaluos", date: "24/06/2026", detail: "Debe obrar en expediente notarial antes de audiencia.", convertedToDeadline: false }],
    findings: [{ id: "df-4", title: "Poder listo para radicacion", detail: "El documento puede anexarse al paquete notarial.", priority: "Baja", convertedToTask: false }]
  }
];

export const hearings: Hearing[] = [
  {
    id: "h-1",
    date: "2026-06-12",
    time: "09:00",
    court: "Juzgado 12 Civil Municipal",
    type: "Audiencia inicial",
    caseId: "c-2026-0456",
    modality: "Virtual",
    link: "https://audiencias.ramajudicial.gov.co/alvarez",
    room: "Sala virtual 12",
    objective: "Fijar litigio, intentar conciliacion y solicitar decreto probatorio.",
    status: "Confirmada",
    responsibleLawyer: "Dr. Juan Martinez",
    assistantOwner: "Camila Torres",
    checklist: [
      { id: "hc-1", title: "Cerrar teoria del caso", completed: false },
      { id: "hc-2", title: "Validar dictamen pericial", completed: false },
      { id: "hc-3", title: "Preparar preguntas a testigos", completed: true }
    ],
    documentIds: ["d-1"],
    evidenceTitles: ["Dictamen pericial de danos", "Registro fotografico del accidente"],
    witnessQuestions: ["Explique las circunstancias del accidente.", "Que soporte tiene la cuantificacion de perjuicios?"],
    caseTheory: "La aseguradora debe responder porque el dano esta soportado por dictamen y nexo causal verificable.",
    preparationTasks: ["Preparar interrogatorio de audiencia inicial"],
    result: "",
    derivedDeadlines: []
  },
  {
    id: "h-2",
    date: "2026-06-14",
    time: "10:30",
    court: "Centro de Conciliacion",
    type: "Audiencia de conciliacion",
    caseId: "f-2026-1122",
    modality: "Presencial",
    link: "",
    room: "Sala 3",
    objective: "Negociar reajuste de cuota alimentaria con soportes actualizados.",
    status: "Programada",
    responsibleLawyer: "Dra. Laura Gomez",
    assistantOwner: "Camila Torres",
    checklist: [
      { id: "hc-4", title: "Actualizar liquidacion", completed: false },
      { id: "hc-5", title: "Definir rango de negociacion", completed: false }
    ],
    documentIds: ["d-2"],
    evidenceTitles: ["Soportes de ingresos", "Certificados escolares"],
    witnessQuestions: ["Cuales son los gastos permanentes del menor?"],
    caseTheory: "El reajuste procede por variacion de necesidades del menor y capacidad economica actualizada.",
    preparationTasks: ["Radicar liquidacion actualizada de alimentos"],
    result: "",
    derivedDeadlines: []
  },
  {
    id: "h-3",
    date: "2026-06-19",
    time: "14:30",
    court: "Tribunal Superior de Cali",
    type: "Audiencia de pruebas",
    caseId: "l-2026-0009",
    modality: "Virtual",
    link: "https://audiencias.ramajudicial.gov.co/constructora",
    room: "Sala laboral 2",
    objective: "Practicar prueba documental y testimonial sobre autonomia contractual.",
    status: "Programada",
    responsibleLawyer: "Dr. Juan Martinez",
    assistantOwner: "Camila Torres",
    checklist: [
      { id: "hc-6", title: "Depurar anexos contractuales", completed: true },
      { id: "hc-7", title: "Preparar testigo tecnico", completed: false }
    ],
    documentIds: ["d-3"],
    evidenceTitles: ["Contrato de prestacion de servicios", "Actas de entrega"],
    witnessQuestions: ["Como se definian los entregables?", "Existia horario impuesto por la empresa?"],
    caseTheory: "La relacion fue civil/comercial porque existian entregables autonomos y ausencia de subordinacion.",
    preparationTasks: ["Organizar matriz de pruebas contractuales"],
    result: "",
    derivedDeadlines: []
  },
  {
    id: "h-4",
    date: "2026-06-24",
    time: "08:30",
    court: "Notaria 18",
    type: "Inventarios y avaluos",
    caseId: "p-2026-0021",
    modality: "Presencial",
    link: "",
    room: "Sala notarial",
    objective: "Presentar activos, pasivos y soportes sucesorales.",
    status: "Aplazada",
    responsibleLawyer: "Dra. Laura Gomez",
    assistantOwner: "Camila Torres",
    checklist: [
      { id: "hc-8", title: "Solicitar certificados de libertad", completed: false },
      { id: "hc-9", title: "Separar activos sin soporte", completed: false }
    ],
    documentIds: ["d-4"],
    evidenceTitles: ["Certificados de libertad", "Avaluos actualizados"],
    witnessQuestions: [],
    caseTheory: "La sucesion debe avanzar con inventario claro y soportes completos de propiedad.",
    preparationTasks: ["Solicitar certificados de libertad"],
    result: "Aplazada por soportes patrimoniales incompletos.",
    derivedDeadlines: [{ id: "hd-1", title: "Aportar certificados de libertad", date: "20/06/2026", time: "15:00", type: "Aporte documental", origin: "Audiencia", priority: "Media", owner: "Dra. Laura Gomez", consequence: "Nuevo aplazamiento del tramite notarial.", status: "Pendiente", caseId: "p-2026-0021", sourceType: "Audiencia", sourceId: "h-4" }]
  }
];

export const tasks: Task[] = [
  { id: "t-1", title: "Preparar interrogatorio de audiencia inicial", caseId: "c-2026-0456", type: "Preparacion de audiencia", status: "Pendiente", source: "Audiencia", sourceType: "Audiencia", sourceId: "h-1", priority: "Alta", dueDate: "10/06/2026", owner: "Dr. Juan Martinez", comments: ["Cruzar preguntas con dictamen pericial."], completed: false },
  { id: "t-2", title: "Radicar liquidacion actualizada de alimentos", caseId: "f-2026-1122", type: "Termino judicial", status: "En curso", source: "Documento", sourceType: "Documento", sourceId: "d-2", priority: "Alta", dueDate: "11/06/2026", owner: "Dra. Laura Gomez", comments: ["Faltan soportes escolares."], completed: false },
  { id: "t-3", title: "Organizar matriz de pruebas contractuales", caseId: "l-2026-0009", type: "Preparacion de audiencia", status: "Pendiente", source: "Expediente", sourceType: "Expediente", sourceId: "l-2026-0009", priority: "Media", dueDate: "17/06/2026", owner: "Dr. Juan Martinez", comments: [], completed: false },
  { id: "t-4", title: "Solicitar certificados de libertad", caseId: "p-2026-0021", type: "Tarea interna", status: "Completada", source: "Expediente", sourceType: "Expediente", sourceId: "p-2026-0021", priority: "Media", dueDate: "20/06/2026", owner: "Dra. Laura Gomez", comments: ["Solicitud enviada a cliente."], completed: true }
];

export const activities: Activity[] = [
  { id: "a-1", title: "Riesgo procesal actualizado", detail: "Alvarez vs. Aseguradora Andina quedo como prioridad alta del despacho", time: "Hoy, 10:30 AM" },
  { id: "a-2", title: "Documento analizado", detail: "Demanda_Alvarez_v3.pdf", time: "Hoy, 9:15 AM" },
  { id: "a-3", title: "Audiencia confirmada", detail: "Audiencia inicial del 12/06/2026", time: "Ayer, 6:20 PM" },
  { id: "a-4", title: "Honorarios registrados", detail: "Factura F-2026-0123", time: "Ayer, 3:45 PM" }
];

export const financialSummary = {
  collected: 28750000,
  pending: 45850000,
  atRisk: 12600000,
  overdueInvoices: 5,
  monthGrowth: 10
};

export const invoices = [
  { id: "F-2026-0123", client: "Maria Fernanda Alvarez", caseId: "c-2026-0456", amount: 8200000, status: "Por cobrar", dueDate: "12/06/2026", risk: "Alto" },
  { id: "F-2026-0118", client: "Empresa Constructora S.A.S.", caseId: "l-2026-0009", amount: 15400000, status: "Vencida", dueDate: "05/06/2026", risk: "Alto" },
  { id: "F-2026-0112", client: "Carlos Eduardo Lopez", caseId: "f-2026-1122", amount: 3600000, status: "Por cobrar", dueDate: "14/06/2026", risk: "Medio" },
  { id: "F-2026-0104", client: "Ana Maria Gonzalez", caseId: "p-2026-0021", amount: 5400000, status: "Programada", dueDate: "24/06/2026", risk: "Medio" }
];
