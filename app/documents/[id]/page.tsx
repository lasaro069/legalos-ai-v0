"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowLeft, CalendarPlus, CheckCircle2, FileText, Gavel, Link2, Save, SquareCheckBig } from "lucide-react";
import { DocumentAIAnalysisPanel } from "@/components/document-ai-analysis";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, EmptyState, Field, inputClass } from "@/components/ui";
import { resolveSource } from "@/lib/source-resolver";
import { useLegalStore } from "@/lib/store";
import { DocumentStatus, DocumentType, ProceedingType } from "@/types";

const statusTone = { Pendiente: "amber", "En revision": "blue", Analizado: "green", Firmado: "green", Radicado: "slate" } as const;

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getDocument, getCase, cases, documents, clients, hearings, team, updateDocument, convertDocumentDateToDeadline, convertDocumentFindingToTask, createProceedingFromDocument } = useLegalStore();
  const [showProceedingForm, setShowProceedingForm] = useState(false);
  const document = getDocument(id);

  if (!document) {
    return (
      <AppShell>
        <Header title="Documento no encontrado" subtitle="No existe en la biblioteca documental." />
        <div className="p-8"><EmptyState title="Sin documento" description="Abre un documento desde la biblioteca documental." /></div>
      </AppShell>
    );
  }

  const legalCase = getCase(document.caseId);
  const linkedHearing = hearings.find((hearing) => hearing.id === document.hearingId);
  const linkedClient = clients.find((client) => client.id === document.clientId);
  const linkedProceeding = legalCase?.proceedings?.find((proceeding) => proceeding.id === document.proceedingId);
  const resolvedSource = resolveSource(document, { cases, documents, hearings });
  const categoryTone = document.category === "Prueba" ? "red" : document.category === "Anexo" ? "amber" : document.category === "Comunicacion" ? "slate" : "blue";
  const suggestedProceedingType = proceedingTypeFromDocument(document.type);

  function submitProceeding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!document) return;
    const form = new FormData(event.currentTarget);
    const created = createProceedingFromDocument(document.id, {
      type: String(form.get("type")) as ProceedingType,
      title: String(form.get("title")),
      date: String(form.get("date")),
      description: String(form.get("description")),
      owner: String(form.get("owner")),
      createsTerm: form.get("createsTerm") === "on"
    });
    if (created) setShowProceedingForm(false);
  }

  return (
    <AppShell>
      <Header title={document.title} subtitle={`${document.type} - ${legalCase?.name ?? "Sin expediente"}`} action={<Link href="/documents" className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /> Volver</Link>} />
      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_360px] lg:p-8">
        <div className="space-y-5">
          <Card className="overflow-hidden border-slate-800 bg-legal-obsidian text-white shadow-executive">
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2"><Badge tone={statusTone[document.status]}>{document.status}</Badge><Badge tone={categoryTone}>{document.category}</Badge><Badge>{document.association ?? "Expediente"}</Badge><Badge>{document.type}</Badge></div>
              <h2 className="mt-5 text-2xl font-bold">{document.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{document.summary}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Info label="Expediente" value={legalCase?.name ?? ""} />
                <Info label="Fecha ingreso" value={document.date} />
                <Info label="Origen" value={resolvedSource.label} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Estado del documento" subtitle="Avanza el documento segun su ciclo juridico." />
            <form className="flex flex-wrap items-end gap-3 p-5" onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              updateDocument(document.id, { status: String(form.get("status")) as DocumentStatus, hearingId: String(form.get("hearingId") || "") || undefined });
            }}>
              <Field label="Estado"><select name="status" className={inputClass} defaultValue={document.status}><option>Pendiente</option><option>En revision</option><option>Analizado</option><option>Firmado</option><option>Radicado</option></select></Field>
              <Field label="Audiencia vinculada"><select name="hearingId" className={inputClass} defaultValue={document.hearingId ?? ""}><option value="">Sin audiencia</option>{hearings.filter((hearing) => hearing.caseId === document.caseId).map((hearing) => <option key={hearing.id} value={hearing.id}>{hearing.type} - {hearing.date}</option>)}</select></Field>
              <Button type="submit"><Save className="h-4 w-4" /> Guardar estado</Button>
            </form>
          </Card>

          <DocumentAIAnalysisPanel documentTitle={document.title} />

          <Card>
            <CardHeader title="Actuacion desde documento" subtitle="Convierte este documento en historia procesal del expediente." action={!linkedProceeding ? <Button variant="secondary" onClick={() => setShowProceedingForm((current) => !current)}><Gavel className="h-4 w-4" /> Crear actuacion</Button> : null} />
            {linkedProceeding ? <div className="p-5">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex flex-wrap items-center gap-2"><Badge tone="green">Actuacion creada</Badge><Badge>{linkedProceeding.type}</Badge></div>
                <p className="mt-3 font-bold text-slate-950">{linkedProceeding.title}</p>
                <p className="mt-1 text-sm leading-6 text-emerald-900">{linkedProceeding.description}</p>
                {legalCase ? <Link href={`/cases/${legalCase.id}`} className="mt-4 inline-flex text-sm font-bold text-legal-blue">Abrir expediente</Link> : null}
              </div>
            </div> : null}
            {showProceedingForm && !linkedProceeding ? <form onSubmit={submitProceeding} className="grid gap-4 border-t border-legal-line p-5 md:grid-cols-2">
              <div className="md:col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
                <p className="font-bold">Origen: Documento</p>
                <p>La actuacion quedara conectada a {document.title} y visible dentro del expediente.</p>
              </div>
              <Field label="Tipo de actuacion"><select name="type" className={inputClass} defaultValue={suggestedProceedingType}><option>Demanda</option><option>Contestacion</option><option>Auto</option><option>Sentencia</option><option>Recurso</option><option>Notificacion</option><option>Audiencia</option><option>Memorial</option><option>Otra</option></select></Field>
              <Field label="Titulo"><input name="title" required className={inputClass} defaultValue={document.title} /></Field>
              <Field label="Fecha"><input name="date" required className={inputClass} defaultValue={document.date} /></Field>
              <Field label="Responsable"><select name="owner" className={inputClass} defaultValue={legalCase?.internalOwner ?? ""}>{team.filter((member) => member.role === "Propietario" || member.role === "Abogado").map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 md:col-span-2"><input name="createsTerm" type="checkbox" /> Puede generar termino</label>
              <div className="md:col-span-2"><Field label="Descripcion"><textarea name="description" required className={`${inputClass} min-h-24 py-3`} defaultValue={document.summary} /></Field></div>
              <div className="flex flex-wrap gap-3 md:col-span-2"><Button type="submit"><Save className="h-4 w-4" /> Crear actuacion desde documento</Button><Button type="button" variant="secondary" onClick={() => setShowProceedingForm(false)}>Cancelar</Button></div>
            </form> : null}
          </Card>

          <section className="grid gap-5 xl:grid-cols-2">
            <Card>
              <CardHeader title="Fechas importantes" subtitle="Convierte fechas detectadas en posibles terminos para revision." />
              <div className="divide-y divide-legal-line">
                {document.importantDates.map((item) => <div key={item.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-slate-950">{item.label}</p><p className="mt-1 text-sm text-slate-500">{item.date} - {item.detail}</p></div><Badge tone={item.convertedToDeadline ? "green" : "amber"}>{item.convertedToDeadline ? "Termino creado" : "Pendiente"}</Badge></div>
                  <Button className="mt-4" variant="secondary" disabled={item.convertedToDeadline} onClick={() => convertDocumentDateToDeadline(document.id, item.id)}><CalendarPlus className="h-4 w-4" /> Crear termino</Button>
                </div>)}
                {!document.importantDates.length ? <p className="p-5 text-sm text-slate-500">Sin fechas detectadas.</p> : null}
              </div>
            </Card>

            <Card>
              <CardHeader title="Hallazgos" subtitle="Convierte hallazgos en tareas operativas." />
              <div className="divide-y divide-legal-line">
                {document.findings.map((item) => <div key={item.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-slate-950">{item.title}</p><p className="mt-1 text-sm leading-6 text-slate-500">{item.detail}</p></div><Badge tone={item.priority === "Alta" ? "red" : item.priority === "Media" ? "amber" : "green"}>{item.priority}</Badge></div>
                  <Button className="mt-4" variant="secondary" disabled={item.convertedToTask} onClick={() => convertDocumentFindingToTask(document.id, item.id)}><SquareCheckBig className="h-4 w-4" /> Crear tarea</Button>
                  {item.convertedToTask ? <span className="ml-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Tarea creada</span> : null}
                </div>)}
                {!document.findings.length ? <p className="p-5 text-sm text-slate-500">Sin hallazgos registrados.</p> : null}
              </div>
            </Card>
          </section>
        </div>

        <div className="space-y-5">
          <Card className="p-5"><FileText className="h-5 w-5 text-legal-blue" /><p className="mt-4 text-sm font-semibold text-slate-600">Clasificacion</p><p className="mt-1 text-2xl font-bold">{document.category}</p><p className="mt-1 text-sm text-slate-500">{document.type}</p><p className="mt-3 text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Asociado a</p><p className="mt-1 text-sm font-semibold text-slate-700">{document.association ?? "Expediente"}</p></Card>
          <Card className="p-5">
            <Link2 className="h-5 w-5 text-emerald-600" />
            <p className="mt-4 text-sm font-semibold text-slate-600">Conexiones</p>
            <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-950">
              <p className="font-bold">Origen: {resolvedSource.label}</p>
              <p className="text-xs text-blue-800">{resolvedSource.detail}</p>
            </div>
            <p className="mt-3 text-sm text-slate-500">Expediente: {legalCase?.filingNumber}</p>
            {linkedClient ? <p className="mt-2 text-sm text-slate-500">Cliente: {linkedClient.name}</p> : null}
            {linkedProceeding ? <p className="mt-2 text-sm text-slate-500">Actuacion: {linkedProceeding.title}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {resolvedSource.caseHref ? <Link href={resolvedSource.caseHref} className="inline-flex min-h-9 items-center justify-center rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Abrir expediente</Link> : null}
              {resolvedSource.href && resolvedSource.href !== resolvedSource.caseHref ? <Link href={resolvedSource.href} className="inline-flex min-h-9 items-center justify-center rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Abrir fuente</Link> : null}
              {linkedHearing ? <Link href={`/hearings/${linkedHearing.id}`} className="inline-flex min-h-9 items-center justify-center rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Abrir audiencia</Link> : null}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3"><p className="text-xs font-bold uppercase text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-white">{value}</p></div>;
}

function proceedingTypeFromDocument(type: DocumentType): ProceedingType {
  if (type === "Demanda") return "Demanda";
  if (type === "Contestacion") return "Contestacion";
  if (type === "Auto") return "Auto";
  if (type === "Sentencia") return "Sentencia";
  if (type === "Memorial") return "Memorial";
  if (type === "Poder" || type === "Anexo" || type === "Prueba" || type === "Contrato") return "Memorial";
  return "Otra";
}
