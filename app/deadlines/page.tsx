"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, Edit3, FileSearch, Plus, Search, SquareCheckBig, TimerReset, XCircle } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, Field, Modal, inputClass } from "@/components/ui";
import { resolveSource } from "@/lib/source-resolver";
import { useLegalStore } from "@/lib/store";
import { ResolvedSource } from "@/lib/source-resolver";
import { CaseDeadline, DeadlineOrigin, Priority } from "@/types";

const priorityTone = { Alta: "red", Media: "amber", Baja: "green" } as const;
const statusTone = { Pendiente: "amber", Cumplido: "green", Vencido: "red", Cancelado: "slate" } as const;
const riskTone = { Alto: "red", Medio: "amber", Bajo: "green" } as const;
const views = ["Criticos", "Vencidos", "Hoy", "Semana", "Mes", "Todos", "Cumplidos", "Cancelados"];

function parseLegalDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T12:00:00`);
  const [day, month, year] = value.split("/");
  return new Date(`${year}-${month}-${day}T12:00:00`);
}

function daysRemaining(date: string) {
  const today = new Date("2026-06-09T12:00:00");
  const target = parseLegalDate(date);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

function effectiveStatus(term: CaseDeadline) {
  if (term.status === "Cumplido" || term.status === "Cancelado") return term.status;
  return daysRemaining(term.date) < 0 ? "Vencido" : term.status;
}

function riskOf(term: CaseDeadline) {
  const days = daysRemaining(term.date);
  if (effectiveStatus(term) === "Vencido" || term.priority === "Alta" || days <= 1) return "Alto";
  if (days <= 3 || term.priority === "Media") return "Medio";
  return "Bajo";
}

function daysLabel(term: CaseDeadline) {
  const days = daysRemaining(term.date);
  if (effectiveStatus(term) === "Cumplido") return "Cumplido";
  if (effectiveStatus(term) === "Cancelado") return "Cancelado";
  if (days < 0) return `${Math.abs(days)} dia(s) vencido`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence manana";
  return `Faltan ${days} dias`;
}

function originTone(origin: DeadlineOrigin): "blue" | "green" | "amber" | "red" | "slate" {
  if (origin === "Sugerencia IA") return "blue";
  if (origin === "Documento") return "green";
  if (origin === "Audiencia") return "amber";
  if (origin === "Actuacion") return "slate";
  return "slate";
}

function legalClassification(term: CaseDeadline) {
  if (term.origin === "Sugerencia IA") return "Posible termino";
  if (term.type.toLowerCase().includes("preparacion")) return "Termino operativo";
  return "Termino procesal";
}

export default function DeadlinesPage() {
  const { deadlines, cases, documents, hearings, team, addCaseDeadline, completeDeadline, cancelDeadline, updateDeadline, createTaskFromDeadline, caseName } = useLegalStore();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Criticos");
  const [ownerFilter, setOwnerFilter] = useState("Todos");
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<CaseDeadline | null>(null);
  const [canceling, setCanceling] = useState<CaseDeadline | null>(null);
  const [originTerm, setOriginTerm] = useState<CaseDeadline | null>(null);
  const [validating, setValidating] = useState<CaseDeadline | null>(null);
  const caseArea = useCallback((caseId?: string) => cases.find((legalCase) => legalCase.id === caseId)?.legalArea ?? "Sin area", [cases]);
  const resolveTermSource = useCallback((term: CaseDeadline) => resolveSource(term, { cases, documents, hearings, deadlines }), [cases, documents, hearings, deadlines]);

  const orderedTerms = useMemo(() => [...deadlines].sort((a, b) => parseLegalDate(a.date).getTime() - parseLegalDate(b.date).getTime()), [deadlines]);

  const visible = useMemo(() => orderedTerms.filter((term) => {
    const days = daysRemaining(term.date);
    const status = effectiveStatus(term);
    const risk = riskOf(term);
    const source = resolveTermSource(term);
    const text = `${term.title} ${term.type} ${term.origin} ${source.label} ${term.owner} ${caseName(term.caseId ?? "")} ${caseArea(term.caseId)} ${term.consequence}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesFilter =
      activeFilter === "Todos" ||
      (activeFilter === "Criticos" && (risk === "Alto" || days <= 3) && status !== "Cumplido" && status !== "Cancelado") ||
      (activeFilter === "Hoy" && days === 0) ||
      (activeFilter === "Semana" && days >= 0 && days <= 7) ||
      (activeFilter === "Mes" && days >= 0 && days <= 30) ||
      (activeFilter === "Vencidos" && status === "Vencido") ||
      (activeFilter === "Cumplidos" && status === "Cumplido") ||
      (activeFilter === "Cancelados" && status === "Cancelado");
    const matchesOwner = ownerFilter === "Todos" || term.owner === ownerFilter;
    return matchesQuery && matchesFilter && matchesOwner;
  }), [activeFilter, caseArea, caseName, orderedTerms, ownerFilter, query, resolveTermSource]);

  const critical = orderedTerms.filter((term) => {
    const days = daysRemaining(term.date);
    const status = effectiveStatus(term);
    return status !== "Cumplido" && status !== "Cancelado" && (status === "Vencido" || days <= 3 || term.priority === "Alta");
  });
  const nextSeven = orderedTerms.filter((term) => {
    const days = daysRemaining(term.date);
    return days >= 0 && days <= 7 && effectiveStatus(term) !== "Cancelado";
  });
  const overdue = orderedTerms.filter((term) => effectiveStatus(term) === "Vencido");
  const today = orderedTerms.filter((term) => daysRemaining(term.date) === 0 && effectiveStatus(term) === "Pendiente");
  const tomorrow = orderedTerms.filter((term) => daysRemaining(term.date) === 1 && effectiveStatus(term) === "Pendiente");
  const nextThree = orderedTerms.filter((term) => {
    const days = daysRemaining(term.date);
    return days >= 0 && days <= 3 && effectiveStatus(term) === "Pendiente";
  });

  function submitTerm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addCaseDeadline(String(form.get("caseId")), {
      title: String(form.get("title")),
      date: String(form.get("date")),
      time: String(form.get("time")),
      type: String(form.get("type")),
      origin: String(form.get("origin")) as DeadlineOrigin,
      priority: String(form.get("priority")) as Priority,
      owner: String(form.get("owner")),
      consequence: String(form.get("consequence"))
    });
    setShowNew(false);
  }

  function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    updateDeadline(editing.id, {
      title: String(form.get("title")),
      date: String(form.get("date")),
      time: String(form.get("time")),
      type: String(form.get("type")),
      origin: String(form.get("origin")) as DeadlineOrigin,
      priority: String(form.get("priority")) as Priority,
      owner: String(form.get("owner")),
      consequence: String(form.get("consequence"))
    });
    setEditing(null);
  }

  function submitCancel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canceling) return;
    const form = new FormData(event.currentTarget);
    cancelDeadline(canceling.id, String(form.get("reason")));
    setCanceling(null);
  }

  function validateAiSuggestion() {
    if (!validating) return;
    updateDeadline(validating.id, { origin: "Manual", sourceType: "Manual" });
    setValidating(null);
  }

  return (
    <AppShell>
      <Header
        title="Control de Terminos"
        subtitle="Terminos procesales con origen, responsable, riesgo y accion concreta."
        action={<Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4" /> Nuevo termino</Button>}
      />
      <div className="space-y-5 p-5 lg:p-8">
        <section className="grid gap-4 md:grid-cols-4">
          <CriticalCard icon={AlertTriangle} label="Vencidos" value={overdue.length} tone="red" />
          <CriticalCard icon={TimerReset} label="Vencen hoy" value={today.length} tone="red" />
          <CriticalCard icon={CalendarClock} label="Vencen manana" value={tomorrow.length} tone="amber" />
          <CriticalCard icon={CheckCircle2} label="Proximos 3 dias" value={nextThree.length} tone="blue" />
        </section>

        <Card>
          <CardHeader title="Terminos criticos" subtitle="Vencidos, de hoy, de manana y de los proximos 3 dias." />
          <div className="divide-y divide-legal-line">
            {critical.slice(0, 5).map((term) => (
              <TermRow key={term.id} term={term} caseName={caseName} caseArea={caseArea} resolveTermSource={resolveTermSource} compact onComplete={completeDeadline} onCancel={setCanceling} onTask={createTaskFromDeadline} onEdit={setEditing} onOrigin={setOriginTerm} />
            ))}
            {!critical.length ? <p className="p-5 text-sm text-slate-500">No hay terminos criticos pendientes.</p> : null}
          </div>
        </Card>

        <Card>
          <CardHeader title="Proximos 7 dias" subtitle="Vista cronologica de terminos proximos." />
          <div className="divide-y divide-legal-line">
            {nextSeven.slice(0, 7).map((term) => (
              <Link key={term.id} href={term.caseId ? `/cases/${term.caseId}` : "/deadlines"} className="grid gap-3 px-5 py-3.5 hover:bg-slate-50 md:grid-cols-[105px_1fr_160px_120px] md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{term.date}</p>
                  <p className="mt-1 text-sm font-bold text-slate-950">{term.time}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-950">{term.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{caseName(term.caseId ?? "")} - {caseArea(term.caseId)}</p>
                </div>
                <Badge tone={statusTone[effectiveStatus(term)]}>{daysLabel(term)}</Badge>
                <Badge tone={riskTone[riskOf(term)]}>{riskOf(term)}</Badge>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Vista juridica de terminos" subtitle="Tabla fija para revisar expediente, origen, fecha limite, responsable, riesgo y accion." />
          <div className="space-y-4 p-4">
            <div className="grid gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950 md:grid-cols-4">
              <LegendItem title="Termino procesal" detail="Plazo juridico que puede afectar el expediente." />
              <LegendItem title="Tarea interna" detail="Trabajo operativo; no sustituye el termino." />
              <LegendItem title="Audiencia" detail="Hito programado que puede generar terminos." />
              <LegendItem title="Actuacion" detail="Evento juridico que explica el origen." />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-72 flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input className={`${inputClass} w-full pl-9`} placeholder="Buscar por expediente, tipo, origen, responsable o consecuencia..." value={query} onChange={(event) => setQuery(event.target.value)} />
              </div>
              <select className={inputClass} value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}><option>Todos</option>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select>
              <div className="flex flex-wrap gap-2">
                {views.map((filter) => (
                  <button key={filter} className={`rounded-md border px-3 py-2 text-sm font-semibold ${activeFilter === filter ? "border-legal-blue bg-legal-blue text-white" : "border-legal-line bg-white text-slate-700 hover:bg-slate-50"}`} onClick={() => setActiveFilter(filter)}>
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <TermsTable terms={visible} caseName={caseName} caseArea={caseArea} resolveTermSource={resolveTermSource} onComplete={completeDeadline} onCancel={setCanceling} onTask={createTaskFromDeadline} onEdit={setEditing} onOrigin={setOriginTerm} onValidate={setValidating} />
        </Card>

        {showNew ? <Modal title="Nuevo termino" onClose={() => setShowNew(false)}><TermForm cases={cases} team={team} onSubmit={submitTerm} submitLabel="Guardar termino" /></Modal> : null}
        {editing ? <Modal title="Editar termino" onClose={() => setEditing(null)}><TermForm cases={cases} team={team} term={editing} onSubmit={submitEdit} submitLabel="Guardar cambios" /></Modal> : null}
        {canceling ? <Modal title="Cancelar termino" onClose={() => setCanceling(null)}>
          <form onSubmit={submitCancel} className="grid gap-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Cancelar un termino requiere justificacion. No se elimina del expediente.
            </div>
            <Field label="Justificacion"><textarea name="reason" required className={`${inputClass} min-h-24 py-3`} placeholder="Ej. El termino fue sustituido por nueva providencia / audiencia aplazada / error de captura validado." /></Field>
            <Button type="submit"><XCircle className="h-4 w-4" /> Cancelar con justificacion</Button>
          </form>
        </Modal> : null}
        {originTerm ? <Modal title="Origen del termino" onClose={() => setOriginTerm(null)}>
          <OriginModalContent term={originTerm} source={resolveTermSource(originTerm)} caseName={caseName} caseArea={caseArea} />
        </Modal> : null}
        {validating ? <Modal title="Validar sugerencia IA" onClose={() => setValidating(null)}>
          <div className="space-y-4 text-sm leading-6 text-slate-700">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-950">
              <p className="font-bold">Posible termino detectado</p>
              <p className="mt-1">{validating.title}</p>
              <p className="mt-1 text-xs">LegalOS no crea terminos automaticamente. El abogado debe validar fecha, origen, consecuencia y responsable.</p>
            </div>
            <p><strong>Expediente:</strong> {caseName(validating.caseId ?? "")}</p>
            <p><strong>Fecha limite:</strong> {validating.date} {validating.time}</p>
            <p><strong>Responsable:</strong> {validating.owner}</p>
            <p><strong>Riesgo:</strong> {validating.consequence}</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={validateAiSuggestion}><CheckCircle2 className="h-4 w-4" /> Validar termino</Button>
              <Button variant="secondary" onClick={() => { setEditing(validating); setValidating(null); }}><Edit3 className="h-4 w-4" /> Editar antes</Button>
            </div>
          </div>
        </Modal> : null}
      </div>
    </AppShell>
  );
}

function CriticalCard({ icon: Icon, label, value, tone }: { icon: typeof AlertTriangle; label: string; value: number; tone: "red" | "amber" | "blue" }) {
  const colors = tone === "red" ? "border-rose-200 bg-rose-50 text-rose-800" : tone === "amber" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-blue-200 bg-blue-50 text-blue-800";
  return (
    <Card className={`border ${colors} p-5`}>
      <Icon className="h-5 w-5" />
      <p className="mt-4 text-sm font-semibold">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </Card>
  );
}

function LegendItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div>
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-blue-800">{detail}</p>
    </div>
  );
}

function TermsTable({ terms, caseName, caseArea, resolveTermSource, onComplete, onCancel, onTask, onEdit, onOrigin, onValidate }: {
  terms: CaseDeadline[];
  caseName: (id: string) => string;
  caseArea: (id?: string) => string;
  resolveTermSource: (term: CaseDeadline) => ResolvedSource;
  onComplete: (id: string) => void;
  onCancel: (term: CaseDeadline) => void;
  onTask: (id: string) => void;
  onEdit: (term: CaseDeadline) => void;
  onOrigin: (term: CaseDeadline) => void;
  onValidate: (term: CaseDeadline) => void;
}) {
  return (
    <div className="overflow-x-auto border-t border-legal-line">
      <table className="w-full min-w-[1180px] text-left text-sm">
        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-[0.04em] text-slate-500">
          <tr>
            <th className="px-4 py-3">Expediente</th>
            <th className="px-4 py-3">Area</th>
            <th className="px-4 py-3">Termino</th>
            <th className="px-4 py-3">Origen</th>
            <th className="px-4 py-3">Fecha limite</th>
            <th className="px-4 py-3">Dias restantes</th>
            <th className="px-4 py-3">Responsable</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Riesgo</th>
            <th className="px-4 py-3">Accion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-legal-line">
          {terms.map((term) => {
            const status = effectiveStatus(term);
            const risk = riskOf(term);
            const source = resolveTermSource(term);
            const isAiSuggestion = term.origin === "Sugerencia IA";
            return (
              <tr key={`${term.id}-${term.status}`} className={isAiSuggestion ? "bg-blue-50/40" : "bg-white hover:bg-slate-50"}>
                <td className="px-4 py-4">
                  <Link href={term.caseId ? `/cases/${term.caseId}` : "/deadlines"} className="font-bold text-slate-950 hover:text-legal-blue">{caseName(term.caseId ?? "")}</Link>
                </td>
                <td className="px-4 py-4"><Badge>{caseArea(term.caseId)}</Badge></td>
                <td className="px-4 py-4">
                  <p className="font-bold text-slate-950">{term.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2"><Badge tone="blue">{legalClassification(term)}</Badge><Badge>{term.type}</Badge></div>
                </td>
                <td className="px-4 py-4">
                  <Badge tone={originTone(term.origin)}>{term.origin}</Badge>
                  <p className="mt-2 max-w-44 text-xs font-semibold leading-5 text-slate-600">Origen: {source.label}</p>
                  {isAiSuggestion ? <p className="mt-1 text-xs font-bold text-blue-700">Pendiente de validacion</p> : null}
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold text-slate-950">{term.date}</p>
                  <p className="text-xs text-slate-500">{term.time}</p>
                </td>
                <td className="px-4 py-4"><Badge tone={status === "Vencido" || daysRemaining(term.date) <= 1 ? "red" : daysRemaining(term.date) <= 3 ? "amber" : "green"}>{daysLabel(term)}</Badge></td>
                <td className="px-4 py-4 font-semibold text-slate-700">{term.owner}</td>
                <td className="px-4 py-4"><Badge tone={statusTone[status]}>{status}</Badge></td>
                <td className="px-4 py-4">
                  <Badge tone={riskTone[risk]}>{risk}</Badge>
                  <p className="mt-2 max-w-48 text-xs leading-5 text-slate-500">{term.consequence}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex max-w-56 flex-wrap gap-2">
                    {isAiSuggestion ? <Button onClick={() => onValidate(term)}><CheckCircle2 className="h-4 w-4" /> Validar</Button> : null}
                    {term.caseId ? <Link href={`/cases/${term.caseId}`} className="inline-flex min-h-9 items-center justify-center rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Expediente</Link> : null}
                    <Button variant="secondary" onClick={() => onTask(term.id)}><SquareCheckBig className="h-4 w-4" /> Tarea</Button>
                    <Button variant="secondary" onClick={() => onOrigin(term)}><FileSearch className="h-4 w-4" /> Origen</Button>
                    <Button variant="secondary" onClick={() => onEdit(term)}><Edit3 className="h-4 w-4" /> Editar</Button>
                    {status !== "Cumplido" && status !== "Cancelado" ? <Button variant="secondary" onClick={() => onComplete(term.id)}><CheckCircle2 className="h-4 w-4" /> Cumplido</Button> : null}
                    {status !== "Cancelado" && status !== "Cumplido" ? <Button variant="secondary" onClick={() => onCancel(term)}><XCircle className="h-4 w-4" /> Cancelar</Button> : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!terms.length ? <p className="p-5 text-sm text-slate-500">No hay terminos para el filtro seleccionado.</p> : null}
    </div>
  );
}

function TermRow({ term, caseName, caseArea, resolveTermSource, compact = false, onComplete, onCancel, onTask, onEdit, onOrigin }: {
  term: CaseDeadline;
  caseName: (id: string) => string;
  caseArea: (id?: string) => string;
  resolveTermSource: (term: CaseDeadline) => ResolvedSource;
  compact?: boolean;
  onComplete: (id: string) => void;
  onCancel: (term: CaseDeadline) => void;
  onTask: (id: string) => void;
  onEdit: (term: CaseDeadline) => void;
  onOrigin: (term: CaseDeadline) => void;
}) {
  const status = effectiveStatus(term);
  const risk = riskOf(term);
  const source = resolveTermSource(term);
  return (
    <div className="px-5 py-4 hover:bg-slate-50">
      <div className={`grid gap-4 ${compact ? "xl:grid-cols-[1fr_180px_170px_260px]" : "xl:grid-cols-[1.1fr_170px_150px_145px_145px_280px]"} xl:items-center`}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={riskTone[risk]}>{risk}</Badge>
            <Badge tone={statusTone[status]}>{status}</Badge>
            <Badge>{term.origin}</Badge>
            <Badge>{caseArea(term.caseId)}</Badge>
          </div>
          <h3 className="mt-3 font-bold text-slate-950">{term.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{caseName(term.caseId ?? "")}</p>
          <p className="mt-1 text-xs font-semibold text-slate-600">Origen: {source.label}</p>
        </div>
        <Cell label="Tipo" value={term.type} />
        <Cell label="Fecha limite" value={`${term.date} ${term.time}`} urgent={risk === "Alto"} />
        {!compact ? <Cell label="Dias restantes" value={daysLabel(term)} urgent={status === "Vencido" || daysRemaining(term.date) <= 1} /> : null}
        {!compact ? <Cell label="Responsable" value={term.owner} /> : null}
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => onTask(term.id)}><SquareCheckBig className="h-4 w-4" /> Tarea</Button>
          {term.caseId ? <Link href={`/cases/${term.caseId}`} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"><ArrowRight className="h-4 w-4" /> Expediente</Link> : null}
          {source.href ? <Link href={source.href} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"><FileSearch className="h-4 w-4" /> Fuente</Link> : null}
          <Button variant="secondary" onClick={() => onOrigin(term)}><FileSearch className="h-4 w-4" /> Origen</Button>
          <Button variant="secondary" onClick={() => onEdit(term)}><Edit3 className="h-4 w-4" /> Editar</Button>
          {status !== "Cumplido" && status !== "Cancelado" ? <Button onClick={() => onComplete(term.id)}><CheckCircle2 className="h-4 w-4" /> Cumplido</Button> : null}
          {status !== "Cancelado" && status !== "Cumplido" ? <Button variant="secondary" onClick={() => onCancel(term)}><XCircle className="h-4 w-4" /> Cancelar</Button> : null}
        </div>
      </div>
      {!compact ? <p className="mt-3 rounded-md bg-rose-50 p-3 text-sm leading-6 text-rose-800"><strong>Riesgo:</strong> {term.consequence}</p> : null}
      {term.cancellationReason ? <p className="mt-3 rounded-md bg-slate-100 p-3 text-sm leading-6 text-slate-700"><strong>Cancelado:</strong> {term.cancellationReason}</p> : null}
    </div>
  );
}

function OriginModalContent({ term, source, caseName, caseArea }: {
  term: CaseDeadline;
  source: ResolvedSource;
  caseName: (id: string) => string;
  caseArea: (id?: string) => string;
}) {
  return (
    <div className="space-y-4 text-sm leading-6 text-slate-700">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-950">
        <p className="text-xs font-bold uppercase tracking-[0.04em] text-blue-700">Origen</p>
        <p className="mt-1 font-bold">Origen: {source.label}</p>
        <p className="mt-1 text-xs">{source.detail}</p>
      </div>
      <p><strong>Tipo de origen:</strong> {source.type}</p>
      <p><strong>Expediente:</strong> {caseName(term.caseId ?? "")}</p>
      <p><strong>Area juridica:</strong> {caseArea(term.caseId)}</p>
      <p><strong>Consecuencia registrada:</strong> {term.consequence}</p>
      <div className="flex flex-wrap gap-2">
        {source.caseHref ? <Link href={source.caseHref} className="inline-flex min-h-9 items-center justify-center rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Abrir expediente</Link> : null}
        {source.href && source.href !== source.caseHref ? <Link href={source.href} className="inline-flex min-h-9 items-center justify-center rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Abrir fuente</Link> : null}
      </div>
      {term.origin === "Sugerencia IA" ? <p className="rounded-md bg-blue-50 p-3 text-blue-900">Posible termino detectado por IA. Requiere revision del abogado antes de actuar.</p> : null}
    </div>
  );
}

function Cell({ label, value, urgent = false }: { label: string; value: string; urgent?: boolean }) {
  return (
    <div className={urgent ? "rounded-md bg-rose-50 p-3" : "rounded-md bg-slate-50 p-3"}>
      <p className={urgent ? "text-xs font-bold uppercase tracking-[0.04em] text-rose-700" : "text-xs font-bold uppercase tracking-[0.04em] text-slate-400"}>{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function TermForm({ cases, team, term, onSubmit, submitLabel }: { cases: ReturnType<typeof useLegalStore>["cases"]; team: ReturnType<typeof useLegalStore>["team"]; term?: CaseDeadline; onSubmit: (event: FormEvent<HTMLFormElement>) => void; submitLabel: string }) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field label="Expediente"><select name="caseId" className={inputClass} defaultValue={term?.caseId}>{cases.map((legalCase) => <option key={legalCase.id} value={legalCase.id}>{legalCase.name}</option>)}</select></Field>
      <Field label="Termino"><input name="title" required className={inputClass} defaultValue={term?.title} placeholder="Radicar memorial, contestar traslado..." /></Field>
      <div className="grid gap-4 md:grid-cols-2"><Field label="Fecha limite"><input name="date" required className={inputClass} defaultValue={term?.date} placeholder="12/06/2026" /></Field><Field label="Hora limite"><input name="time" className={inputClass} defaultValue={term?.time ?? "17:00"} /></Field></div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tipo de termino"><input name="type" className={inputClass} defaultValue={term?.type ?? "Termino procesal"} /></Field>
        <Field label="Origen"><select name="origin" className={inputClass} defaultValue={term?.origin ?? "Manual"}><option>Actuacion</option><option>Audiencia</option><option>Documento</option><option>Manual</option><option>Sugerencia IA</option></select></Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2"><Field label="Prioridad"><select name="priority" className={inputClass} defaultValue={term?.priority ?? "Alta"}><option>Alta</option><option>Media</option><option>Baja</option></select></Field><Field label="Responsable"><select name="owner" className={inputClass} defaultValue={term?.owner ?? "Dr. Juan Martinez"}>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field></div>
      <Field label="Riesgo / consecuencia si se incumple"><textarea name="consequence" className={`${inputClass} min-h-20 py-3`} defaultValue={term?.consequence} placeholder="Que pasa si el despacho no cumple este termino" /></Field>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
