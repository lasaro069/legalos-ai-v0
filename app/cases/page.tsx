"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Briefcase, Plus, Search, ShieldAlert, TimerReset } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Card, CardHeader, inputClass } from "@/components/ui";
import { useLegalStore } from "@/lib/store";
import { legalAreas } from "@/types";

const riskTone = { Bajo: "green", Medio: "amber", Alto: "red" } as const;

export default function CasesPage() {
  const { cases, getClient, firm, team } = useLegalStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [risk, setRisk] = useState("Todos");
  const [area, setArea] = useState("Todos");
  const [owner, setOwner] = useState("Todos");
  const criticalCases = cases.filter((item) => item.risk === "Alto");
  const topCase = [...cases].sort((a, b) => b.riskScore - a.riskScore)[0];
  const filtered = useMemo(() => cases.filter((legalCase) => {
    const client = getClient(legalCase.clientId)?.name ?? "";
    const matchQuery = `${legalCase.name} ${client} ${legalCase.id} ${legalCase.filingNumber} ${legalCase.counterparty} ${legalCase.city} ${legalCase.legalArea} ${legalCase.internalOwner} ${legalCase.assistantOwner ?? ""}`.toLowerCase().includes(query.toLowerCase());
    const matchStatus = status === "Todos" || legalCase.status === status;
    const matchRisk = risk === "Todos" || legalCase.risk === risk;
    const matchArea = area === "Todos" || legalCase.legalArea === area;
    const matchOwner = owner === "Todos" || legalCase.internalOwner === owner || legalCase.assistantOwner === owner;
    return matchQuery && matchStatus && matchRisk && matchArea && matchOwner;
  }), [area, cases, getClient, owner, query, risk, status]);

  return (
    <AppShell>
      <Header title="Expedientes" subtitle={`Expedientes de ${firm.name}, con responsable, auxiliar, termino y siguiente actuacion.`} action={<Link href="/cases/new" className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><Plus className="h-4 w-4" /> Nuevo expediente</Link>} />
      <div className="space-y-5 p-5 lg:p-8">
        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden border-slate-800 bg-legal-obsidian text-white shadow-executive">
            <div className="grid gap-5 p-5 md:grid-cols-[1fr_260px]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100"><Briefcase className="h-4 w-4" /> Portafolio litigioso</div>
                <h2 className="mt-4 text-2xl font-bold">El despacho tiene {criticalCases.length} expedientes que requieren decision prioritaria.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">La vista ordena cada caso por riesgo procesal, termino critico y actuacion siguiente para evitar que el listado se vuelva ruido.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Signal icon={ShieldAlert} label="Riesgo alto" value={`${criticalCases.length} casos`} />
                  <Signal icon={TimerReset} label="Primer plazo" value={topCase.criticalDeadline} />
                  <Signal icon={AlertTriangle} label="Mayor prioridad" value={`Riesgo ${topCase.risk.toLowerCase()}`} />
                </div>
              </div>
              <Link href={`/cases/${topCase.id}`} className="rounded-lg border border-rose-300/25 bg-rose-500/10 p-4 transition hover:bg-rose-500/15">
                <Badge tone="red">Caso critico</Badge>
                <h3 className="mt-3 font-bold">{topCase.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{topCase.currentAction}</p>
                <div className="mt-4 rounded-md border border-white/10 bg-white/[0.06] p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Prioridad juridica</p>
                  <p className="mt-1 text-sm font-semibold text-white">Revisar termino, audiencia y siguiente actuacion.</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-100">Abrir expediente <ArrowRight className="h-4 w-4" /></span>
              </Link>
            </div>
          </Card>

          <Card>
            <CardHeader title="Filtros operativos" subtitle="Encuentra el expediente por radicado, cliente, responsable, auxiliar, estado o riesgo." />
            <div className="grid gap-3 p-4 md:grid-cols-2">
              <div className="relative md:col-span-2"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className={`${inputClass} w-full pl-9`} placeholder="Buscar expediente, radicado, cliente, area, responsable o contraparte..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
              <select className={inputClass} value={owner} onChange={(event) => setOwner(event.target.value)}><option>Todos</option>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select>
              <select className={inputClass} value={area} onChange={(event) => setArea(event.target.value)}><option>Todos</option>{legalAreas.map((item) => <option key={item}>{item}</option>)}</select>
              <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}><option>Todos</option><option>En proceso</option><option>Investigacion</option><option>Conciliacion</option><option>Terminado</option><option>Archivado</option><option>Cerrado</option></select>
              <select className={inputClass} value={risk} onChange={(event) => setRisk(event.target.value)}><option>Todos</option><option>Alto</option><option>Medio</option><option>Bajo</option></select>
            </div>
          </Card>
        </section>

        <Card>
          <CardHeader title="Expedientes priorizados" subtitle={`${filtered.length} expedientes visibles con siguiente accion y riesgo operativo`} />
          <div className="space-y-3 p-5">
            {filtered.map((legalCase) => {
              const client = getClient(legalCase.clientId);
              return (
                <Link href={`/cases/${legalCase.id}`} key={legalCase.id} className="block rounded-lg border border-legal-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-legal-blue hover:shadow-panel">
                  <div className="grid gap-4 xl:grid-cols-[1.1fr_0.75fr_0.75fr_160px] xl:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><Badge tone={riskTone[legalCase.risk]}>{legalCase.risk}</Badge><Badge tone="blue">{legalCase.status}</Badge><Badge>{legalCase.legalArea}</Badge><span className="text-xs font-semibold text-slate-400">{legalCase.id.toUpperCase()}</span></div>
                      <h3 className="mt-3 font-bold text-slate-950">{legalCase.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{client?.name} - {legalCase.processType} - {legalCase.proceduralStage}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">Radicado {legalCase.filingNumber} · {legalCase.city}</p>
                    </div>
                    <div className="rounded-md bg-slate-50 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Responsable y accion</p>
                      <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">{legalCase.internalOwner}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{legalCase.currentAction}</p>
                      {legalCase.assistantOwner ? <p className="mt-2 text-xs font-semibold text-slate-500">Auxiliar: {legalCase.assistantOwner}</p> : null}
                    </div>
                    <div className="rounded-md bg-amber-50 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.04em] text-amber-700">Termino principal</p>
                      <p className="mt-1 text-sm font-bold text-slate-950">{legalCase.criticalDeadline}</p>
                      <p className="mt-1 text-xs font-semibold text-amber-800">{legalCase.counterparty}</p>
                    </div>
                    <div className="rounded-md border border-legal-line bg-white p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Riesgo operativo</p>
                      <div className="mt-2"><Badge tone={riskTone[legalCase.risk]}>Riesgo {legalCase.risk}</Badge></div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">{legalCase.risk === "Alto" ? "Revisar hoy" : legalCase.risk === "Medio" ? "Seguimiento esta semana" : "Monitoreo normal"}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-legal-blue">Abrir expediente <ArrowRight className="h-3.5 w-3.5" /></span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function Signal({ icon: Icon, label, value }: { icon: typeof Briefcase; label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3"><Icon className="h-4 w-4 text-blue-200" /><p className="mt-2 text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-white">{value}</p></div>;
}
