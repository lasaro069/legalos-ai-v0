"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardCheck, Plus, Search, ShieldAlert } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, EmptyState, Field, Modal, inputClass } from "@/components/ui";
import { useLegalStore } from "@/lib/store";
import { HearingModality } from "@/types";

export default function HearingsPage() {
  const { hearings, cases, team, addCaseHearing, caseName } = useLegalStore();
  const [showNew, setShowNew] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"calendario" | "lista">("calendario");
  const [ownerFilter, setOwnerFilter] = useState("Todos");
  const critical = hearings.filter((hearing) => hearing.checklist.some((item) => !item.completed)).length;
  const completedChecklist = hearings.reduce((sum, hearing) => sum + hearing.checklist.filter((item) => item.completed).length, 0);
  const totalChecklist = hearings.reduce((sum, hearing) => sum + hearing.checklist.length, 0);
  const caseArea = (caseId: string) => cases.find((legalCase) => legalCase.id === caseId)?.legalArea ?? "Sin area";
  const filtered = hearings.filter((hearing) => {
    const matchesQuery = `${hearing.type} ${hearing.court} ${caseName(hearing.caseId)} ${caseArea(hearing.caseId)} ${hearing.objective} ${hearing.responsibleLawyer ?? ""} ${hearing.assistantOwner ?? ""}`.toLowerCase().includes(query.toLowerCase());
    const matchesOwner = ownerFilter === "Todos" || hearing.responsibleLawyer === ownerFilter || hearing.assistantOwner === ownerFilter;
    return matchesQuery && matchesOwner;
  });
  const sortedHearings = [...filtered].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const weekDays = [
    { label: "Lun", day: "08", date: "2026-06-08" },
    { label: "Mar", day: "09", date: "2026-06-09" },
    { label: "Mie", day: "10", date: "2026-06-10" },
    { label: "Jue", day: "11", date: "2026-06-11" },
    { label: "Vie", day: "12", date: "2026-06-12" },
    { label: "Sab", day: "13", date: "2026-06-13" },
    { label: "Dom", day: "14", date: "2026-06-14" }
  ];

  function submitHearing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addCaseHearing({
      type: String(form.get("type")),
      caseId: String(form.get("caseId")),
      date: String(form.get("date")),
      time: String(form.get("time")),
      court: String(form.get("court")),
      modality: String(form.get("modality")) as HearingModality,
      link: String(form.get("link")),
      room: String(form.get("room")),
      objective: String(form.get("objective")),
      responsibleLawyer: String(form.get("responsibleLawyer")),
      assistantOwner: String(form.get("assistantOwner") || "") || undefined,
      status: "Programada",
      caseTheory: String(form.get("caseTheory")),
      checklist: [
        { id: `hc-${Date.now()}-1`, title: "Revisar documentos necesarios", completed: false },
        { id: `hc-${Date.now()}-2`, title: "Preparar pruebas y preguntas", completed: false },
        { id: `hc-${Date.now()}-3`, title: "Confirmar asistencia y enlace", completed: false }
      ]
    });
    setShowNew(false);
  }

  return (
    <AppShell>
      <Header title="Audiencias" subtitle="Audiencias con expediente, checklist, documentos, pruebas y resultado." action={<Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4" /> Nueva audiencia</Button>} />
      <div className="space-y-5 p-5 lg:p-8">
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-5"><CalendarDays className="h-5 w-5 text-legal-blue" /><p className="mt-4 text-sm font-semibold text-slate-600">Audiencias</p><p className="mt-1 text-3xl font-bold">{hearings.length}</p><p className="text-xs text-slate-500">Con expediente asociado</p></Card>
          <Card className="border-rose-200 bg-rose-50 p-5"><ShieldAlert className="h-5 w-5 text-rose-700" /><p className="mt-4 text-sm font-semibold text-rose-700">Preparacion pendiente</p><p className="mt-1 text-3xl font-bold text-rose-950">{critical}</p><p className="text-xs text-rose-700">Tienen checklist abierto</p></Card>
          <Card className="p-5"><ClipboardCheck className="h-5 w-5 text-emerald-600" /><p className="mt-4 text-sm font-semibold text-slate-600">Checklist completados</p><p className="mt-1 text-3xl font-bold">{completedChecklist}/{totalChecklist}</p><p className="text-xs text-slate-500">Preparacion acumulada</p></Card>
        </section>

        <Card>
          <CardHeader
            title="Agenda formal de audiencias"
            subtitle="Calendario semanal o lista operativa. La Bandeja del Dia solo muestra alertas."
            action={
              <div className="flex rounded-md border border-legal-line bg-slate-50 p-1">
                <button type="button" onClick={() => setView("calendario")} className={`rounded px-3 py-1.5 text-xs font-bold ${view === "calendario" ? "bg-white text-legal-blue shadow-sm" : "text-slate-500"}`}>Calendario</button>
                <button type="button" onClick={() => setView("lista")} className={`rounded px-3 py-1.5 text-xs font-bold ${view === "lista" ? "bg-white text-legal-blue shadow-sm" : "text-slate-500"}`}>Lista</button>
              </div>
            }
          />
          <div className="grid gap-3 border-b border-legal-line p-4 md:grid-cols-[1fr_260px]">
            <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className={`${inputClass} w-full pl-9`} placeholder="Buscar por expediente, juzgado, tipo, area, responsable u objetivo..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
            <select className={inputClass} value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}><option>Todos</option>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select>
          </div>
          {view === "calendario" ? (
            <div className="grid gap-3 p-4 md:grid-cols-7">
              {weekDays.map((day) => {
                const dayHearings = filtered.filter((hearing) => hearing.date === day.date).sort((a, b) => a.time.localeCompare(b.time));
                return (
                  <div key={day.date} className="min-h-40 rounded-lg border border-legal-line bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-500">{day.label}</p>
                        <p className="text-xl font-bold text-slate-950">{day.day}</p>
                      </div>
                      <Badge tone={dayHearings.length ? "blue" : "slate"}>{dayHearings.length}</Badge>
                    </div>
                    <div className="mt-3 space-y-2">
                      {dayHearings.map((hearing) => (
                        <Link key={hearing.id} href={`/hearings/${hearing.id}`} className="block rounded-md border border-blue-100 bg-white p-2 text-xs shadow-sm transition hover:border-legal-blue">
                          <p className="font-bold text-slate-950">{hearing.time}</p>
                          <p className="mt-1 line-clamp-2 font-semibold leading-4 text-slate-700">{hearing.type}</p>
                          <p className="mt-1 truncate text-slate-500">{caseName(hearing.caseId)} - {caseArea(hearing.caseId)}</p>
                        </Link>
                      ))}
                      {!dayHearings.length ? <p className="pt-4 text-xs text-slate-400">Sin audiencias</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="divide-y divide-legal-line">
              {sortedHearings.map((hearing) => {
                const done = hearing.checklist.filter((item) => item.completed).length;
                return <Link href={`/hearings/${hearing.id}`} key={hearing.id} className="block px-5 py-4 transition hover:bg-slate-50">
                  <div className="grid gap-4 xl:grid-cols-[1fr_220px_150px] xl:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><Badge tone={hearing.status === "Realizada" ? "green" : hearing.status === "Aplazada" ? "amber" : "blue"}>{hearing.status}</Badge><Badge>{hearing.modality}</Badge><Badge>{caseArea(hearing.caseId)}</Badge></div>
                      <p className="mt-3 font-bold text-slate-950">{hearing.type}</p>
                      <p className="mt-1 text-sm text-slate-500">{caseName(hearing.caseId)} - {hearing.court}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{hearing.responsibleLawyer ?? "Sin responsable"}{hearing.assistantOwner ? ` - Auxiliar: ${hearing.assistantOwner}` : ""}</p>
                    </div>
                    <div className="rounded-md bg-slate-50 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Preparacion</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{done}/{hearing.checklist.length} checklist</p>
                      <p className="mt-1 text-xs text-slate-500">{hearing.documentIds.length} documentos - {hearing.evidenceTitles.length} pruebas</p>
                    </div>
                    <div><p className="text-sm font-bold text-slate-950">{hearing.date}</p><p className="text-sm text-slate-500">{hearing.time}</p><div className="mt-3 flex items-center gap-1 text-xs font-bold text-legal-blue">Preparar <ArrowRight className="h-3.5 w-3.5" /></div></div>
                  </div>
                </Link>;
              })}
              {!sortedHearings.length ? <EmptyState title="Sin audiencias" description="No hay audiencias con ese criterio de busqueda." /> : null}
            </div>
          )}
        </Card>

        {showNew ? <Modal title="Crear audiencia" onClose={() => setShowNew(false)}>
          <form onSubmit={submitHearing} className="grid gap-4">
            <Field label="Expediente"><select name="caseId" className={inputClass}>{cases.map((legalCase) => <option key={legalCase.id} value={legalCase.id}>{legalCase.name}</option>)}</select></Field>
            <Field label="Tipo de audiencia"><input name="type" required className={inputClass} placeholder="Audiencia inicial, pruebas, conciliacion..." /></Field>
            <div className="grid gap-4 md:grid-cols-2"><Field label="Abogado responsable"><select name="responsibleLawyer" className={inputClass}>{team.filter((member) => member.role === "Propietario" || member.role === "Abogado").map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field><Field label="Auxiliar asignado"><select name="assistantOwner" className={inputClass}><option value="">Sin auxiliar</option>{team.filter((member) => member.role === "Auxiliar Juridico").map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field></div>
            <div className="grid gap-4 md:grid-cols-2"><Field label="Fecha"><input name="date" type="date" required className={inputClass} /></Field><Field label="Hora"><input name="time" type="time" required className={inputClass} /></Field></div>
            <Field label="Juzgado / autoridad"><input name="court" required className={inputClass} /></Field>
            <div className="grid gap-4 md:grid-cols-2"><Field label="Modalidad"><select name="modality" className={inputClass}><option>Virtual</option><option>Presencial</option></select></Field><Field label="Sala"><input name="room" className={inputClass} /></Field></div>
            <Field label="Enlace"><input name="link" className={inputClass} placeholder="Si es virtual" /></Field>
            <Field label="Objetivo"><textarea name="objective" required className={`${inputClass} min-h-20 py-3`} /></Field>
            <Field label="Teoria del caso inicial"><textarea name="caseTheory" className={`${inputClass} min-h-20 py-3`} /></Field>
            <Button type="submit">Guardar audiencia</Button>
          </form>
        </Modal> : null}

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader title="Preparacion esperada" />
            <div className="space-y-3 p-5">
              {["Crear checklist", "Asociar documentos", "Asociar pruebas", "Preparar preguntas", "Registrar teoria del caso", "Registrar resultado"].map((item) => <div key={item} className="flex items-center gap-3 rounded-lg border border-legal-line bg-slate-50 p-3 text-sm font-semibold text-slate-800"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> {item}</div>)}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
