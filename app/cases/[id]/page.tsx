"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { Archive, CalendarDays, CheckCircle2, CircleDollarSign, Edit3, FileText, Gavel, NotebookPen, RotateCcw, Save, Scale, ShieldAlert, SquareCheckBig, Users, XCircle } from "lucide-react";
import { AIResponsePanel } from "@/components/ai-response";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, EmptyState, Field, inputClass } from "@/components/ui";
import { resolveSource } from "@/lib/source-resolver";
import { useLegalStore } from "@/lib/store";
import { money } from "@/lib/utils";
import { CaseProceeding, CaseStatus, DeadlineOrigin, DocumentCategory, DocumentStatus, DocumentType, LegalArea, PartyRole, ProceedingType, Risk, legalAreas } from "@/types";

const riskTone = { Bajo: "green", Medio: "amber", Alto: "red" } as const;
type Section = "resumen" | "partes" | "actuaciones" | "terminos" | "audiencias" | "documentos" | "tareas" | "notas" | "financiero" | "equipo";
type Operation = "party" | "proceeding" | "document" | "documentFromProceeding" | "hearing" | "hearingFromProceeding" | "task" | "taskFromProceeding" | "deadline" | "deadlineFromProceeding" | "note" | "fee" | null;

const sections: { id: Section; label: string; icon: ReactNode }[] = [
  { id: "resumen", label: "Resumen", icon: <Scale /> },
  { id: "partes", label: "Partes", icon: <Users /> },
  { id: "actuaciones", label: "Actuaciones", icon: <Gavel /> },
  { id: "terminos", label: "Control de Terminos", icon: <CalendarDays /> },
  { id: "audiencias", label: "Audiencias", icon: <Gavel /> },
  { id: "documentos", label: "Documentos", icon: <FileText /> },
  { id: "tareas", label: "Tareas", icon: <SquareCheckBig /> },
  { id: "notas", label: "Notas", icon: <NotebookPen /> },
  { id: "financiero", label: "Financiero", icon: <CircleDollarSign /> },
  { id: "equipo", label: "Equipo", icon: <Users /> }
];

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    getCase,
    getClient,
    cases,
    documents,
    hearings,
    tasks,
    updateCase,
    setCaseStatus,
    addCaseDocument,
    addCaseParty,
    addCaseProceeding,
    createDocumentFromProceeding,
    createDeadlineFromProceeding,
    createTaskFromProceeding,
    createHearingFromProceeding,
    addCaseDeadline,
    addCaseNote,
    addCaseFee,
    addCaseHearing,
    addTask
  } = useLegalStore();
  const legalCase = getCase(id);
  const [editing, setEditing] = useState(false);
  const [operation, setOperation] = useState<Operation>(null);
  const [operationSource, setOperationSource] = useState<CaseProceeding | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("resumen");
  const [saved, setSaved] = useState("");

  function openOperation(nextOperation: Exclude<Operation, null>, source?: CaseProceeding) {
    setOperation(nextOperation);
    setOperationSource(source ?? null);
    if (source) setActiveSection("actuaciones");
  }

  function closeOperation() {
    setOperation(null);
    setOperationSource(null);
  }

  if (!legalCase) return <AppShell><Header title="Expediente no encontrado" subtitle="El expediente solicitado no existe en esta experiencia." /><div className="p-8"><EmptyState title="Sin resultado" description="Vuelve al listado de expedientes para abrir un registro disponible." /></div></AppShell>;

  const client = getClient(legalCase.clientId);
  const caseDocs = documents.filter((doc) => doc.caseId === legalCase.id);
  const caseHearings = hearings.filter((hearing) => hearing.caseId === legalCase.id);
  const caseTasks = tasks.filter((task) => task.caseId === legalCase.id);
  const totalFees = legalCase.fees.reduce((sum, fee) => sum + fee.amount, 0);
  const pendingFees = legalCase.fees.filter((fee) => fee.status !== "Pagado").reduce((sum, fee) => sum + fee.amount, 0);
  const pendingTerms = legalCase.deadlines.filter((term) => term.status === "Pendiente");
  const nextTerm = [...pendingTerms].sort((a, b) => a.date.localeCompare(b.date))[0];
  const nextHearing = [...caseHearings].sort((a, b) => a.date.localeCompare(b.date))[0];
  const isInactive = legalCase.status === "Archivado" || legalCase.status === "Cerrado" || legalCase.status === "Terminado";
  const derivedParties = [
    { role: "Cliente principal", name: client?.name ?? "Sin cliente", detail: client ? `${client.documentType} ${client.document}` : "Pendiente" },
    { role: "Contraparte", name: legalCase.counterparty || "Sin contraparte registrada", detail: legalCase.opposingCounsel ? `Apoderado: ${legalCase.opposingCounsel}` : "Apoderado pendiente" },
    { role: "Autoridad", name: legalCase.court, detail: `${legalCase.city} - ${legalCase.processType}` }
  ];
  const parties = legalCase.parties?.length ? legalCase.parties.map((party) => ({ role: party.role, name: party.name, detail: party.detail })) : derivedParties;
  const proceedings: CaseProceeding[] = legalCase.proceedings?.length
    ? legalCase.proceedings
    : legalCase.timeline.map((event) => ({ id: `${legalCase.id}-${event.date}-${event.title}`, type: "Otra", title: event.title, date: event.date, description: event.detail, origin: "Manual" }));
  const sourceContext = { cases, documents, hearings, deadlines: legalCase.deadlines };
  const resolveCaseSource = (item: Parameters<typeof resolveSource>[0]) => resolveSource(item, sourceContext);
  const tracedItems = [
    ...legalCase.deadlines.map((term) => ({ kind: "Termino", title: term.title, source: resolveCaseSource(term).label, detail: `${term.date} - ${term.owner}` })),
    ...caseDocs.map((doc) => ({ kind: "Documento", title: doc.title, source: resolveCaseSource(doc).label, detail: `${doc.type} - ${doc.status}` })),
    ...caseHearings.map((hearing) => ({ kind: "Audiencia", title: hearing.type, source: resolveCaseSource(hearing).label, detail: `${hearing.date} - ${hearing.responsibleLawyer ?? legalCase.internalOwner}` })),
    ...caseTasks.map((task) => ({ kind: "Tarea", title: task.title, source: resolveCaseSource(task).label, detail: `${task.dueDate} - ${task.owner}` }))
  ].slice(0, 10);

  function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateCase(legalCase!.id, {
      name: String(form.get("name")),
      filingNumber: String(form.get("filingNumber")),
      city: String(form.get("city")),
      legalArea: String(form.get("legalArea")) as LegalArea,
      court: String(form.get("court")),
      processType: String(form.get("processType")),
      proceduralStage: String(form.get("proceduralStage")),
      status: String(form.get("status")) as CaseStatus,
      counterparty: String(form.get("counterparty")),
      opposingCounsel: String(form.get("opposingCounsel")),
      amount: Number(form.get("amount") || 0),
      internalOwner: String(form.get("internalOwner")),
      assistantOwner: String(form.get("assistantOwner") || "") || undefined,
      criticalDeadline: String(form.get("criticalDeadline")),
      nextHearing: String(form.get("nextHearing")),
      currentAction: String(form.get("currentAction")),
      risk: String(form.get("risk")) as Risk,
      description: String(form.get("description"))
    });
    setSaved("Expediente actualizado");
    setEditing(false);
  }

  function submitOperation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    const uploadedFile = file instanceof File && file.name ? file : null;
    if (operation === "party") {
      addCaseParty(legalCase!.id, {
        name: String(form.get("name")),
        role: String(form.get("role")) as PartyRole,
        detail: String(form.get("detail")),
        isClient: form.get("isClient") === "on",
        isOpposing: form.get("isOpposing") === "on"
      });
    }
    if (operation === "proceeding") {
      addCaseProceeding(legalCase!.id, {
        type: String(form.get("type")) as ProceedingType,
        title: String(form.get("title")),
        date: String(form.get("date")),
        description: String(form.get("description")),
      origin: String(form.get("origin")) as DeadlineOrigin,
      owner: String(form.get("owner")),
      sourceType: "Manual",
      createsTerm: form.get("createsTerm") === "on"
      });
    }
    if (operation === "documentFromProceeding" && operationSource) createDocumentFromProceeding(legalCase!.id, operationSource.id, {
      title: String(form.get("title") || uploadedFile?.name || "Documento asociado a actuacion"),
      type: String(form.get("type")) as DocumentType,
      category: String(form.get("category")) as DocumentCategory,
      status: String(form.get("status")) as DocumentStatus,
      hearingId: String(form.get("hearingId") || "") || undefined,
      summary: String(form.get("summary") || (uploadedFile ? `Archivo asociado a actuacion. Tamano: ${formatBytes(uploadedFile.size)}. Pendiente de revision juridica.` : "")),
      importantDates: String(form.get("detectedDate"))
        ? [{ id: `dd-${Date.now()}`, label: "Fecha detectada", date: String(form.get("detectedDate")), detail: String(form.get("dateDetail")), convertedToDeadline: false }]
        : [],
      findings: String(form.get("finding"))
        ? [{ id: `df-${Date.now()}`, title: String(form.get("finding")), detail: String(form.get("findingDetail")), priority: "Media", convertedToTask: false }]
        : []
    });
    if (operation === "document") addCaseDocument({
      title: String(form.get("title") || uploadedFile?.name || "Documento del expediente"),
      type: String(form.get("type")) as DocumentType,
      category: String(form.get("category")) as DocumentCategory,
      status: String(form.get("status")) as DocumentStatus,
      summary: String(form.get("summary") || (uploadedFile ? `Archivo cargado desde expediente. Tamano: ${formatBytes(uploadedFile.size)}. Pendiente de revision juridica.` : "")),
      association: "Expediente",
      hearingId: String(form.get("hearingId") || "") || undefined,
      sourceType: String(form.get("hearingId") || "") ? "Audiencia" : "Expediente",
      sourceId: String(form.get("hearingId") || "") || legalCase!.id,
      importantDates: String(form.get("detectedDate"))
        ? [{ id: `dd-${Date.now()}`, label: "Fecha detectada", date: String(form.get("detectedDate")), detail: String(form.get("dateDetail")), convertedToDeadline: false }]
        : [],
      findings: String(form.get("finding"))
        ? [{ id: `df-${Date.now()}`, title: String(form.get("finding")), detail: String(form.get("findingDetail")), priority: "Media", convertedToTask: false }]
        : [],
      caseId: legalCase!.id
    });
    if (operation === "hearingFromProceeding" && operationSource) createHearingFromProceeding(legalCase!.id, operationSource.id, {
      type: String(form.get("type")),
      date: String(form.get("date")),
      time: String(form.get("time")),
      court: String(form.get("court")),
      status: "Programada",
      objective: String(form.get("objective")),
      responsibleLawyer: String(form.get("responsibleLawyer")),
      assistantOwner: String(form.get("assistantOwner") || "") || undefined
    });
    if (operation === "hearing") addCaseHearing({
      type: String(form.get("type")),
      date: String(form.get("date")),
      time: String(form.get("time")),
      court: String(form.get("court")),
      caseId: legalCase!.id,
      status: "Programada",
      objective: String(form.get("objective")),
      responsibleLawyer: String(form.get("responsibleLawyer")),
      assistantOwner: String(form.get("assistantOwner") || "") || undefined,
      sourceType: "Expediente"
    });
    if (operation === "taskFromProceeding" && operationSource) createTaskFromProceeding(legalCase!.id, operationSource.id, {
      title: String(form.get("title")),
      priority: String(form.get("priority")) as "Baja" | "Media" | "Alta",
      status: String(form.get("status")) as "Pendiente" | "En curso" | "Bloqueada" | "Completada",
      dueDate: String(form.get("dueDate")),
      owner: String(form.get("owner"))
    });
    if (operation === "task") addTask({
      title: String(form.get("title")),
      caseId: legalCase!.id,
      priority: String(form.get("priority")) as "Baja" | "Media" | "Alta",
      status: String(form.get("status")) as "Pendiente" | "En curso" | "Bloqueada" | "Completada",
      dueDate: String(form.get("dueDate")),
      owner: String(form.get("owner")),
      source: "Expediente",
      sourceType: "Expediente",
      comments: []
    });
    if (operation === "deadlineFromProceeding" && operationSource) createDeadlineFromProceeding(legalCase!.id, operationSource.id, {
      title: String(form.get("title")),
      date: String(form.get("date")),
      owner: String(form.get("owner")),
      time: String(form.get("time")),
      type: String(form.get("type")),
      priority: String(form.get("priority")) as "Baja" | "Media" | "Alta",
      consequence: String(form.get("consequence"))
    });
    if (operation === "deadline") addCaseDeadline(legalCase!.id, {
      title: String(form.get("title")),
      date: String(form.get("date")),
      owner: String(form.get("owner")),
      time: String(form.get("time")),
      type: String(form.get("type")),
      origin: String(form.get("origin")) as DeadlineOrigin,
      priority: String(form.get("priority")) as "Baja" | "Media" | "Alta",
      consequence: String(form.get("consequence")),
      sourceType: "Expediente"
    });
    if (operation === "note") addCaseNote(legalCase!.id, { text: String(form.get("text")), author: String(form.get("author")) });
    if (operation === "fee") addCaseFee(legalCase!.id, { concept: String(form.get("concept")), amount: Number(form.get("amount") || 0), status: String(form.get("status")) as "Programado" | "Por cobrar" | "Vencido" | "Pagado", dueDate: String(form.get("dueDate")) });
    setSaved("Registro agregado al expediente");
    closeOperation();
  }

  return (
    <AppShell>
      <Header
        title={legalCase.name}
        subtitle={`${legalCase.filingNumber} - ${legalCase.processType} - ${legalCase.proceduralStage}`}
        action={<div className="flex flex-wrap items-center gap-2"><Button variant="secondary" onClick={() => setEditing(true)}><Edit3 className="h-4 w-4" /> Editar</Button>{isInactive ? <Button onClick={() => setCaseStatus(legalCase.id, "En proceso")}><RotateCcw className="h-4 w-4" /> Reactivar</Button> : <><Button variant="secondary" onClick={() => setCaseStatus(legalCase.id, "Cerrado")}><XCircle className="h-4 w-4" /> Cerrar</Button><Button variant="secondary" onClick={() => setCaseStatus(legalCase.id, "Archivado")}><Archive className="h-4 w-4" /> Archivar</Button></>}</div>}
      />
      <div className="space-y-5 p-5 lg:p-8">
        {saved ? <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {saved}</div> : null}
        {editing ? <EditCaseForm legalCase={legalCase} onSubmit={submitEdit} onCancel={() => setEditing(false)} /> : null}

        <Card className="overflow-hidden border-slate-800 bg-legal-obsidian text-white shadow-executive">
          <div className="grid gap-5 p-5 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="flex flex-wrap items-center gap-2"><Badge tone={riskTone[legalCase.risk]}>{legalCase.risk}</Badge><Badge tone="blue">{legalCase.status}</Badge><Badge>{legalCase.legalArea}</Badge><Badge>{legalCase.processType}</Badge></div>
              <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-300">{legalCase.description}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
                <Info label="Cliente" value={client?.name ?? ""} dark />
                <Info label="Contraparte" value={legalCase.counterparty} dark />
                <Info label="Radicado" value={legalCase.filingNumber} dark />
                <Info label="Juzgado / autoridad" value={legalCase.court} dark />
                <Info label="Area juridica" value={legalCase.legalArea} dark />
                <Info label="Tipo de proceso" value={legalCase.processType} dark />
                <Info label="Etapa procesal" value={legalCase.proceduralStage} dark />
                <Info label="Abogado responsable" value={legalCase.internalOwner} dark />
                <Info label="Auxiliar" value={legalCase.assistantOwner || "Sin auxiliar"} dark />
                <Info label="Cuantia" value={money(legalCase.amount)} dark />
                <Info label="Riesgo operativo" value={`${legalCase.risk} (${legalCase.riskScore}/100)`} dark />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <p className="text-sm font-semibold text-blue-100">Proximos hitos</p>
              <div className="mt-4 space-y-3">
                <HeroSignal icon={<CalendarDays />} label="Termino" value={nextTerm ? `${nextTerm.title} - ${nextTerm.date}` : "Sin terminos pendientes"} />
                <HeroSignal icon={<Gavel />} label="Audiencia" value={nextHearing ? `${nextHearing.type} - ${nextHearing.date}` : "Sin audiencia proxima"} />
                <HeroSignal icon={<SquareCheckBig />} label="Accion" value={legalCase.currentAction} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Acciones rapidas del expediente" subtitle="Operaciones principales desde la pantalla madre del caso." />
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-6">
            <OperationButton icon={<Gavel />} label="Nueva actuacion" onClick={() => openOperation("proceeding")} />
            <OperationButton icon={<CalendarDays />} label="Crear termino" onClick={() => openOperation("deadline")} />
            <OperationButton icon={<FileText />} label="Subir documento" onClick={() => openOperation("document")} />
            <OperationButton icon={<Gavel />} label="Crear audiencia" onClick={() => openOperation("hearing")} />
            <OperationButton icon={<SquareCheckBig />} label="Crear tarea" onClick={() => openOperation("task")} />
            <OperationButton icon={<NotebookPen />} label="Agregar nota" onClick={() => openOperation("note")} />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-legal-line px-5 py-3">
            <Button variant="secondary" onClick={() => openOperation("party")}><Users className="h-4 w-4" /> Agregar parte</Button>
            <Button variant="secondary" onClick={() => openOperation("fee")}><CircleDollarSign className="h-4 w-4" /> Registrar honorario</Button>
          </div>
          {operation ? <OperationForm operation={operation} legalCase={legalCase} source={operationSource} onSubmit={submitOperation} onCancel={closeOperation} /> : null}
        </Card>

        <Card>
          <div className="flex gap-2 overflow-x-auto border-b border-legal-line p-3">
            {sections.map((section) => (
              <button key={section.id} onClick={() => setActiveSection(section.id)} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold transition [&_svg]:h-4 [&_svg]:w-4 ${activeSection === section.id ? "bg-legal-blue text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>
          <div className="p-5">
            {activeSection === "resumen" ? <Resumen legalCase={legalCase} clientName={client?.name ?? ""} nextTerm={nextTerm?.title ?? "Sin terminos pendientes"} nextHearing={nextHearing ? `${nextHearing.type} - ${nextHearing.date}` : "Sin audiencia proxima"} counts={{ proceedings: proceedings.length, terms: legalCase.deadlines.length, hearings: caseHearings.length, documents: caseDocs.length, tasks: caseTasks.length, notes: legalCase.notes.length, fees: legalCase.fees.length }} tracedItems={tracedItems} /> : null}
            {activeSection === "partes" ? <SimpleGrid items={parties.map((party) => ({ title: party.name, meta: party.role, detail: party.detail }))} empty="Sin partes registradas." action={<Button onClick={() => openOperation("party")}><Users className="h-4 w-4" /> Agregar parte</Button>} /> : null}
            {activeSection === "actuaciones" ? <ProceedingsList proceedings={proceedings} documents={caseDocs} deadlines={legalCase.deadlines} hearings={caseHearings} tasks={caseTasks} onCreate={() => openOperation("proceeding")} onCreateTerm={(source) => openOperation("deadlineFromProceeding", source)} onCreateTask={(source) => openOperation("taskFromProceeding", source)} onCreateHearing={(source) => openOperation("hearingFromProceeding", source)} onAttachDocument={(source) => openOperation("documentFromProceeding", source)} /> : null}
            {activeSection === "terminos" ? <SimpleGrid items={legalCase.deadlines.map((term) => ({ title: term.title, meta: `${term.status} - ${term.origin}`, detail: `${term.date} ${term.time} - ${term.owner}`, source: `Origen: ${resolveCaseSource(term).label}` }))} empty="Sin terminos asociados." action={<Button onClick={() => openOperation("deadline")}><CalendarDays className="h-4 w-4" /> Crear termino</Button>} /> : null}
            {activeSection === "audiencias" ? <SimpleGrid items={caseHearings.map((hearing) => ({ title: hearing.type, meta: hearing.status, detail: `${hearing.date} ${hearing.time} - ${hearing.court}`, source: `Origen: ${resolveCaseSource(hearing).label}`, href: `/hearings/${hearing.id}` }))} empty="Sin audiencias asociadas." action={<Button onClick={() => openOperation("hearing")}><Gavel className="h-4 w-4" /> Crear audiencia</Button>} /> : null}
            {activeSection === "documentos" ? <SimpleGrid items={caseDocs.map((doc) => ({ title: doc.title, meta: `${doc.type} - ${doc.status}`, detail: doc.summary, source: `Origen: ${resolveCaseSource(doc).label}`, href: `/documents/${doc.id}` }))} empty="Sin documentos asociados." action={<Button onClick={() => openOperation("document")}><FileText className="h-4 w-4" /> Subir documento</Button>} /> : null}
            {activeSection === "tareas" ? <SimpleGrid items={caseTasks.map((task) => ({ title: task.title, meta: `${task.status} - ${task.priority}`, detail: `${task.dueDate} - ${task.owner}`, source: `Origen: ${resolveCaseSource(task).label}` }))} empty="Sin tareas asociadas." action={<Button onClick={() => openOperation("task")}><SquareCheckBig className="h-4 w-4" /> Crear tarea</Button>} /> : null}
            {activeSection === "notas" ? <SimpleGrid items={legalCase.notes.map((note) => ({ title: note.text, meta: note.author, detail: note.date }))} empty="Sin notas internas." action={<Button onClick={() => openOperation("note")}><NotebookPen className="h-4 w-4" /> Agregar nota</Button>} /> : null}
            {activeSection === "financiero" ? <SimpleGrid items={legalCase.fees.map((fee) => ({ title: fee.concept, meta: fee.status, detail: `${money(fee.amount)} - ${fee.dueDate}` }))} empty="Sin honorarios registrados." footer={`Pendiente: ${money(pendingFees)} de ${money(totalFees)}`} /> : null}
            {activeSection === "equipo" ? <SimpleGrid items={[{ title: legalCase.internalOwner, meta: "Abogado responsable", detail: "Responsable juridico principal del expediente" }, { title: legalCase.assistantOwner || "Sin auxiliar asignado", meta: "Auxiliar juridico", detail: "Apoyo operativo en documentos, agenda y tareas" }]} empty="Sin equipo asociado." /> : null}
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader title="Asistente contextual" subtitle="IA bajo demanda dentro del expediente. No crea terminos ni tareas sin validacion." />
            <div className="grid gap-4 p-5 xl:grid-cols-2">
              <AIResponsePanel embedded type="case" button="Resumir expediente" source={`Expediente ${legalCase.name}, actuaciones, terminos, audiencias, documentos, tareas y notas visibles.`} />
              <AIResponsePanel embedded type="draft" button="Redactar borrador" source={`Expediente ${legalCase.name}, cliente ${client?.name ?? "sin cliente"}, area ${legalCase.legalArea}, etapa ${legalCase.proceduralStage} y documentos asociados.`} />
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold text-slate-950">Lectura tecnica para backend</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">Esta pantalla ya separa entidades que luego seran tablas o relaciones: partes, actuaciones, terminos, audiencias, documentos, tareas, notas, honorarios y equipo.</p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function EditCaseForm({ legalCase, onSubmit, onCancel }: { legalCase: ReturnType<typeof useLegalStore>["cases"][number]; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  const { team } = useLegalStore();
  return (
    <Card>
      <CardHeader title="Editar expediente" subtitle="Actualiza los datos juridicos centrales del expediente." />
      <form onSubmit={onSubmit} className="grid gap-4 p-5 md:grid-cols-2">
        <Field label="Nombre"><input name="name" required defaultValue={legalCase.name} className={inputClass} /></Field>
        <Field label="Radicado"><input name="filingNumber" required defaultValue={legalCase.filingNumber} className={inputClass} /></Field>
        <Field label="Ciudad"><input name="city" defaultValue={legalCase.city} className={inputClass} /></Field>
        <Field label="Area juridica"><select name="legalArea" defaultValue={legalCase.legalArea} className={inputClass}>{legalAreas.map((area) => <option key={area}>{area}</option>)}</select></Field>
        <Field label="Juzgado / autoridad"><input name="court" defaultValue={legalCase.court} className={inputClass} /></Field>
        <Field label="Tipo de proceso"><input name="processType" defaultValue={legalCase.processType} className={inputClass} /></Field>
        <Field label="Etapa procesal"><input name="proceduralStage" defaultValue={legalCase.proceduralStage} className={inputClass} /></Field>
        <Field label="Estado"><select name="status" defaultValue={legalCase.status} className={inputClass}><option>En proceso</option><option>Investigacion</option><option>Conciliacion</option><option>Terminado</option><option>Archivado</option><option>Cerrado</option></select></Field>
        <Field label="Riesgo"><select name="risk" defaultValue={legalCase.risk} className={inputClass}><option>Bajo</option><option>Medio</option><option>Alto</option></select></Field>
        <Field label="Contraparte"><input name="counterparty" defaultValue={legalCase.counterparty} className={inputClass} /></Field>
        <Field label="Apoderado contrario"><input name="opposingCounsel" defaultValue={legalCase.opposingCounsel} className={inputClass} /></Field>
        <Field label="Abogado responsable"><select name="internalOwner" defaultValue={legalCase.internalOwner} className={inputClass}>{team.filter((member) => member.role === "Propietario" || member.role === "Abogado").map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field>
        <Field label="Auxiliar asignado"><select name="assistantOwner" defaultValue={legalCase.assistantOwner ?? ""} className={inputClass}><option value="">Sin auxiliar</option>{team.filter((member) => member.role === "Auxiliar Juridico").map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field>
        <Field label="Cuantia"><input name="amount" type="number" defaultValue={legalCase.amount} className={inputClass} /></Field>
        <Field label="Termino principal"><input name="criticalDeadline" defaultValue={legalCase.criticalDeadline} className={inputClass} /></Field>
        <Field label="Proxima audiencia"><input name="nextHearing" defaultValue={legalCase.nextHearing} className={inputClass} /></Field>
        <div className="md:col-span-2"><Field label="Proxima actuacion"><input name="currentAction" defaultValue={legalCase.currentAction} className={inputClass} /></Field></div>
        <div className="md:col-span-2"><Field label="Descripcion"><textarea name="description" defaultValue={legalCase.description} className={`${inputClass} min-h-24 py-3`} /></Field></div>
        <div className="flex flex-wrap gap-3 md:col-span-2"><Button type="submit"><Save className="h-4 w-4" /> Guardar cambios</Button><Button variant="secondary" onClick={onCancel}>Cancelar</Button></div>
      </form>
    </Card>
  );
}

function OperationForm({ operation, legalCase, source, onSubmit, onCancel }: { operation: Exclude<Operation, null>; legalCase: ReturnType<typeof useLegalStore>["cases"][number]; source?: CaseProceeding | null; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void }) {
  const { team, hearings } = useLegalStore();
  const lawyers = team.filter((member) => member.role === "Propietario" || member.role === "Abogado");
  const assistants = team.filter((member) => member.role === "Auxiliar Juridico");
  const caseHearings = hearings.filter((hearing) => hearing.caseId === legalCase.id);
  const title = ({
    party: "Agregar parte procesal",
    proceeding: "Nueva actuacion procesal",
    document: "Agregar documento",
    documentFromProceeding: "Agregar documento desde actuacion",
    hearing: "Agregar audiencia",
    hearingFromProceeding: "Crear audiencia desde actuacion",
    task: "Crear tarea",
    taskFromProceeding: "Crear tarea desde actuacion",
    deadline: "Crear termino",
    deadlineFromProceeding: "Crear termino desde actuacion",
    note: "Agregar nota interna",
    fee: "Agregar honorario"
  } satisfies Record<NonNullable<Operation>, string>)[operation];
  return (
    <form onSubmit={onSubmit} className="grid gap-4 border-t border-legal-line p-5 md:grid-cols-3">
      <div className="md:col-span-3"><p className="text-sm font-bold text-slate-950">{title}</p></div>
      {source ? <div className="md:col-span-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <p className="font-bold">Origen: {source.title}</p>
        <p className="mt-1">Esta accion queda conectada a la actuacion del {source.date}. El abogado conserva la trazabilidad dentro del expediente.</p>
      </div> : null}
      {operation === "party" ? <><Field label="Nombre"><input name="name" required className={inputClass} placeholder="Persona, empresa, autoridad o apoderado" /></Field><Field label="Rol"><select name="role" className={inputClass}><option>Cliente principal</option><option>Demandante</option><option>Demandado</option><option>Contraparte</option><option>Tercero</option><option>Apoderado</option><option>Autoridad</option><option>Otro</option></select></Field><div className="flex items-end gap-4"><label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input name="isClient" type="checkbox" /> Es cliente</label><label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input name="isOpposing" type="checkbox" /> Es contraparte</label></div><div className="md:col-span-3"><Field label="Detalle"><input name="detail" className={inputClass} placeholder="Documento, apoderado, relacion procesal o nota relevante" /></Field></div></> : null}
      {operation === "proceeding" ? <><Field label="Tipo de actuacion"><select name="type" className={inputClass}><option>Demanda</option><option>Contestacion</option><option>Auto</option><option>Sentencia</option><option>Recurso</option><option>Notificacion</option><option>Audiencia</option><option>Memorial</option><option>Otra</option></select></Field><Field label="Titulo"><input name="title" required className={inputClass} placeholder="Auto que admite demanda, recurso, memorial..." /></Field><Field label="Fecha"><input name="date" required className={inputClass} defaultValue={new Date().toLocaleDateString("es-CO")} /></Field><Field label="Responsable"><select name="owner" defaultValue={legalCase.internalOwner} className={inputClass}>{lawyers.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field><Field label="Origen"><select name="origin" className={inputClass}><option>Manual</option><option>Documento</option><option>Audiencia</option><option>Actuacion</option><option>Sugerencia IA</option></select></Field><label className="flex items-center gap-2 pt-7 text-sm font-semibold text-slate-700"><input name="createsTerm" type="checkbox" /> Puede generar termino</label><div className="md:col-span-3"><Field label="Descripcion"><input name="description" className={inputClass} placeholder="Que ocurrio y que implica para el expediente" /></Field></div></> : null}
      {operation === "document" || operation === "documentFromProceeding" ? <>
        <div className="md:col-span-3 rounded-lg border border-dashed border-blue-200 bg-blue-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-blue-950">Archivo del expediente</p>
              <p className="mt-1 text-xs leading-5 text-blue-800">El archivo nace conectado al expediente{source ? " y a la actuacion seleccionada" : ""}.</p>
            </div>
            <label className="inline-flex min-h-9 cursor-pointer items-center justify-center rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
              Seleccionar archivo
              <input name="file" type="file" className="sr-only" />
            </label>
          </div>
        </div>
        <Field label="Titulo"><input name="title" className={inputClass} defaultValue={source ? `Documento asociado a ${source.title}` : ""} placeholder="Puede tomar el nombre del archivo" /></Field>
        <Field label="Tipo"><select name="type" className={inputClass}><option>Memorial</option><option>Demanda</option><option>Contestacion</option><option>Poder</option><option>Auto</option><option>Sentencia</option><option>Contrato</option><option>Prueba</option><option>Anexo</option><option>Comunicacion</option><option>Otro</option></select></Field>
        <Field label="Clasificacion"><select name="category" className={inputClass}><option>Documento</option><option>Prueba</option><option>Anexo</option><option>Comunicacion</option></select></Field>
        <Field label="Estado"><select name="status" className={inputClass}><option>Pendiente</option><option>En revision</option><option>Analizado</option><option>Firmado</option><option>Radicado</option></select></Field>
        <Field label="Audiencia vinculada"><select name="hearingId" className={inputClass}><option value="">Sin audiencia</option>{caseHearings.map((hearing) => <option key={hearing.id} value={hearing.id}>{hearing.type} - {hearing.date}</option>)}</select></Field>
        <Field label="Fecha detectada"><input name="detectedDate" className={inputClass} placeholder="12/06/2026" /></Field>
        <Field label="Detalle de fecha"><input name="dateDetail" className={inputClass} placeholder="Posible termino, audiencia o radicacion" /></Field>
        <Field label="Hallazgo inicial"><input name="finding" className={inputClass} placeholder="Riesgo, inconsistencia o tarea sugerida" /></Field>
        <div className="md:col-span-3"><Field label="Detalle del hallazgo"><input name="findingDetail" className={inputClass} /></Field></div>
        <div className="md:col-span-3"><Field label="Resumen operativo"><input name="summary" className={inputClass} defaultValue={source?.description ?? ""} placeholder="Que contiene y por que importa para el expediente" /></Field></div>
      </> : null}
      {operation === "hearing" || operation === "hearingFromProceeding" ? <><Field label="Tipo de audiencia"><input name="type" required className={inputClass} defaultValue={source?.type === "Audiencia" ? source.title : ""} /></Field><Field label="Fecha"><input name="date" type="date" required className={inputClass} /></Field><Field label="Hora"><input name="time" type="time" className={inputClass} /></Field><Field label="Abogado responsable"><select name="responsibleLawyer" defaultValue={legalCase.internalOwner} className={inputClass}>{lawyers.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field><Field label="Auxiliar asignado"><select name="assistantOwner" defaultValue={legalCase.assistantOwner ?? ""} className={inputClass}><option value="">Sin auxiliar</option>{assistants.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field><Field label="Juzgado / autoridad"><input name="court" defaultValue={legalCase.court} className={inputClass} /></Field><div className="md:col-span-3"><Field label="Objetivo de preparacion"><input name="objective" className={inputClass} defaultValue={source?.description ?? ""} placeholder="Que debe preparar el abogado para esta audiencia" /></Field></div></> : null}
      {operation === "task" || operation === "taskFromProceeding" ? <><Field label="Tarea"><input name="title" required className={inputClass} defaultValue={source ? `Revisar ${source.title}` : ""} /></Field><Field label="Prioridad"><select name="priority" className={inputClass}><option>Alta</option><option>Media</option><option>Baja</option></select></Field><Field label="Estado"><select name="status" className={inputClass}><option>Pendiente</option><option>En curso</option><option>Bloqueada</option><option>Completada</option></select></Field><Field label="Fecha limite"><input name="dueDate" className={inputClass} defaultValue={legalCase.criticalDeadline} /></Field><Field label="Responsable"><select name="owner" defaultValue={source?.owner ?? legalCase.internalOwner} className={inputClass}>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field></> : null}
      {operation === "deadline" || operation === "deadlineFromProceeding" ? <><Field label="Termino"><input name="title" required className={inputClass} defaultValue={source ? `Termino derivado de ${source.title}` : ""} /></Field><Field label="Fecha limite"><input name="date" className={inputClass} defaultValue={legalCase.criticalDeadline} /></Field><Field label="Hora"><input name="time" className={inputClass} defaultValue="17:00" /></Field><Field label="Tipo"><input name="type" className={inputClass} defaultValue={operation === "deadlineFromProceeding" ? "Termino derivado de actuacion" : "Termino procesal"} /></Field><Field label="Origen"><select name="origin" className={inputClass} defaultValue={operation === "deadlineFromProceeding" ? "Actuacion" : "Manual"}><option>Actuacion</option><option>Audiencia</option><option>Documento</option><option>Manual</option><option>Sugerencia IA</option></select></Field><Field label="Prioridad"><select name="priority" className={inputClass}><option>Alta</option><option>Media</option><option>Baja</option></select></Field><Field label="Responsable"><select name="owner" className={inputClass} defaultValue={source?.owner ?? legalCase.internalOwner}>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field><div className="md:col-span-3"><Field label="Riesgo / consecuencia"><input name="consequence" className={inputClass} defaultValue={source ? `Revisar consecuencia procesal de la actuacion: ${source.title}` : ""} placeholder="Que pasa si no se cumple el termino" /></Field></div></> : null}
      {operation === "note" ? <><div className="md:col-span-2"><Field label="Nota"><input name="text" required className={inputClass} /></Field></div><Field label="Autor"><input name="author" className={inputClass} defaultValue={legalCase.internalOwner} /></Field></> : null}
      {operation === "fee" ? <><Field label="Concepto"><input name="concept" required className={inputClass} /></Field><Field label="Monto"><input name="amount" type="number" min="0" className={inputClass} /></Field><Field label="Estado"><select name="status" className={inputClass}><option>Por cobrar</option><option>Programado</option><option>Vencido</option><option>Pagado</option></select></Field><Field label="Vence"><input name="dueDate" className={inputClass} /></Field></> : null}
      <div className="flex flex-wrap gap-3 md:col-span-3"><Button type="submit"><Save className="h-4 w-4" /> Guardar registro</Button><Button variant="secondary" onClick={onCancel}>Cancelar</Button></div>
    </form>
  );
}

function Resumen({ legalCase, clientName, nextTerm, nextHearing, counts, tracedItems }: {
  legalCase: ReturnType<typeof useLegalStore>["cases"][number];
  clientName: string;
  nextTerm: string;
  nextHearing: string;
  counts: { proceedings: number; terms: number; hearings: number; documents: number; tasks: number; notes: number; fees: number };
  tracedItems: { kind: string; title: string; source: string; detail: string }[];
}) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryItem label="Cliente" value={clientName} />
        <SummaryItem label="Contraparte" value={legalCase.counterparty} />
        <SummaryItem label="Radicado" value={legalCase.filingNumber} />
        <SummaryItem label="Juzgado / autoridad" value={legalCase.court} />
        <SummaryItem label="Area juridica" value={legalCase.legalArea} />
        <SummaryItem label="Tipo de proceso" value={legalCase.processType} />
        <SummaryItem label="Etapa procesal" value={legalCase.proceduralStage} />
        <SummaryItem label="Responsable" value={legalCase.internalOwner} />
        <SummaryItem label="Auxiliar" value={legalCase.assistantOwner || "Sin auxiliar"} />
        <SummaryItem label="Estado / riesgo" value={`${legalCase.status} - ${legalCase.risk}`} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-legal-line bg-white p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm font-bold text-slate-950">Lectura juridica del expediente</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{legalCase.description}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <SummaryItem label="Proximo termino" value={nextTerm} />
            <SummaryItem label="Proxima audiencia" value={nextHearing} />
            <SummaryItem label="Siguiente actuacion" value={legalCase.currentAction} />
          </div>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-bold text-blue-950">Mapa operativo</p>
          <p className="mt-1 text-xs leading-5 text-blue-800">Todo debe poder explicarse desde el expediente: que ocurrio, que documento lo soporta, que termino nace y quien responde.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Metric label="Actuaciones" value={counts.proceedings} />
            <Metric label="Terminos" value={counts.terms} />
            <Metric label="Audiencias" value={counts.hearings} />
            <Metric label="Documentos" value={counts.documents} />
            <Metric label="Tareas" value={counts.tasks} />
            <Metric label="Notas" value={counts.notes} />
            <Metric label="Honorarios" value={counts.fees} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-legal-line bg-slate-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-950">Trazabilidad del expediente</p>
            <p className="mt-1 text-sm text-slate-500">Registros derivados con origen visible para que el abogado pueda confiar en cada alerta.</p>
          </div>
          <Badge tone="blue">{tracedItems.length} conexiones</Badge>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {tracedItems.map((item) => (
            <div key={`${item.kind}-${item.title}-${item.detail}`} className="rounded-md border border-legal-line bg-white p-3">
              <div className="flex flex-wrap items-center gap-2"><Badge>{item.kind}</Badge><span className="text-xs font-semibold text-slate-500">{item.detail}</span></div>
              <p className="mt-2 text-sm font-bold text-slate-950">{item.title}</p>
              <p className="mt-1 text-xs font-semibold text-slate-600">Origen: {item.source}</p>
            </div>
          ))}
          {!tracedItems.length ? <p className="text-sm text-slate-500">Sin conexiones trazables registradas.</p> : null}
        </div>
      </section>
    </div>
  );
}

function ProceedingsList({ proceedings, documents, deadlines, hearings, tasks, onCreate, onCreateTerm, onCreateTask, onCreateHearing, onAttachDocument }: {
  proceedings: CaseProceeding[];
  documents: ReturnType<typeof useLegalStore>["documents"];
  deadlines: ReturnType<typeof useLegalStore>["cases"][number]["deadlines"];
  hearings: ReturnType<typeof useLegalStore>["hearings"];
  tasks: ReturnType<typeof useLegalStore>["tasks"];
  onCreate: () => void;
  onCreateTerm: (source: CaseProceeding) => void;
  onCreateTask: (source: CaseProceeding) => void;
  onCreateHearing: (source: CaseProceeding) => void;
  onAttachDocument: (source: CaseProceeding) => void;
}) {
  const orderedProceedings = [...proceedings].sort((a, b) => parseCaseDate(a.date).getTime() - parseCaseDate(b.date).getTime());
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-950">Linea de vida procesal</p>
          <p className="text-sm text-slate-500">Historia cronologica del expediente: que ocurrio, quien responde y que trabajo nacio de cada actuacion.</p>
        </div>
        <Button onClick={onCreate}><Gavel className="h-4 w-4" /> Nueva actuacion</Button>
      </div>
      <div className="relative space-y-4 pl-7 before:absolute before:left-3 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-legal-line">
        {orderedProceedings.map((proceeding, index) => {
          const derivedDocuments = documents.filter((document) => (document.sourceType === "Actuacion" && document.sourceId === proceeding.id) || document.proceedingId === proceeding.id);
          const derivedDeadlines = deadlines.filter((deadline) => deadline.sourceType === "Actuacion" && deadline.sourceId === proceeding.id);
          const derivedHearings = hearings.filter((hearing) => hearing.sourceType === "Actuacion" && hearing.sourceId === proceeding.id);
          const derivedTasks = tasks.filter((task) => task.sourceType === "Actuacion" && task.sourceId === proceeding.id);
          const hasDerived = derivedDocuments.length || derivedDeadlines.length || derivedHearings.length || derivedTasks.length;
          return (
            <div key={proceeding.id} className="relative">
              <div className="absolute -left-[22px] top-5 grid h-4 w-4 place-items-center rounded-full border-2 border-white bg-legal-blue shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <div className="rounded-lg border border-legal-line bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="blue">{proceeding.type}</Badge>
                      <Badge>{proceeding.origin}</Badge>
                      {proceeding.createsTerm ? <Badge tone="amber">Puede generar termino</Badge> : null}
                      {hasDerived ? <Badge tone="green">Con derivados</Badge> : <Badge>Sin derivados</Badge>}
                    </div>
                    <p className="mt-3 text-base font-bold text-slate-950">{proceeding.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{proceeding.description}</p>
                  </div>
                  <div className="min-w-44 rounded-md bg-slate-50 p-3 text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Hito {index + 1}</p>
                    <p className="mt-1 text-sm font-bold text-slate-950">{proceeding.date}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 border-t border-legal-line pt-4 md:grid-cols-4">
                  <TimelineFact label="Fecha" value={proceeding.date} />
                  <TimelineFact label="Tipo" value={proceeding.type} />
                  <TimelineFact label="Responsable" value={proceeding.owner || "Sin responsable"} />
                  <TimelineFact label="Origen" value={proceeding.sourceType ? `${proceeding.origin} - ${proceeding.sourceType}` : proceeding.origin} />
                </div>

                <div className="mt-4 grid gap-3 border-t border-legal-line pt-4 md:grid-cols-2 xl:grid-cols-4">
                  <DerivedGroup title="Documentos asociados" tone="green" items={derivedDocuments.map((document) => ({ label: `${document.title} - ${document.status}`, href: `/documents/${document.id}` }))} />
                  <DerivedGroup title="Terminos generados" tone="red" items={derivedDeadlines.map((deadline) => ({ label: `${deadline.title} - ${deadline.date}` }))} />
                  <DerivedGroup title="Tareas derivadas" tone="amber" items={derivedTasks.map((task) => ({ label: `${task.title} - ${task.owner}` }))} />
                  <DerivedGroup title="Audiencias relacionadas" tone="blue" items={derivedHearings.map((hearing) => ({ label: `${hearing.type} - ${hearing.date}`, href: `/hearings/${hearing.id}` }))} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-legal-line pt-3">
                  <Button variant="secondary" onClick={() => onCreateTerm(proceeding)}><CalendarDays className="h-4 w-4" /> Crear termino</Button>
                  <Button variant="secondary" onClick={() => onCreateTask(proceeding)}><SquareCheckBig className="h-4 w-4" /> Crear tarea</Button>
                  <Button variant="secondary" onClick={() => onAttachDocument(proceeding)}><FileText className="h-4 w-4" /> Asociar documento</Button>
                  <Button variant="secondary" onClick={() => onCreateHearing(proceeding)}><Gavel className="h-4 w-4" /> Crear audiencia</Button>
                </div>
              </div>
            </div>
          );
        })}
        {!proceedings.length ? <p className="text-sm text-slate-500">Sin actuaciones procesales.</p> : null}
      </div>
    </div>
  );
}

function TimelineFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function DerivedGroup({ title, items, tone }: { title: string; items: { label: string; href?: string }[]; tone: "red" | "amber" | "blue" | "green" }) {
  const toneClass = tone === "red" ? "bg-rose-50 text-rose-800" : tone === "amber" ? "bg-amber-50 text-amber-800" : tone === "green" ? "bg-emerald-50 text-emerald-800" : "bg-blue-50 text-blue-800";
  return (
    <div className={`rounded-md p-3 ${toneClass}`}>
      <p className="text-xs font-bold uppercase tracking-[0.04em]">{title}</p>
      <p className="mt-1 text-lg font-bold">{items.length}</p>
      <div className="mt-2 space-y-1">
        {items.slice(0, 3).map((item) => item.href ? <Link key={item.label} href={item.href} className="block line-clamp-1 text-xs font-semibold underline-offset-2 opacity-90 hover:underline">{item.label}</Link> : <p key={item.label} className="line-clamp-1 text-xs font-semibold opacity-90">{item.label}</p>)}
        {!items.length ? <p className="text-xs font-semibold opacity-75">Sin derivados</p> : null}
      </div>
    </div>
  );
}

function parseCaseDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T12:00:00`);
  const [day, month, year] = value.split("/");
  return new Date(`${year}-${month}-${day}T12:00:00`);
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-md bg-white/80 p-3 ring-1 ring-blue-100"><p className="text-xs font-bold uppercase tracking-[0.04em] text-blue-700">{label}</p><p className="mt-1 text-xl font-bold text-blue-950">{value}</p></div>;
}

function SimpleGrid({ items, empty, action, footer }: { items: { title: string; meta: string; detail: string; source?: string; href?: string }[]; empty: string; action?: ReactNode; footer?: string }) {
  return (
    <div>
      {action ? <div className="mb-4">{action}</div> : null}
      {items.length ? <div className="grid gap-3 md:grid-cols-2">{items.map((item) => <div key={`${item.title}-${item.meta}`} className="rounded-lg border border-legal-line bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{item.meta}</p>{item.href ? <Link href={item.href} className="mt-2 inline-flex font-bold text-slate-950 hover:text-legal-blue">{item.title}</Link> : <p className="mt-2 font-bold text-slate-950">{item.title}</p>}<p className="mt-1 text-sm leading-6 text-slate-500">{item.detail}</p>{item.source ? <p className="mt-2 rounded-md bg-blue-50 p-2 text-xs font-semibold text-blue-900">{item.source}</p> : null}</div>)}</div> : <p className="text-sm text-slate-500">{empty}</p>}
      {footer ? <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">{footer}</div> : null}
    </div>
  );
}

function OperationButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex min-h-16 items-center gap-3 rounded-lg border border-legal-line bg-white p-3 text-left text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-legal-blue hover:bg-blue-50 [&_svg]:h-4 [&_svg]:w-4">{icon}<span>{label}</span></button>;
}

function Info({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return <div><p className={dark ? "text-xs font-bold uppercase text-slate-400" : "text-xs font-semibold uppercase text-slate-400"}>{label}</p><p className={dark ? "mt-1 text-sm font-semibold text-white" : "mt-1 text-sm font-semibold text-slate-950"}>{value}</p></div>;
}

function HeroSignal({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="rounded-md border border-white/10 bg-white/[0.06] p-3"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-400 [&_svg]:h-4 [&_svg]:w-4">{icon}{label}</div><p className="mt-2 line-clamp-2 text-sm font-semibold text-white">{value}</p></div>;
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-legal-line bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{label}</p><p className="mt-2 text-sm font-bold text-slate-950">{value}</p></div>;
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
