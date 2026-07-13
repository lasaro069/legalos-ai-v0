export type Risk = "Bajo" | "Medio" | "Alto";
export type CaseStatus = "En proceso" | "Investigacion" | "Conciliacion" | "Terminado" | "Archivado" | "Cerrado";
export type Priority = "Baja" | "Media" | "Alta";
export type ClientStatus = "Prospecto" | "Activo" | "Inactivo";
export type PersonType = "Natural" | "Juridica";
export type TeamRole = "Propietario" | "Abogado" | "Auxiliar Juridico";
export const legalAreas = ["Civil", "Penal", "Familia", "Laboral", "Comercial", "Administrativo", "Constitucional", "Transito", "Otro"] as const;
export type LegalArea = (typeof legalAreas)[number];
export type CaseRecordKind = "Prueba" | "Anexo";
export type PartyRole = "Cliente principal" | "Demandante" | "Demandado" | "Contraparte" | "Tercero" | "Apoderado" | "Autoridad" | "Otro";
export type ProceedingType = "Demanda" | "Contestacion" | "Auto" | "Sentencia" | "Recurso" | "Notificacion" | "Audiencia" | "Memorial" | "Otra";
export type DocumentType = "Demanda" | "Contestacion" | "Poder" | "Memorial" | "Auto" | "Sentencia" | "Contrato" | "Prueba" | "Anexo" | "Comunicacion" | "Otro";
export type DocumentStatus = "Analizado" | "Pendiente" | "En revision" | "Firmado" | "Radicado";
export type DocumentCategory = "Documento" | "Prueba" | "Anexo" | "Comunicacion";
export type DocumentAssociation = "Expediente" | "Cliente" | "Actuacion";
export type HearingModality = "Presencial" | "Virtual";
export type DeadlineStatus = "Pendiente" | "Cumplido" | "Vencido" | "Cancelado";
export type DeadlineOrigin = "Actuacion" | "Audiencia" | "Documento" | "Manual" | "Sugerencia IA";
export type TaskStatus = "Pendiente" | "En curso" | "Bloqueada" | "Completada";
export type TaskType = "Tarea interna" | "Termino judicial" | "Seguimiento al cliente" | "Cobro" | "Preparacion de audiencia";
export type WorkSource = "Expediente" | "Actuacion" | "Audiencia" | "Documento" | "Cliente" | "Termino" | "Manual";
export type SourceType = WorkSource | "Sugerencia IA";

export type CaseRecord = {
  id: string;
  title: string;
  detail: string;
  date: string;
  kind: CaseRecordKind;
};

export type CaseParty = {
  id: string;
  name: string;
  role: PartyRole;
  detail: string;
  isClient?: boolean;
  isOpposing?: boolean;
};

export type CaseProceeding = {
  id: string;
  type: ProceedingType;
  title: string;
  date: string;
  description: string;
  origin: DeadlineOrigin;
  owner?: string;
  documentId?: string;
  sourceType?: SourceType;
  sourceId?: string;
  createsTerm?: boolean;
};

export type CaseDeadline = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  origin: DeadlineOrigin;
  priority: Priority;
  owner: string;
  consequence: string;
  status: DeadlineStatus;
  cancellationReason?: string;
  caseId?: string;
  sourceType?: SourceType;
  sourceId?: string;
};

export type CaseNote = {
  id: string;
  text: string;
  author: string;
  date: string;
};

export type CaseFee = {
  id: string;
  concept: string;
  amount: number;
  status: "Programado" | "Por cobrar" | "Vencido" | "Pagado";
  dueDate: string;
};

export type LegalCase = {
  id: string;
  name: string;
  filingNumber: string;
  clientId: string;
  city: string;
  legalArea: LegalArea;
  processType: string;
  proceduralStage: string;
  status: CaseStatus;
  createdAt: string;
  nextHearing: string;
  criticalDeadline: string;
  court: string;
  counterparty: string;
  opposingCounsel: string;
  amount: number;
  internalOwner: string;
  assistantOwner?: string;
  risk: Risk;
  riskScore: number;
  description: string;
  currentAction: string;
  aiRecommendation: string;
  parties?: CaseParty[];
  proceedings?: CaseProceeding[];
  timeline: TimelineEvent[];
  evidence: CaseRecord[];
  attachments: CaseRecord[];
  deadlines: CaseDeadline[];
  notes: CaseNote[];
  fees: CaseFee[];
};

export type Client = {
  id: string;
  name: string;
  personType: PersonType;
  documentType: string;
  document: string;
  representative: string;
  phone: string;
  alternatePhone: string;
  email: string;
  preferredChannel: string;
  city: string;
  address: string;
  notes: string;
  status: ClientStatus;
  origin: string;
  lastInteraction: string;
  conflictAlert: boolean;
  conflictDetail: string;
  responsibleLawyer?: string;
};

export type DocumentDate = {
  id: string;
  label: string;
  date: string;
  detail: string;
  convertedToDeadline: boolean;
};

export type DocumentFinding = {
  id: string;
  title: string;
  detail: string;
  priority: Priority;
  convertedToTask: boolean;
};

export type LegalDocument = {
  id: string;
  title: string;
  type: DocumentType;
  category: DocumentCategory;
  association?: DocumentAssociation;
  caseId: string;
  clientId?: string;
  proceedingId?: string;
  sourceType?: SourceType;
  sourceId?: string;
  hearingId?: string;
  status: DocumentStatus;
  date: string;
  summary: string;
  importantDates: DocumentDate[];
  findings: DocumentFinding[];
};

export type HearingChecklistItem = {
  id: string;
  title: string;
  completed: boolean;
};

export type Hearing = {
  id: string;
  date: string;
  time: string;
  court: string;
  type: string;
  caseId: string;
  modality: HearingModality;
  link: string;
  room: string;
  objective: string;
  status: "Programada" | "Confirmada" | "Realizada" | "Aplazada";
  responsibleLawyer?: string;
  assistantOwner?: string;
  sourceType?: SourceType;
  sourceId?: string;
  checklist: HearingChecklistItem[];
  documentIds: string[];
  evidenceTitles: string[];
  witnessQuestions: string[];
  caseTheory: string;
  preparationTasks: string[];
  result: string;
  derivedDeadlines: CaseDeadline[];
};

export type Task = {
  id: string;
  title: string;
  caseId: string;
  type: TaskType;
  status: TaskStatus;
  source: WorkSource;
  sourceType?: SourceType;
  sourceId?: string;
  priority: Priority;
  dueDate: string;
  owner: string;
  comments: string[];
  completed: boolean;
};

export type Activity = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: TeamRole;
  email: string;
  city: string;
  active: boolean;
};

export type FirmProfile = {
  id: string;
  name: string;
  logo: string;
  city: string;
  plan: string;
  lawyers: number;
  assistants: number;
  description: string;
};

export type TimelineEvent = {
  date: string;
  title: string;
  detail: string;
  status: "Completado" | "En curso" | "Pendiente";
};
