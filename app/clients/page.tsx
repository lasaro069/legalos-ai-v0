"use client";

import Link from "next/link";
import { Briefcase, MessageSquare, Plus, Search, UserRoundCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Card, CardHeader, inputClass } from "@/components/ui";
import { useLegalStore } from "@/lib/store";

const statusTone = { Prospecto: "amber", Activo: "green", Inactivo: "slate" } as const;

export default function ClientsPage() {
  const { clients, cases, team } = useLegalStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [owner, setOwner] = useState("Todos");
  const filtered = useMemo(() => clients.filter((client) => {
    const matchesQuery = `${client.name} ${client.email} ${client.document} ${client.city} ${client.origin} ${client.representative} ${client.responsibleLawyer ?? ""}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "Todos" || client.status === status;
    const matchesOwner = owner === "Todos" || client.responsibleLawyer === owner;
    return matchesQuery && matchesStatus && matchesOwner;
  }), [clients, owner, query, status]);
  const activeCases = cases.length;
  const conflicts = clients.filter((client) => client.conflictAlert).length;
  const prospects = clients.filter((client) => client.status === "Prospecto").length;
  return (
    <AppShell>
      <Header title="Clientes y Prospectos" subtitle="Contactos comerciales, clientes activos y relaciones vinculadas a expedientes." action={<Link href="/clients/new" className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><Plus className="h-4 w-4" /> Nuevo contacto</Link>} />
      <div className="space-y-5 p-5 lg:p-8">
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-5"><UserRoundCheck className="h-5 w-5 text-legal-blue" /><p className="mt-4 text-sm font-semibold text-slate-600">Clientes activos</p><p className="mt-1 text-3xl font-bold">{clients.length}</p><p className="mt-1 text-xs text-slate-500">Base viva de relaciones del despacho</p></Card>
          <Card className="p-5"><Briefcase className="h-5 w-5 text-amber-600" /><p className="mt-4 text-sm font-semibold text-slate-600">Expedientes asociados</p><p className="mt-1 text-3xl font-bold">{activeCases}</p><p className="mt-1 text-xs text-slate-500">Casos conectados a clientes actuales</p></Card>
          <Card className="border-blue-200 bg-blue-50 p-5"><MessageSquare className="h-5 w-5 text-blue-700" /><p className="mt-4 text-sm font-semibold text-blue-700">Prospectos</p><p className="mt-1 text-3xl font-bold text-slate-950">{prospects}</p><p className="mt-1 text-xs text-blue-700">Convertibles a cliente con expediente</p></Card>
        </section>

        <Card className="p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div className="relative w-full max-w-md"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className={`${inputClass} w-full pl-9`} placeholder="Buscar por nombre, documento, ciudad, responsable u origen..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="flex flex-wrap gap-2"><select className={inputClass} value={owner} onChange={(event) => setOwner(event.target.value)}><option>Todos</option>{team.filter((member) => member.role === "Propietario" || member.role === "Abogado").map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select><select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}><option>Todos</option><option>Prospecto</option><option>Activo</option><option>Inactivo</option></select><Badge tone={conflicts ? "amber" : "green"}>{conflicts} alertas de conflicto</Badge></div></div></Card>
        <Card>
          <CardHeader title="Relaciones activas" subtitle="Clientes con expedientes, contacto reciente y siguiente seguimiento" />
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {filtered.map((client) => {
              const clientCases = cases.filter((item) => item.clientId === client.id);
              const riskiest = [...clientCases].sort((a, b) => b.riskScore - a.riskScore)[0];
              return (
                <Link href={`/clients/${client.id}`} key={client.id} className="rounded-lg border border-legal-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-legal-blue hover:shadow-panel">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><Badge tone={statusTone[client.status]}>{client.status}</Badge><Badge tone={client.conflictAlert ? "amber" : "blue"}>{client.conflictAlert ? "Conflicto" : client.personType}</Badge><Badge tone={riskiest?.risk === "Alto" ? "red" : "blue"}>{clientCases.length} expedientes</Badge></div>
                      <h3 className="mt-3 font-bold text-slate-950">{client.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{client.email} - {client.city}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{client.documentType}: {client.document} · Origen: {client.origin}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">Abogado responsable: {client.responsibleLawyer ?? "Sin asignar"}</p>
                    </div>
                    <div className="rounded-md bg-slate-50 px-3 py-2 text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Ultimo contacto</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{client.lastInteraction}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md bg-blue-50 p-3"><p className="text-xs font-bold uppercase tracking-[0.04em] text-blue-700">Expediente clave</p><p className="mt-1 text-sm font-semibold text-slate-900">{riskiest?.name ?? "Sin expediente activo"}</p></div>
                    <div className="rounded-md bg-slate-50 p-3"><p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Canal y seguimiento</p><p className="mt-1 text-sm font-semibold text-slate-800">{client.preferredChannel} · actualizar proximo hito</p></div>
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
