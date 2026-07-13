"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { FormEvent } from "react";
import { ArrowLeft, CalendarPlus, CheckCircle2, ClipboardCheck, FileText, Gavel, Link2, MessageSquarePlus, Save, SquareCheckBig } from "lucide-react";
import { AIResponsePanel } from "@/components/ai-response";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, EmptyState, Field, inputClass } from "@/components/ui";
import { useLegalStore } from "@/lib/store";
import type { Priority } from "@/types";

export default function HearingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    getHearing,
    getCase,
    documents,
    tasks,
    team,
    updateHearing,
    toggleHearingChecklist,
    addHearingChecklistItem,
    addHearingQuestion,
    addHearingDerivedDeadline,
    createProceedingFromHearingResult,
    addTask
  } = useLegalStore();
  const hearing = getHearing(id);

  if (!hearing) {
    return (
      <AppShell>
        <Header title="Audiencia no encontrada" subtitle="No existe en la agenda actual." />
        <div className="p-8"><EmptyState title="Sin audiencia" description="Abre una audiencia desde la agenda juridica." /></div>
      </AppShell>
    );
  }

  const legalCase = getCase(hearing.caseId);
  const caseDocuments = documents.filter((document) => document.caseId === hearing.caseId);
  const linkedDocuments = caseDocuments.filter((document) => hearing.documentIds.includes(document.id));
  const completed = hearing.checklist.filter((item) => item.completed).length;
  const resultProceeding = legalCase?.proceedings?.find((proceeding) => proceeding.sourceType === "Audiencia" && proceeding.sourceId === hearing.id);
  const derivedTasks = tasks.filter((task) => task.sourceType === "Audiencia" && task.sourceId === hearing.id);
  const hasResult = Boolean(hearing.result.trim());

  function addChecklist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addHearingChecklistItem(hearing!.id, String(form.get("title")));
    event.currentTarget.reset();
  }

  function addQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addHearingQuestion(hearing!.id, String(form.get("question")));
    event.currentTarget.reset();
  }

  function savePreparation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateHearing(hearing!.id, {
      objective: String(form.get("objective")),
      caseTheory: String(form.get("caseTheory")),
      result: String(form.get("result")),
      status: String(form.get("status")) as "Programada" | "Confirmada" | "Realizada" | "Aplazada"
    });
  }

  function associateDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const documentId = String(form.get("documentId") || "");
    if (!documentId || hearing!.documentIds.includes(documentId)) return;
    updateHearing(hearing!.id, { documentIds: [...hearing!.documentIds, documentId] });
    event.currentTarget.reset();
  }

  function addEvidence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const evidence = String(form.get("evidence") || "").trim();
    if (!evidence) return;
    updateHearing(hearing!.id, { evidenceTitles: [...hearing!.evidenceTitles, evidence] });
    event.currentTarget.reset();
  }

  function addDeadline(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addHearingDerivedDeadline(hearing!.id, {
      title: String(form.get("title")),
      date: String(form.get("date")),
      time: String(form.get("time") || "17:00"),
      type: String(form.get("type") || "Termino derivado"),
      owner: String(form.get("owner")),
      priority: String(form.get("priority") || "Media") as Priority,
      consequence: String(form.get("consequence") || "Debe revisarse por el abogado responsable."),
      sourceType: "Audiencia",
      sourceId: hearing!.id
    });
    event.currentTarget.reset();
  }

  function addDerivedTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addTask({
      title: String(form.get("title")),
      caseId: hearing!.caseId,
      type: "Preparacion de audiencia",
      status: "Pendiente",
      source: "Audiencia",
      sourceType: "Audiencia",
      sourceId: hearing!.id,
      priority: String(form.get("priority") || "Media") as Priority,
      dueDate: String(form.get("dueDate") || hearing!.date),
      owner: String(form.get("owner") || legalCase?.internalOwner || "Dr. Juan Martinez"),
      comments: String(form.get("comment") || "").trim() ? [String(form.get("comment"))] : []
    });
    event.currentTarget.reset();
  }

  function createPrepTask(title: string) {
    addTask({ title, caseId: hearing!.caseId, priority: "Media", dueDate: hearing!.date, owner: legalCase?.internalOwner ?? "Dr. Juan Martinez", source: "Audiencia", sourceType: "Audiencia", sourceId: hearing!.id });
  }

  function registerResult() {
    updateHearing(hearing!.id, {
      status: "Realizada",
      result: hearing!.result || "Resultado pendiente de completar por el abogado."
    });
  }

  function createQuickDerivedDeadline() {
    addHearingDerivedDeadline(hearing!.id, {
      title: `Termino derivado de ${hearing!.type}`,
      date: hearing!.date,
      owner: legalCase?.internalOwner ?? "Dr. Juan Martinez"
    });
  }

  function registerPostHearingProceeding() {
    createProceedingFromHearingResult(hearing!.id);
  }

  return (
    <AppShell>
      <Header title={hearing.type} subtitle={`${legalCase?.name ?? "Sin expediente"} - ${hearing.date} ${hearing.time}`} action={<Link href="/hearings" className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /> Volver</Link>} />
      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_360px] lg:p-8">
        <div className="space-y-5">
          <Card className="overflow-hidden border-slate-800 bg-legal-obsidian text-white shadow-executive">
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2"><Badge tone={hearing.status === "Realizada" ? "green" : hearing.status === "Aplazada" ? "amber" : "blue"}>{hearing.status}</Badge><Badge>{hearing.modality}</Badge><Badge tone="blue">{completed}/{hearing.checklist.length} checklist</Badge></div>
              <h2 className="mt-5 text-2xl font-bold">{hearing.objective}</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Info label="Juzgado" value={hearing.court} />
                <Info label="Area juridica" value={legalCase?.legalArea ?? "Sin area"} />
                <Info label="Sala" value={hearing.room || "Sin sala"} />
                <Info label="Enlace" value={hearing.link || "No aplica"} />
                <Info label="Abogado responsable" value={hearing.responsibleLawyer ?? legalCase?.internalOwner ?? "Sin responsable"} />
                <Info label="Auxiliar" value={hearing.assistantOwner ?? legalCase?.assistantOwner ?? "Sin auxiliar"} />
              </div>
            </div>
          </Card>

          <section className="grid gap-5 xl:grid-cols-2">
            <Card>
              <CardHeader title="Checklist de preparacion" subtitle="Marca lo que ya esta listo antes de audiencia." />
              <div className="divide-y divide-legal-line">
                {hearing.checklist.map((item) => <label key={item.id} className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-800"><input type="checkbox" checked={item.completed} onChange={() => toggleHearingChecklist(hearing.id, item.id)} /> <span className={item.completed ? "text-slate-400 line-through" : ""}>{item.title}</span></label>)}
              </div>
              <form onSubmit={addChecklist} className="flex flex-wrap items-end gap-3 border-t border-legal-line p-5"><Field label="Nuevo item"><input name="title" required className={inputClass} /></Field><Button type="submit"><SquareCheckBig className="h-4 w-4" /> Agregar</Button></form>
            </Card>

            <Card>
              <CardHeader title="Documentos y pruebas" subtitle="Documentos necesarios y pruebas asociadas." />
              <div className="grid gap-4 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Documentos asociados</p>
                  <div className="mt-3 divide-y divide-legal-line rounded-lg border border-legal-line">
                    {linkedDocuments.map((document) => <Link key={document.id} href={`/documents/${document.id}`} className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"><span>{document.title}</span><Badge tone={document.category === "Prueba" ? "red" : document.category === "Anexo" ? "amber" : document.category === "Comunicacion" ? "slate" : "blue"}>{document.category}</Badge></Link>)}
                    {!linkedDocuments.length ? <p className="px-4 py-3 text-sm text-slate-500">Sin documentos asociados.</p> : null}
                  </div>
                  <form onSubmit={associateDocument} className="mt-3 flex flex-wrap items-end gap-3">
                    <Field label="Asociar documento"><select name="documentId" className={inputClass}><option value="">Seleccionar</option>{caseDocuments.map((document) => <option key={document.id} value={document.id}>{document.title}</option>)}</select></Field>
                    <Button type="submit" variant="secondary"><Link2 className="h-4 w-4" /> Asociar</Button>
                  </form>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Pruebas asociadas</p>
                  <div className="mt-3 divide-y divide-legal-line rounded-lg border border-legal-line">
                    {hearing.evidenceTitles.map((evidence) => <div key={evidence} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700"><FileText className="h-4 w-4 text-legal-blue" /> {evidence}</div>)}
                    {!hearing.evidenceTitles.length ? <p className="px-4 py-3 text-sm text-slate-500">Sin pruebas asociadas.</p> : null}
                  </div>
                  <form onSubmit={addEvidence} className="mt-3 flex flex-wrap items-end gap-3">
                    <Field label="Agregar prueba"><input name="evidence" className={inputClass} placeholder="Ej. Dictamen pericial, interrogatorio, contrato..." /></Field>
                    <Button type="submit" variant="secondary"><FileText className="h-4 w-4" /> Agregar</Button>
                  </form>
                </div>
              </div>
            </Card>
          </section>

          <Card>
            <CardHeader title="Preparacion y post-audiencia" subtitle="Teoria del caso, resultado posterior y documentos vinculados." />
            <form onSubmit={savePreparation} className="grid gap-4 p-5 md:grid-cols-2">
              <Field label="Estado"><select name="status" defaultValue={hearing.status} className={inputClass}><option>Programada</option><option>Confirmada</option><option>Realizada</option><option>Aplazada</option></select></Field>
              <Field label="Expediente"><input value={legalCase?.name ?? "Sin expediente"} readOnly className={inputClass} /></Field>
              <div className="md:col-span-2"><Field label="Objetivo"><textarea name="objective" defaultValue={hearing.objective} className={`${inputClass} min-h-20 py-3`} /></Field></div>
              <div className="md:col-span-2"><Field label="Teoria del caso"><textarea name="caseTheory" defaultValue={hearing.caseTheory} className={`${inputClass} min-h-24 py-3`} /></Field></div>
              <div className="md:col-span-2"><Field label="Resultado posterior"><textarea name="result" defaultValue={hearing.result} className={`${inputClass} min-h-20 py-3`} placeholder="Registra acuerdos, decisiones, ordenes y proximas actuaciones" /></Field></div>
              <div className="md:col-span-2"><Button type="submit"><Save className="h-4 w-4" /> Guardar audiencia</Button></div>
            </form>
          </Card>

          <Card>
            <CardHeader title="IA para preparar audiencia" subtitle="Sugerencias bajo demanda basadas en expediente, documentos, pruebas y checklist." />
            <div className="p-5">
              <AIResponsePanel embedded type="hearing" button="Preparar con IA" source={`Audiencia ${hearing.type}, expediente ${legalCase?.name ?? "sin expediente"}, ${linkedDocuments.length} documentos asociados, ${hearing.evidenceTitles.length} pruebas y checklist visible.`} />
            </div>
          </Card>

          {hasResult ? <Card>
            <CardHeader title="Actuacion posterior" subtitle="Registra el resultado como actuacion dentro del expediente." />
            <div className="p-5">
              {resultProceeding ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex flex-wrap items-center gap-2"><Badge tone="green">Actuacion registrada</Badge><Badge>{resultProceeding.origin}</Badge></div>
                <p className="mt-3 font-bold text-slate-950">{resultProceeding.title}</p>
                <p className="mt-1 text-sm leading-6 text-emerald-900">{resultProceeding.description}</p>
                {legalCase ? <Link href={`/cases/${legalCase.id}`} className="mt-4 inline-flex text-sm font-bold text-legal-blue">Abrir expediente</Link> : null}
              </div> : <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-bold text-blue-950">Resultado listo para convertirse en actuacion.</p>
                <p className="mt-1 text-sm leading-6 text-blue-900">{hearing.result}</p>
                <Button className="mt-4" onClick={registerPostHearingProceeding}><Gavel className="h-4 w-4" /> Registrar actuacion posterior</Button>
              </div>}
            </div>
          </Card> : null}

          <section className="grid gap-5 xl:grid-cols-2">
            <Card>
              <CardHeader title="Preguntas para testigos" />
              <div className="divide-y divide-legal-line">{hearing.witnessQuestions.length ? hearing.witnessQuestions.map((question) => <p key={question} className="px-5 py-3 text-sm text-slate-700">{question}</p>) : <p className="p-5 text-sm text-slate-500">Sin preguntas registradas.</p>}</div>
              <form onSubmit={addQuestion} className="flex flex-wrap items-end gap-3 border-t border-legal-line p-5"><Field label="Nueva pregunta"><input name="question" required className={inputClass} /></Field><Button type="submit"><MessageSquarePlus className="h-4 w-4" /> Agregar</Button></form>
            </Card>

            <Card>
              <CardHeader title="Terminos derivados" subtitle="Plazos que nacen de decisiones, acuerdos u ordenes de la audiencia." />
              <div className="divide-y divide-legal-line">{hearing.derivedDeadlines.length ? hearing.derivedDeadlines.map((deadline) => <div key={deadline.id} className="px-5 py-3 text-sm"><p className="font-bold text-slate-900">{deadline.title}</p><p className="text-slate-500">{deadline.date} - {deadline.owner}</p></div>) : <p className="p-5 text-sm text-slate-500">Sin terminos derivados.</p>}</div>
              <form onSubmit={addDeadline} className="grid gap-3 border-t border-legal-line p-5 md:grid-cols-2">
                <Field label="Termino"><input name="title" required className={inputClass} placeholder="Ej. Presentar memorial posterior" /></Field>
                <Field label="Tipo"><input name="type" defaultValue="Termino derivado de audiencia" className={inputClass} /></Field>
                <Field label="Fecha limite"><input name="date" type="date" required className={inputClass} /></Field>
                <Field label="Hora"><input name="time" type="time" defaultValue="17:00" className={inputClass} /></Field>
                <Field label="Responsable"><select name="owner" defaultValue={legalCase?.internalOwner ?? ""} className={inputClass}>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field>
                <Field label="Riesgo"><select name="priority" defaultValue="Alta" className={inputClass}><option>Baja</option><option>Media</option><option>Alta</option></select></Field>
                <div className="md:col-span-2"><Field label="Consecuencia"><textarea name="consequence" className={`${inputClass} min-h-20 py-3`} placeholder="Que pasa si no se atiende este termino" /></Field></div>
                <div className="md:col-span-2"><Button type="submit"><CalendarPlus className="h-4 w-4" /> Crear termino derivado</Button></div>
              </form>
            </Card>

            <Card>
              <CardHeader title="Tareas derivadas" subtitle="Acciones operativas que nacen de la audiencia." />
              <div className="divide-y divide-legal-line">{derivedTasks.length ? derivedTasks.map((task) => <div key={task.id} className="px-5 py-3 text-sm"><div className="flex flex-wrap items-center gap-2"><Badge tone={task.priority === "Alta" ? "red" : task.priority === "Media" ? "amber" : "slate"}>{task.priority}</Badge><Badge>{task.status}</Badge></div><p className="mt-2 font-bold text-slate-900">{task.title}</p><p className="text-slate-500">{task.dueDate} - {task.owner}</p></div>) : <p className="p-5 text-sm text-slate-500">Sin tareas derivadas.</p>}</div>
              <form onSubmit={addDerivedTask} className="grid gap-3 border-t border-legal-line p-5 md:grid-cols-2">
                <Field label="Tarea"><input name="title" required className={inputClass} placeholder="Ej. Preparar memorial de cumplimiento" /></Field>
                <Field label="Fecha limite"><input name="dueDate" type="date" defaultValue={hearing.date} className={inputClass} /></Field>
                <Field label="Responsable"><select name="owner" defaultValue={legalCase?.internalOwner ?? ""} className={inputClass}>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field>
                <Field label="Prioridad"><select name="priority" defaultValue="Media" className={inputClass}><option>Baja</option><option>Media</option><option>Alta</option></select></Field>
                <div className="md:col-span-2"><Field label="Nota"><textarea name="comment" className={`${inputClass} min-h-16 py-3`} placeholder="Contexto de la tarea derivada" /></Field></div>
                <div className="md:col-span-2"><Button type="submit"><ClipboardCheck className="h-4 w-4" /> Crear tarea derivada</Button></div>
              </form>
            </Card>
          </section>
        </div>

        <div className="space-y-5">
          <Card className="p-5"><Gavel className="h-5 w-5 text-legal-blue" /><p className="mt-4 text-sm font-semibold text-slate-600">Expediente</p><p className="mt-1 font-bold text-slate-950">{legalCase?.name}</p>{legalCase ? <div className="mt-2"><Badge>{legalCase.legalArea}</Badge></div> : null}{legalCase ? <Link href={`/cases/${legalCase.id}`} className="mt-3 inline-flex text-sm font-bold text-legal-blue">Abrir expediente</Link> : null}</Card>
          <Card className="p-5"><p className="text-sm font-semibold text-slate-600">Equipo de audiencia</p><p className="mt-3 text-sm font-bold text-slate-950">{hearing.responsibleLawyer ?? legalCase?.internalOwner}</p><p className="mt-1 text-xs text-slate-500">Abogado responsable</p><p className="mt-3 text-sm font-bold text-slate-950">{hearing.assistantOwner ?? legalCase?.assistantOwner ?? "Sin auxiliar"}</p><p className="mt-1 text-xs text-slate-500">Auxiliar asignado</p></Card>
          <Card>
            <CardHeader title="Acciones de audiencia" />
            <div className="grid gap-3 p-5">
              <Button variant="secondary" onClick={() => createPrepTask(`Preparar ${hearing.type}`)}><ClipboardCheck className="h-4 w-4" /> Crear tarea desde audiencia</Button>
              <Button variant="secondary" onClick={createQuickDerivedDeadline}><CalendarPlus className="h-4 w-4" /> Crear termino derivado</Button>
              <Button variant="secondary" onClick={registerResult}><Save className="h-4 w-4" /> Registrar resultado</Button>
              {hasResult ? <Button variant="secondary" onClick={registerPostHearingProceeding} disabled={Boolean(resultProceeding)}><Gavel className="h-4 w-4" /> Registrar actuacion posterior</Button> : null}
            </div>
          </Card>
          <Card className="p-5"><Link2 className="h-5 w-5 text-emerald-600" /><p className="mt-4 text-sm font-semibold text-slate-600">Accesos</p>{hearing.link ? <a href={hearing.link} className="mt-2 block break-all text-sm font-bold text-legal-blue">{hearing.link}</a> : <p className="mt-2 text-sm text-slate-500">Audiencia presencial</p>}</Card>
          <Card>
            <CardHeader title="Tareas previas" />
            <div className="space-y-3 p-5">{hearing.preparationTasks.length ? hearing.preparationTasks.map((task) => <div key={task} className="rounded-lg border border-legal-line bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-800">{task}</p><Button className="mt-3" variant="secondary" onClick={() => createPrepTask(task)}><CheckCircle2 className="h-4 w-4" /> Crear tarea</Button></div>) : <p className="text-sm text-slate-500">Sin tareas previas sugeridas.</p>}</div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3"><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-white">{value}</p></div>;
}
