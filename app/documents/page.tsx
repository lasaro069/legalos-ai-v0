"use client";

import Link from "next/link";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, CalendarSearch, FileCheck2, FileText, FileUp, FolderKanban, Search, SquareCheckBig } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, Field, Modal, inputClass } from "@/components/ui";
import { resolveSource } from "@/lib/source-resolver";
import { useLegalStore } from "@/lib/store";
import { DocumentAssociation, DocumentCategory, DocumentStatus, DocumentType, LegalDocument } from "@/types";

const statusTone = { Pendiente: "amber", "En revision": "blue", Analizado: "green", Firmado: "green", Radicado: "slate" } as const;

export default function DocumentsPage() {
  const { documents, cases, clients, hearings, team, addCaseDocument, caseName } = useLegalStore();
  const [showUpload, setShowUpload] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [ownerFilter, setOwnerFilter] = useState("Todos");
  const [association, setAssociation] = useState<DocumentAssociation>("Expediente");
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id ?? "");
  const [selectedUploadFile, setSelectedUploadFile] = useState<{ name: string; size: number } | null>(null);
  const analyzed = documents.filter((doc) => doc.status === "Analizado").length;
  const detectedDates = documents.reduce((sum, doc) => sum + doc.importantDates.length, 0);
  const criticalFindings = documents.flatMap((doc) => doc.findings).filter((finding) => finding.priority === "Alta").length;
  const selectedCase = cases.find((legalCase) => legalCase.id === selectedCaseId);
  const caseOwner = (caseId: string) => cases.find((legalCase) => legalCase.id === caseId)?.internalOwner ?? "Sin responsable";

  const filtered = useMemo(() => documents.filter((doc) => {
    const source = resolveSource(doc, { cases, documents, hearings });
    const owner = cases.find((legalCase) => legalCase.id === doc.caseId)?.internalOwner ?? "";
    const assistant = cases.find((legalCase) => legalCase.id === doc.caseId)?.assistantOwner ?? "";
    const text = `${doc.title} ${doc.type} ${doc.category} ${source.label} ${caseName(doc.caseId)} ${doc.status} ${owner} ${assistant}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesStatus = status === "Todos" || doc.status === status;
    const matchesOwner = ownerFilter === "Todos" || owner === ownerFilter || assistant === ownerFilter;
    return matchesQuery && matchesStatus && matchesOwner;
  }), [caseName, cases, documents, hearings, ownerFilter, query, status]);

  function submitDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");
    const uploadedFile = file instanceof File && file.name ? file : null;
    const title = String(form.get("title") || uploadedFile?.name || "Documento sin titulo");
    const type = String(form.get("type")) as DocumentType;
    const caseId = String(form.get("caseId"));
    const associationValue = String(form.get("association")) as DocumentAssociation;
    const clientId = String(form.get("clientId") || "") || undefined;
    const proceedingId = String(form.get("proceedingId") || "") || undefined;
    const hearingId = String(form.get("hearingId") || "") || undefined;
    const sourceType: LegalDocument["sourceType"] = proceedingId ? "Actuacion" : hearingId ? "Audiencia" : associationValue === "Cliente" ? "Cliente" : "Expediente";
    addCaseDocument({
      title,
      type,
      category: String(form.get("category")) as DocumentCategory,
      caseId,
      association: associationValue,
      clientId,
      proceedingId,
      sourceType,
      sourceId: proceedingId || hearingId || clientId || caseId,
      hearingId,
      status: String(form.get("status")) as DocumentStatus,
      summary: String(form.get("summary") || (uploadedFile ? `Archivo cargado manualmente. Tamano: ${formatBytes(uploadedFile.size)}. Pendiente de revision juridica.` : "")),
      importantDates: String(form.get("detectedDate"))
        ? [{ id: `dd-${Date.now()}`, label: "Fecha detectada", date: String(form.get("detectedDate")), detail: String(form.get("dateDetail")), convertedToDeadline: false }]
        : [],
      findings: String(form.get("finding"))
        ? [{ id: `df-${Date.now()}`, title: String(form.get("finding")), detail: String(form.get("findingDetail")), priority: "Media", convertedToTask: false }]
        : []
    });
    setSelectedUploadFile(null);
    setShowUpload(false);
  }

  function updateSelectedUploadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setSelectedUploadFile(file ? { name: file.name, size: file.size } : null);
  }

  return (
    <AppShell>
      <Header title="Documentos" subtitle="Archivos asociados a expedientes, fechas relevantes, hallazgos y acciones derivadas." action={<Button onClick={() => setShowUpload(true)}><FileUp className="h-4 w-4" /> Subir documento</Button>} />
      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_360px] lg:p-8">
        <div className="space-y-5">
          <section className="grid gap-4 md:grid-cols-3">
            <Card className="p-4"><FileText className="h-5 w-5 text-rose-600" /><p className="mt-4 text-sm font-semibold text-slate-600">Documentos</p><p className="mt-2 text-3xl font-bold">{documents.length}</p><p className="text-xs text-slate-500">Soporte operativo</p></Card>
            <Card className="p-4"><CalendarSearch className="h-5 w-5 text-amber-600" /><p className="mt-4 text-sm font-semibold text-slate-600">Fechas detectadas</p><p className="mt-2 text-3xl font-bold">{detectedDates}</p><p className="text-xs text-slate-500">Posibles terminos para validar</p></Card>
            <Card className="p-4"><FileCheck2 className="h-5 w-5 text-emerald-600" /><p className="mt-4 text-sm font-semibold text-slate-600">Analizados</p><p className="mt-2 text-3xl font-bold">{analyzed}</p><p className="text-xs text-slate-500">Listos para decision juridica</p></Card>
          </section>

          <Card className="border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-4"><AlertTriangle className="mt-1 h-5 w-5 text-amber-700" /><div><p className="font-bold text-amber-900">Hallazgos por convertir en accion</p><p className="mt-1 text-sm leading-6 text-amber-800">Hay {criticalFindings} hallazgos de prioridad alta. Abre el documento para crear tareas o posibles terminos sujetos a validacion.</p></div></div>
          </Card>

          <Card>
            <CardHeader title="Filtros documentales" subtitle="Busca por expediente, tipo, categoria o estado." />
            <div className="flex flex-wrap items-center gap-3 p-4">
              <div className="relative min-w-72 flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className={`${inputClass} w-full pl-9`} placeholder="Buscar documento, expediente, responsable o tipo..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
              <select className={inputClass} value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}><option>Todos</option>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select>
              <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}><option>Todos</option><option>Pendiente</option><option>En revision</option><option>Analizado</option><option>Firmado</option><option>Radicado</option></select>
            </div>
          </Card>

          {showUpload ? <Modal title="Subir documento" onClose={() => setShowUpload(false)}>
            <form onSubmit={submitDocument} className="grid gap-4">
              <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-blue-950">Archivo</p>
                    <p className="mt-1 text-xs leading-5 text-blue-800">Carga el soporte y clasificalo juridicamente.</p>
                  </div>
                  <label className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                    <FileUp className="h-4 w-4" />
                    Seleccionar archivo
                    <input name="file" type="file" className="sr-only" onChange={updateSelectedUploadFile} />
                  </label>
                </div>
                {selectedUploadFile ? <p className="mt-3 rounded-md bg-white p-3 text-sm font-semibold text-slate-800">{selectedUploadFile.name} · {formatBytes(selectedUploadFile.size)}</p> : null}
              </div>
              <Field label="Nombre del documento" hint="Si cargas archivo, puede tomar el nombre del archivo."><input name="title" className={inputClass} placeholder="Nuevo_memorial_revision.pdf" /></Field>
              <Field label="Asociar a"><select name="association" className={inputClass} value={association} onChange={(event) => setAssociation(event.target.value as DocumentAssociation)}><option>Expediente</option><option>Cliente</option><option>Actuacion</option></select></Field>
              <Field label="Expediente base" hint="Se conserva como ancla juridica del documento."><select name="caseId" className={inputClass} value={selectedCaseId} onChange={(event) => setSelectedCaseId(event.target.value)}>{cases.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
              {association === "Cliente" ? <Field label="Cliente vinculado"><select name="clientId" className={inputClass}><option value="">Seleccionar cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></Field> : null}
              {association === "Actuacion" ? <Field label="Actuacion relacionada"><select name="proceedingId" className={inputClass}><option value="">Seleccionar actuacion</option>{(selectedCase?.proceedings ?? []).map((proceeding) => <option key={proceeding.id} value={proceeding.id}>{proceeding.date} - {proceeding.title}</option>)}</select></Field> : null}
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Tipo"><select name="type" className={inputClass}><option>Demanda</option><option>Contestacion</option><option>Poder</option><option>Memorial</option><option>Auto</option><option>Sentencia</option><option>Contrato</option><option>Prueba</option><option>Anexo</option><option>Comunicacion</option><option>Otro</option></select></Field>
                <Field label="Clasificacion"><select name="category" className={inputClass}><option>Documento</option><option>Prueba</option><option>Anexo</option><option>Comunicacion</option></select></Field>
                <Field label="Estado"><select name="status" className={inputClass}><option>Pendiente</option><option>En revision</option><option>Analizado</option><option>Firmado</option><option>Radicado</option></select></Field>
                <Field label="Audiencia vinculada"><select name="hearingId" className={inputClass}><option value="">Sin audiencia</option>{hearings.map((hearing) => <option key={hearing.id} value={hearing.id}>{hearing.type} - {hearing.date}</option>)}</select></Field>
              </div>
              <Field label="Resumen"><textarea name="summary" className={`${inputClass} min-h-20 py-3`} placeholder="Que contiene y para que sirve dentro del expediente" /></Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Fecha detectada"><input name="detectedDate" className={inputClass} placeholder="12/06/2026" /></Field>
                <Field label="Detalle de fecha"><input name="dateDetail" className={inputClass} placeholder="Posible termino, audiencia o radicacion" /></Field>
              </div>
              <Field label="Hallazgo inicial"><input name="finding" className={inputClass} placeholder="Riesgo, inconsistencia o tarea sugerida" /></Field>
              <Field label="Detalle del hallazgo"><input name="findingDetail" className={inputClass} /></Field>
              <Button type="submit">Guardar documento</Button>
            </form>
          </Modal> : null}

          <Card>
            <CardHeader title="Biblioteca operativa" subtitle="Cada documento abre detalle, fechas, hallazgos y acciones." />
            <div className="grid gap-4 p-5 lg:grid-cols-2">
              {filtered.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} caseName={caseName} caseOwner={caseOwner} source={resolveSource(doc, { cases, documents, hearings })} />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Matriz documental por expediente" subtitle="Diferencia documentos, pruebas, anexos y comunicaciones." />
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {cases.map((legalCase) => {
                const caseDocs = documents.filter((doc) => doc.caseId === legalCase.id);
                return <div key={legalCase.id} className="rounded-lg border border-legal-line bg-slate-50 p-4"><p className="font-bold text-slate-950">{legalCase.name}</p><div className="mt-3 grid gap-2 text-sm text-slate-700"><MatrixRow label="Documentos" value={caseDocs.filter((doc) => doc.category === "Documento").length} /><MatrixRow label="Pruebas" value={caseDocs.filter((doc) => doc.category === "Prueba").length} /><MatrixRow label="Anexos" value={caseDocs.filter((doc) => doc.category === "Anexo").length} /><MatrixRow label="Comunicaciones" value={caseDocs.filter((doc) => doc.category === "Comunicacion").length} /></div></div>;
              })}
            </div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card className="p-5">
            <FolderKanban className="h-5 w-5 text-legal-blue" />
            <p className="mt-4 text-sm font-semibold text-slate-600">Uso operativo</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Cada documento debe quedar conectado a expediente, cliente o actuacion. Las fechas detectadas son posibles terminos y requieren validacion del abogado.</p>
          </Card>
          <Card>
            <CardHeader title="Acciones esperadas" />
            <div className="space-y-3 p-5">
              {["Clasificar documento", "Validar fechas detectadas", "Crear tarea desde hallazgo", "Asociar a audiencia si aplica"].map((item) => <div key={item} className="flex items-center gap-3 rounded-lg border border-legal-line bg-slate-50 p-3 text-sm font-semibold text-slate-800"><SquareCheckBig className="h-4 w-4 text-emerald-600" /> {item}</div>)}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function DocumentSignal({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-slate-50 p-3"><p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{label}</p><p className="mt-1 text-lg font-bold text-slate-950">{value}</p></div>;
}

function DocumentCard({ doc, caseName, caseOwner, source }: { doc: LegalDocument; caseName: (id: string) => string; caseOwner: (id: string) => string; source: ReturnType<typeof resolveSource> }) {
  return (
    <div className="rounded-lg border border-legal-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-legal-blue hover:shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2"><Badge tone={statusTone[doc.status]}>{doc.status}</Badge><Badge>{doc.association ?? "Expediente"}</Badge><Badge>{doc.type}</Badge><Badge tone={doc.category === "Prueba" ? "red" : doc.category === "Anexo" ? "amber" : doc.category === "Comunicacion" ? "slate" : "blue"}>{doc.category}</Badge></div>
          <h3 className="mt-3 font-bold text-slate-950">{doc.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{caseName(doc.caseId)} - {doc.date}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">Responsable: {caseOwner(doc.caseId)}</p>
          <p className="mt-1 text-xs font-semibold text-slate-600">Origen: {source.label}</p>
        </div>
        <FileText className="h-5 w-5 text-legal-blue" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <DocumentSignal label="Fechas" value={String(doc.importantDates.length)} />
        <DocumentSignal label="Hallazgos" value={String(doc.findings.length)} />
      </div>
      <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-900">
        <p className="font-bold">Origen: {source.label}</p>
        <p>{source.detail}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/documents/${doc.id}`} className="inline-flex min-h-9 items-center justify-center gap-1 rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Abrir documento <ArrowRight className="h-4 w-4" /></Link>
        {source.caseHref ? <Link href={source.caseHref} className="inline-flex min-h-9 items-center justify-center rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Expediente</Link> : null}
        {source.href && source.href !== `/documents/${doc.id}` && source.href !== source.caseHref ? <Link href={source.href} className="inline-flex min-h-9 items-center justify-center rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Fuente</Link> : null}
      </div>
    </div>
  );
}

function MatrixRow({ label, value }: { label: string; value: number }) {
  return <div className="flex items-center justify-between rounded-md bg-white px-3 py-2"><span>{label}</span><strong>{value}</strong></div>;
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
