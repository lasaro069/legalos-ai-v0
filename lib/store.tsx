"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { activities as seedActivities, cases as seedCases, clients as seedClients, documents as seedDocuments, firmProfile, hearings as seedHearings, tasks as seedTasks, teamMembers } from "@/lib/mock-data";
import { Activity, CaseDeadline, CaseFee, CaseNote, CaseParty, CaseProceeding, CaseRecord, CaseStatus, Client, DeadlineOrigin, DocumentAssociation, DocumentFinding, FirmProfile, Hearing, HearingChecklistItem, LegalCase, LegalDocument, SourceType, Task, TaskStatus, TeamMember } from "@/types";
import { shortId } from "@/lib/utils";

type CaseDraft = Omit<LegalCase, "id" | "riskScore" | "aiRecommendation" | "timeline" | "evidence" | "attachments" | "deadlines" | "notes" | "fees" | "parties" | "proceedings"> &
  Partial<Pick<LegalCase, "evidence" | "attachments" | "deadlines" | "notes" | "fees" | "parties" | "proceedings">>;
type ClientDraft = Omit<Client, "id" | "lastInteraction">;
type DocumentDraft = Pick<LegalDocument, "title" | "type" | "caseId"> & Partial<Omit<LegalDocument, "id" | "title" | "type" | "caseId">>;
type HearingDraft = Pick<Hearing, "date" | "time" | "court" | "type" | "caseId"> & Partial<Omit<Hearing, "id" | "date" | "time" | "court" | "type" | "caseId">>;
type TaskDraft = Pick<Task, "title" | "caseId" | "priority" | "dueDate" | "owner"> & Partial<Omit<Task, "id" | "title" | "caseId" | "priority" | "dueDate" | "owner" | "completed">>;
type DeadlineDraft = Pick<CaseDeadline, "title" | "date" | "owner"> & Partial<Omit<CaseDeadline, "id" | "status" | "title" | "date" | "owner">>;

type Store = {
  firm: FirmProfile;
  team: TeamMember[];
  cases: LegalCase[];
  clients: Client[];
  documents: LegalDocument[];
  hearings: Hearing[];
  tasks: Task[];
  activities: Activity[];
  deadlines: CaseDeadline[];
  addCase: (legalCase: CaseDraft) => LegalCase;
  updateCase: (id: string, updates: Partial<LegalCase>) => void;
  setCaseStatus: (id: string, status: CaseStatus) => void;
  addCaseDocument: (document: DocumentDraft) => LegalDocument;
  updateDocument: (id: string, updates: Partial<LegalDocument>) => void;
  getDocument: (id: string) => LegalDocument | undefined;
  convertDocumentDateToDeadline: (documentId: string, dateId: string) => void;
  convertDocumentFindingToTask: (documentId: string, findingId: string) => void;
  createProceedingFromDocument: (documentId: string, proceeding: Omit<CaseProceeding, "id" | "origin" | "sourceType" | "sourceId" | "documentId">) => CaseProceeding | undefined;
  addCaseRecord: (caseId: string, record: Omit<CaseRecord, "id">) => CaseRecord;
  addCaseParty: (caseId: string, party: Omit<CaseParty, "id">) => CaseParty;
  addCaseProceeding: (caseId: string, proceeding: Omit<CaseProceeding, "id">) => CaseProceeding;
  createDocumentFromProceeding: (caseId: string, proceedingId: string, document: Omit<DocumentDraft, "caseId" | "association" | "proceedingId" | "sourceType" | "sourceId">) => LegalDocument;
  createDeadlineFromProceeding: (caseId: string, proceedingId: string, deadline: DeadlineDraft) => CaseDeadline;
  createTaskFromProceeding: (caseId: string, proceedingId: string, task: Omit<TaskDraft, "caseId" | "source" | "sourceType" | "sourceId">) => Task;
  createHearingFromProceeding: (caseId: string, proceedingId: string, hearing: Omit<HearingDraft, "caseId" | "sourceType" | "sourceId">) => Hearing;
  createProceedingFromHearingResult: (hearingId: string) => CaseProceeding | undefined;
  addCaseDeadline: (caseId: string, deadline: DeadlineDraft) => CaseDeadline;
  completeDeadline: (id: string) => void;
  cancelDeadline: (id: string, reason: string) => void;
  updateDeadline: (id: string, updates: Partial<CaseDeadline>) => void;
  createTaskFromDeadline: (deadlineId: string) => Task | undefined;
  addCaseNote: (caseId: string, note: Omit<CaseNote, "id" | "date">) => CaseNote;
  addCaseFee: (caseId: string, fee: Omit<CaseFee, "id">) => CaseFee;
  addCaseHearing: (hearing: HearingDraft) => Hearing;
  updateHearing: (id: string, updates: Partial<Hearing>) => void;
  getHearing: (id: string) => Hearing | undefined;
  toggleHearingChecklist: (hearingId: string, itemId: string) => void;
  addHearingChecklistItem: (hearingId: string, title: string) => HearingChecklistItem;
  addHearingQuestion: (hearingId: string, question: string) => void;
  addHearingDerivedDeadline: (hearingId: string, deadline: DeadlineDraft) => CaseDeadline;
  addClient: (client: ClientDraft) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  convertProspectToClient: (id: string) => void;
  registerClientInteraction: (id: string, detail?: string) => void;
  addTask: (task: TaskDraft) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addTaskComment: (id: string, comment: string) => void;
  completeTask: (id: string) => void;
  getClient: (id: string) => Client | undefined;
  getCase: (id: string) => LegalCase | undefined;
  caseName: (id: string) => string;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState(seedCases);
  const [clients, setClients] = useState(seedClients);
  const [documents, setDocuments] = useState(seedDocuments);
  const [hearings, setHearings] = useState(seedHearings);
  const [tasks, setTasks] = useState(seedTasks);
  const [activities, setActivities] = useState(seedActivities);

  const value = useMemo<Store>(() => {
    const today = () => new Date().toLocaleDateString("es-CO");
    const allDeadlines = [
      ...cases.flatMap((legalCase) => legalCase.deadlines.map((deadline) => ({ ...deadline, caseId: deadline.caseId ?? legalCase.id }))),
      ...hearings.flatMap((hearing) => hearing.derivedDeadlines.map((deadline) => ({ ...deadline, caseId: deadline.caseId ?? hearing.caseId, sourceType: deadline.sourceType ?? ("Audiencia" as SourceType), sourceId: deadline.sourceId ?? hearing.id })))
    ].filter((deadline, index, list) => list.findIndex((item) => item.id === deadline.id) === index);
    const addActivity = (title: string, detail: string) => {
      setActivities((current) => [{ id: shortId("a"), title, detail, time: "Ahora" }, ...current]);
    };
    const sourceTypeFromOrigin = (origin?: DeadlineOrigin): SourceType => {
      if (origin === "Actuacion" || origin === "Audiencia" || origin === "Documento" || origin === "Sugerencia IA") return origin;
      return "Manual";
    };
    const sourceTypeFromAssociation = (association?: DocumentAssociation): SourceType => {
      if (association === "Actuacion" || association === "Cliente") return association;
      return "Expediente";
    };

    return {
      firm: firmProfile,
      team: teamMembers,
      cases,
      clients,
      documents,
      hearings,
      tasks,
      activities,
      deadlines: allDeadlines,
      addCase: (legalCase) => {
        const created = {
          ...legalCase,
          id: shortId("c-2026"),
          riskScore: legalCase.risk === "Alto" ? 82 : legalCase.risk === "Medio" ? 58 : 28,
          aiRecommendation: "Revisar terminos, documentos asociados y siguiente actuacion antes del proximo hito.",
          timeline: [
            { date: legalCase.createdAt, title: "Caso creado", detail: "Expediente registrado en LegalOS AI.", status: "Completado" as const },
            { date: legalCase.criticalDeadline, title: "Termino critico", detail: legalCase.currentAction, status: "Pendiente" as const }
          ],
          evidence: legalCase.evidence ?? [],
          attachments: legalCase.attachments ?? [],
          deadlines: legalCase.deadlines ?? [],
          notes: legalCase.notes ?? [],
          fees: legalCase.fees ?? [],
          assistantOwner: legalCase.assistantOwner || "Camila Torres",
          parties: legalCase.parties ?? [],
          proceedings: legalCase.proceedings ?? []
        };
        setCases((current) => [created, ...current]);
        addActivity("Nuevo expediente creado", created.name);
        return created;
      },
      updateCase: (id, updates) => {
        setCases((current) => current.map((legalCase) => (legalCase.id === id ? { ...legalCase, ...updates } : legalCase)));
        addActivity("Expediente actualizado", updates.name ?? id);
      },
      setCaseStatus: (id, status) => {
        setCases((current) => current.map((legalCase) => {
          if (legalCase.id !== id) return legalCase;
          return {
            ...legalCase,
            status,
            timeline: [
              ...legalCase.timeline,
              { date: today(), title: `Estado cambiado a ${status}`, detail: "Cambio registrado desde la pantalla operativa del expediente.", status: "Completado" as const }
            ]
          };
        }));
        addActivity("Estado de expediente actualizado", `${id} - ${status}`);
      },
      addCaseDocument: (document) => {
        const created: LegalDocument = {
          ...document,
          id: shortId("d"),
          date: document.date ?? today(),
          status: document.status ?? "Pendiente",
          category: document.category ?? (document.type === "Prueba" ? "Prueba" : document.type === "Anexo" ? "Anexo" : document.type === "Comunicacion" ? "Comunicacion" : "Documento"),
          association: document.association ?? "Expediente",
          sourceType: document.sourceType ?? (document.proceedingId ? "Actuacion" : document.hearingId ? "Audiencia" : sourceTypeFromAssociation(document.association)),
          summary: document.summary ?? "Documento registrado pendiente de analisis juridico.",
          importantDates: document.importantDates ?? [],
          findings: document.findings ?? []
        };
        setDocuments((current) => [created, ...current]);
        addActivity("Documento agregado al expediente", created.title);
        return created;
      },
      updateDocument: (id, updates) => {
        setDocuments((current) => current.map((document) => (document.id === id ? { ...document, ...updates } : document)));
        addActivity("Documento actualizado", updates.title ?? id);
      },
      getDocument: (id) => documents.find((document) => document.id === id),
      convertDocumentDateToDeadline: (documentId, dateId) => {
        const document = documents.find((item) => item.id === documentId);
        const date = document?.importantDates.find((item) => item.id === dateId);
        if (!document || !date) return;
        const owner = cases.find((legalCase) => legalCase.id === document.caseId)?.internalOwner ?? "Responsable del despacho";
        const created: CaseDeadline = {
          id: shortId("vd"),
          title: date.label,
          date: date.date,
          time: "17:00",
          type: "Fecha detectada en documento",
          origin: "Documento",
          priority: "Media",
          owner,
          consequence: date.detail || "Riesgo procesal derivado de fecha documental.",
          status: "Pendiente",
          caseId: document.caseId,
          sourceType: "Documento",
          sourceId: document.id
        };
        setCases((current) => current.map((legalCase) => (legalCase.id === document.caseId ? { ...legalCase, deadlines: [created, ...legalCase.deadlines] } : legalCase)));
        setDocuments((current) => current.map((item) => item.id === documentId ? { ...item, importantDates: item.importantDates.map((foundDate) => foundDate.id === dateId ? { ...foundDate, convertedToDeadline: true } : foundDate) } : item));
        addActivity("Fecha convertida en termino", `${document.title} - ${date.label}`);
      },
      convertDocumentFindingToTask: (documentId, findingId) => {
        const document = documents.find((item) => item.id === documentId);
        const finding = document?.findings.find((item) => item.id === findingId);
        if (!document || !finding) return;
        const owner = cases.find((legalCase) => legalCase.id === document.caseId)?.internalOwner ?? "Dr. Juan Martinez";
        const created: Task = {
          id: shortId("t"),
          title: finding.title,
          caseId: document.caseId,
          type: "Tarea interna",
          status: "Pendiente",
          source: "Documento",
          sourceType: "Documento",
          sourceId: document.id,
          priority: finding.priority,
          dueDate: today(),
          owner,
          comments: [finding.detail],
          completed: false
        };
        setTasks((current) => [created, ...current]);
        setDocuments((current) => current.map((item) => item.id === documentId ? { ...item, findings: item.findings.map((found) => found.id === findingId ? { ...found, convertedToTask: true } : found) } : item));
        addActivity("Hallazgo convertido en tarea", finding.title);
      },
      createProceedingFromDocument: (documentId, proceeding) => {
        const document = documents.find((item) => item.id === documentId);
        if (!document) return undefined;
        const owner = proceeding.owner || cases.find((legalCase) => legalCase.id === document.caseId)?.internalOwner || "Responsable del despacho";
        const created: CaseProceeding = {
          ...proceeding,
          id: shortId("act"),
          origin: "Documento",
          owner,
          documentId: document.id,
          sourceType: "Documento",
          sourceId: document.id
        };
        setCases((current) => current.map((legalCase) => {
          if (legalCase.id !== document.caseId) return legalCase;
          return {
            ...legalCase,
            proceedings: [created, ...(legalCase.proceedings ?? [])],
            timeline: [
              ...legalCase.timeline,
              { date: created.date, title: created.title, detail: created.description, status: "Pendiente" as const }
            ]
          };
        }));
        setDocuments((current) => current.map((item) => item.id === document.id ? { ...item, association: "Actuacion", proceedingId: created.id } : item));
        addActivity("Actuacion creada desde documento", created.title);
        return created;
      },
      addCaseRecord: (caseId, record) => {
        const created = { ...record, id: shortId(record.kind === "Prueba" ? "ev" : "an") };
        setCases((current) => current.map((legalCase) => {
          if (legalCase.id !== caseId) return legalCase;
          return record.kind === "Prueba"
            ? { ...legalCase, evidence: [created, ...legalCase.evidence] }
            : { ...legalCase, attachments: [created, ...legalCase.attachments] };
        }));
        addActivity(`${record.kind} agregada`, created.title);
        return created;
      },
      addCaseParty: (caseId, party) => {
        const created = { ...party, id: shortId("pt") };
        setCases((current) => current.map((legalCase) => (legalCase.id === caseId ? { ...legalCase, parties: [created, ...(legalCase.parties ?? [])] } : legalCase)));
        addActivity("Parte agregada al expediente", `${created.role}: ${created.name}`);
        return created;
      },
      addCaseProceeding: (caseId, proceeding) => {
        const owner = proceeding.owner || cases.find((legalCase) => legalCase.id === caseId)?.internalOwner || "Responsable del despacho";
        const created = { ...proceeding, owner, sourceType: proceeding.sourceType ?? sourceTypeFromOrigin(proceeding.origin), id: shortId("act") };
        setCases((current) => current.map((legalCase) => {
          if (legalCase.id !== caseId) return legalCase;
          return {
            ...legalCase,
            proceedings: [created, ...(legalCase.proceedings ?? [])],
            timeline: [
              ...legalCase.timeline,
              { date: created.date, title: created.title, detail: created.description, status: "Pendiente" as const }
            ]
          };
        }));
        addActivity("Actuacion agregada", created.title);
        return created;
      },
      createDocumentFromProceeding: (caseId, proceedingId, document) => {
        const created: LegalDocument = {
          ...document,
          id: shortId("d"),
          caseId,
          association: "Actuacion",
          proceedingId,
          sourceType: "Actuacion",
          sourceId: proceedingId,
          date: document.date ?? today(),
          status: document.status ?? "Pendiente",
          category: document.category ?? (document.type === "Prueba" ? "Prueba" : document.type === "Anexo" ? "Anexo" : document.type === "Comunicacion" ? "Comunicacion" : "Documento"),
          summary: document.summary ?? "Documento asociado a actuacion procesal.",
          importantDates: document.importantDates ?? [],
          findings: document.findings ?? []
        };
        setDocuments((current) => [created, ...current]);
        addActivity("Documento creado desde actuacion", created.title);
        return created;
      },
      createDeadlineFromProceeding: (caseId, proceedingId, deadline) => {
        const created: CaseDeadline = {
          ...deadline,
          id: shortId("vd"),
          time: deadline.time || "17:00",
          type: deadline.type || "Termino derivado de actuacion",
          origin: "Actuacion",
          priority: deadline.priority || "Media",
          consequence: deadline.consequence || "Riesgo procesal derivado de la actuacion.",
          sourceType: "Actuacion",
          sourceId: proceedingId,
          caseId,
          status: "Pendiente"
        };
        setCases((current) => current.map((legalCase) => (legalCase.id === caseId ? { ...legalCase, deadlines: [created, ...legalCase.deadlines] } : legalCase)));
        addActivity("Termino creado desde actuacion", created.title);
        return created;
      },
      createTaskFromProceeding: (caseId, proceedingId, task) => {
        const proceeding = cases.find((legalCase) => legalCase.id === caseId)?.proceedings?.find((item) => item.id === proceedingId);
        const created: Task = {
          ...task,
          id: shortId("t"),
          caseId,
          type: task.type ?? "Tarea interna",
          status: task.status ?? "Pendiente",
          source: "Actuacion",
          sourceType: "Actuacion",
          sourceId: proceedingId,
          comments: task.comments ?? (proceeding ? [`Nace de la actuacion: ${proceeding.title}`] : []),
          completed: task.status === "Completada"
        };
        setTasks((current) => [created, ...current]);
        addActivity("Tarea creada desde actuacion", created.title);
        return created;
      },
      createHearingFromProceeding: (caseId, proceedingId, hearing) => {
        const legalCase = cases.find((item) => item.id === caseId);
        const created: Hearing = {
          ...hearing,
          id: shortId("h"),
          caseId,
          sourceType: "Actuacion",
          sourceId: proceedingId,
          modality: hearing.modality ?? "Virtual",
          link: hearing.link ?? "",
          room: hearing.room ?? "",
          objective: hearing.objective ?? "Preparar audiencia derivada de actuacion procesal.",
          status: hearing.status ?? "Programada",
          responsibleLawyer: hearing.responsibleLawyer ?? legalCase?.internalOwner ?? "Dr. Juan Martinez",
          assistantOwner: hearing.assistantOwner ?? legalCase?.assistantOwner ?? "Camila Torres",
          checklist: hearing.checklist ?? [
            { id: shortId("hc"), title: "Revisar actuacion que origina la audiencia", completed: false },
            { id: shortId("hc"), title: "Preparar documentos y pruebas", completed: false }
          ],
          documentIds: hearing.documentIds ?? [],
          evidenceTitles: hearing.evidenceTitles ?? [],
          witnessQuestions: hearing.witnessQuestions ?? [],
          caseTheory: hearing.caseTheory ?? "",
          preparationTasks: hearing.preparationTasks ?? [],
          result: hearing.result ?? "",
          derivedDeadlines: hearing.derivedDeadlines ?? []
        };
        setHearings((current) => [created, ...current]);
        addActivity("Audiencia creada desde actuacion", created.type);
        return created;
      },
      createProceedingFromHearingResult: (hearingId) => {
        const hearing = hearings.find((item) => item.id === hearingId);
        if (!hearing || !hearing.result.trim()) return undefined;
        const existing = cases
          .find((legalCase) => legalCase.id === hearing.caseId)
          ?.proceedings?.find((proceeding) => proceeding.sourceType === "Audiencia" && proceeding.sourceId === hearing.id);
        if (existing) return existing;
        const created: CaseProceeding = {
          id: shortId("act"),
          type: "Audiencia",
          title: `Resultado de ${hearing.type}`,
          date: today(),
          description: hearing.result,
          origin: "Audiencia",
          owner: hearing.responsibleLawyer || cases.find((legalCase) => legalCase.id === hearing.caseId)?.internalOwner || "Responsable del despacho",
          sourceType: "Audiencia",
          sourceId: hearing.id,
          createsTerm: true
        };
        setCases((current) => current.map((legalCase) => {
          if (legalCase.id !== hearing.caseId) return legalCase;
          return {
            ...legalCase,
            proceedings: [created, ...(legalCase.proceedings ?? [])],
            timeline: [
              ...legalCase.timeline,
              { date: created.date, title: created.title, detail: created.description, status: "Completado" as const }
            ]
          };
        }));
        addActivity("Actuacion posterior creada", created.title);
        return created;
      },
      addCaseDeadline: (caseId, deadline) => {
        const created = {
          ...deadline,
          id: shortId("vd"),
          time: deadline.time || "17:00",
          type: deadline.type || "Termino judicial",
          origin: deadline.origin || "Manual",
          priority: deadline.priority || "Media",
          consequence: deadline.consequence || "Riesgo procesal por incumplimiento del termino.",
          sourceType: deadline.sourceType ?? sourceTypeFromOrigin(deadline.origin),
          caseId,
          status: "Pendiente" as const
        };
        setCases((current) => current.map((legalCase) => (legalCase.id === caseId ? { ...legalCase, deadlines: [created, ...legalCase.deadlines] } : legalCase)));
        addActivity("Termino agregado", created.title);
        return created;
      },
      completeDeadline: (id) => {
        setCases((current) => current.map((legalCase) => ({ ...legalCase, deadlines: legalCase.deadlines.map((deadline) => deadline.id === id ? { ...deadline, status: "Cumplido" } : deadline) })));
        setHearings((current) => current.map((hearing) => ({ ...hearing, derivedDeadlines: hearing.derivedDeadlines.map((deadline) => deadline.id === id ? { ...deadline, status: "Cumplido" } : deadline) })));
        addActivity("Termino marcado como cumplido", id);
      },
      cancelDeadline: (id, reason) => {
        const applyCancel = (deadline: CaseDeadline) => deadline.id === id ? { ...deadline, status: "Cancelado" as const, cancellationReason: reason } : deadline;
        setCases((current) => current.map((legalCase) => ({ ...legalCase, deadlines: legalCase.deadlines.map(applyCancel) })));
        setHearings((current) => current.map((hearing) => ({ ...hearing, derivedDeadlines: hearing.derivedDeadlines.map(applyCancel) })));
        addActivity("Termino cancelado", reason);
      },
      updateDeadline: (id, updates) => {
        const applyUpdate = (deadline: CaseDeadline) => deadline.id === id ? { ...deadline, ...updates } : deadline;
        setCases((current) => current.map((legalCase) => ({ ...legalCase, deadlines: legalCase.deadlines.map(applyUpdate) })));
        setHearings((current) => current.map((hearing) => ({ ...hearing, derivedDeadlines: hearing.derivedDeadlines.map(applyUpdate) })));
        addActivity("Termino editado", updates.title ?? id);
      },
      createTaskFromDeadline: (deadlineId) => {
        const deadline = allDeadlines.find((item) => item.id === deadlineId);
        if (!deadline || !deadline.caseId) return undefined;
        const created = {
          id: shortId("t"),
          title: deadline.title,
          caseId: deadline.caseId,
          type: "Termino judicial" as const,
          status: "Pendiente" as const,
          source: "Termino" as const,
          sourceType: "Termino" as const,
          sourceId: deadline.id,
          priority: deadline.priority,
          dueDate: deadline.date,
          owner: deadline.owner,
          comments: [`Consecuencia si se incumple el termino: ${deadline.consequence}`],
          completed: false
        };
        setTasks((current) => [created, ...current]);
        addActivity("Tarea creada desde termino", created.title);
        return created;
      },
      addCaseNote: (caseId, note) => {
        const created = { ...note, id: shortId("nt"), date: today() };
        setCases((current) => current.map((legalCase) => (legalCase.id === caseId ? { ...legalCase, notes: [created, ...legalCase.notes] } : legalCase)));
        addActivity("Nota interna agregada", note.text.slice(0, 70));
        return created;
      },
      addCaseFee: (caseId, fee) => {
        const created = { ...fee, id: shortId("fh") };
        setCases((current) => current.map((legalCase) => (legalCase.id === caseId ? { ...legalCase, fees: [created, ...legalCase.fees] } : legalCase)));
        addActivity("Honorario agregado", created.concept);
        return created;
      },
      addCaseHearing: (hearing) => {
        const legalCase = cases.find((item) => item.id === hearing.caseId);
        const created: Hearing = {
          ...hearing,
          id: shortId("h"),
          modality: hearing.modality ?? "Virtual",
          link: hearing.link ?? "",
          room: hearing.room ?? "",
          objective: hearing.objective ?? "Preparar y realizar audiencia asociada al expediente.",
          status: hearing.status ?? "Programada",
          sourceType: hearing.sourceType ?? (hearing.sourceId ? "Actuacion" : "Manual"),
          responsibleLawyer: hearing.responsibleLawyer ?? legalCase?.internalOwner ?? "Dr. Juan Martinez",
          assistantOwner: hearing.assistantOwner ?? legalCase?.assistantOwner ?? "Camila Torres",
          checklist: hearing.checklist ?? [
            { id: shortId("hc"), title: "Revisar documentos necesarios", completed: false },
            { id: shortId("hc"), title: "Preparar teoria del caso", completed: false }
          ],
          documentIds: hearing.documentIds ?? [],
          evidenceTitles: hearing.evidenceTitles ?? [],
          witnessQuestions: hearing.witnessQuestions ?? [],
          caseTheory: hearing.caseTheory ?? "",
          preparationTasks: hearing.preparationTasks ?? [],
          result: hearing.result ?? "",
          derivedDeadlines: hearing.derivedDeadlines ?? []
        };
        setHearings((current) => [created, ...current]);
        addActivity("Audiencia agregada", created.type);
        return created;
      },
      updateHearing: (id, updates) => {
        setHearings((current) => current.map((hearing) => (hearing.id === id ? { ...hearing, ...updates } : hearing)));
        addActivity("Audiencia actualizada", updates.type ?? id);
      },
      getHearing: (id) => hearings.find((hearing) => hearing.id === id),
      toggleHearingChecklist: (hearingId, itemId) => {
        setHearings((current) => current.map((hearing) => hearing.id === hearingId ? { ...hearing, checklist: hearing.checklist.map((item) => item.id === itemId ? { ...item, completed: !item.completed } : item) } : hearing));
      },
      addHearingChecklistItem: (hearingId, title) => {
        const created = { id: shortId("hc"), title, completed: false };
        setHearings((current) => current.map((hearing) => hearing.id === hearingId ? { ...hearing, checklist: [...hearing.checklist, created] } : hearing));
        addActivity("Item de preparacion agregado", title);
        return created;
      },
      addHearingQuestion: (hearingId, question) => {
        setHearings((current) => current.map((hearing) => hearing.id === hearingId ? { ...hearing, witnessQuestions: [...hearing.witnessQuestions, question] } : hearing));
        addActivity("Pregunta de audiencia agregada", question);
      },
      addHearingDerivedDeadline: (hearingId, deadline) => {
        const created = {
          ...deadline,
          id: shortId("hd"),
          time: deadline.time || "17:00",
          type: deadline.type || "Termino derivado",
          origin: deadline.origin || "Audiencia",
          priority: deadline.priority || "Media",
          consequence: deadline.consequence || "Riesgo procesal derivado de la audiencia.",
          sourceType: deadline.sourceType ?? "Audiencia",
          sourceId: deadline.sourceId ?? hearingId,
          status: "Pendiente" as const
        };
        setHearings((current) => current.map((hearing) => hearing.id === hearingId ? { ...hearing, derivedDeadlines: [created, ...hearing.derivedDeadlines] } : hearing));
        const hearing = hearings.find((item) => item.id === hearingId);
        if (hearing) setCases((current) => current.map((legalCase) => legalCase.id === hearing.caseId ? { ...legalCase, deadlines: [created, ...legalCase.deadlines] } : legalCase));
        addActivity("Termino derivado de audiencia", created.title);
        return created;
      },
      addClient: (client) => {
        const created = { ...client, id: shortId("cl"), lastInteraction: "Ahora" };
        setClients((current) => [created, ...current]);
        addActivity("Cliente agregado", created.name);
        return created;
      },
      updateClient: (id, updates) => {
        setClients((current) => current.map((client) => (client.id === id ? { ...client, ...updates } : client)));
        addActivity("Cliente actualizado", updates.name ?? id);
      },
      convertProspectToClient: (id) => {
        setClients((current) => current.map((client) => (client.id === id ? { ...client, status: "Activo", lastInteraction: "Convertido ahora" } : client)));
        addActivity("Prospecto convertido en cliente", id);
      },
      registerClientInteraction: (id, detail = "Interaccion registrada desde la ficha del cliente") => {
        setClients((current) => current.map((client) => (client.id === id ? { ...client, lastInteraction: "Ahora" } : client)));
        addActivity("Interaccion con cliente", detail);
      },
      addTask: (task) => {
        const status = task.status ?? "Pendiente";
        const created = {
          ...task,
          id: shortId("t"),
          type: task.type ?? "Tarea interna",
          status,
          source: task.source ?? "Manual",
          sourceType: task.sourceType ?? task.source ?? "Manual",
          comments: task.comments ?? [],
          completed: status === "Completada" ? true : false
        };
        setTasks((current) => [created, ...current]);
        addActivity("Tarea creada", created.title);
        return created;
      },
      updateTask: (id, updates) => {
        setTasks((current) => current.map((task) => {
          if (task.id !== id) return task;
          const nextStatus = updates.status ?? task.status;
          return { ...task, ...updates, completed: nextStatus === "Completada" };
        }));
        addActivity("Tarea actualizada", updates.title ?? id);
      },
      addTaskComment: (id, comment) => {
        setTasks((current) => current.map((task) => (task.id === id ? { ...task, comments: [...task.comments, comment] } : task)));
        addActivity("Comentario agregado a tarea", comment.slice(0, 70));
      },
      completeTask: (id) => setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed, status: task.completed ? "Pendiente" : "Completada" as TaskStatus } : task))),
      getClient: (id) => clients.find((client) => client.id === id),
      getCase: (id) => cases.find((legalCase) => legalCase.id === id),
      caseName: (id) => cases.find((legalCase) => legalCase.id === id)?.name ?? "Sin expediente asociado"
    };
  }, [activities, cases, clients, documents, hearings, tasks]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useLegalStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useLegalStore must be used within StoreProvider");
  return context;
}
