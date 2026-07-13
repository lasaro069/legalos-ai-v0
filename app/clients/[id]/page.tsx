"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { AlertTriangle, ArrowRight, Briefcase, CheckCircle2, CircleDollarSign, Mail, MessageSquare, Phone, Plus, Save, ShieldAlert, SquareCheckBig, UserRoundCheck } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, EmptyState, Field, inputClass } from "@/components/ui";
import { useLegalStore } from "@/lib/store";
import { money } from "@/lib/utils";

const riskTone = { Bajo: "green", Medio: "amber", Alto: "red" } as const;
const statusTone = { Prospecto: "amber", Activo: "green", Inactivo: "slate" } as const;

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getClient, cases, team, registerClientInteraction, convertProspectToClient, addTask } = useLegalStore();
  const client = getClient(id);
  const [taskOpen, setTaskOpen] = useState(false);
  const [saved, setSaved] = useState("");

  if (!client) {
    return (
      <AppShell>
        <Header title="Cliente no encontrado" subtitle="No existe en el directorio actual." />
        <div className="p-8"><EmptyState title="Sin cliente" description="Abre un cliente desde el listado principal." /></div>
      </AppShell>
    );
  }

  const related = cases.filter((legalCase) => legalCase.clientId === client.id);
  const riskiest = [...related].sort((a, b) => b.riskScore - a.riskScore)[0];
  const pendingFees = related.flatMap((legalCase) => legalCase.fees).filter((fee) => fee.status !== "Pagado").reduce((sum, fee) => sum + fee.amount, 0);

  function interaction() {
    registerClientInteraction(client!.id, `Seguimiento registrado para ${client!.name}`);
    setSaved("Ultima interaccion actualizada");
  }

  function convert() {
    convertProspectToClient(client!.id);
    setSaved("Prospecto convertido en cliente");
  }

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addTask({
      title: String(form.get("title")),
      caseId: String(form.get("caseId")),
      priority: String(form.get("priority")) as "Baja" | "Media" | "Alta",
      dueDate: String(form.get("dueDate")),
      owner: String(form.get("owner")),
      source: "Cliente",
      sourceType: "Cliente",
      sourceId: client!.id
    });
    setSaved("Tarea de seguimiento creada");
    setTaskOpen(false);
  }

  return (
    <AppShell>
      <Header title={client.name} subtitle={`${client.documentType} ${client.document} - ${client.status.toLowerCase()} del despacho`} action={<div className="flex flex-wrap gap-2">{client.status === "Prospecto" ? <Button variant="secondary" onClick={convert}>Convertir a cliente</Button> : null}<Link href={`/cases/new?clientId=${client.id}`} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"><Plus className="h-4 w-4" /> Crear expediente</Link></div>} />
      <div className="grid gap-5 p-5 lg:grid-cols-[380px_1fr] lg:p-8">
        <div className="space-y-5">
          {saved ? <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {saved}</div> : null}
          <Card className="overflow-hidden border-slate-800 bg-legal-obsidian text-white shadow-executive">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2"><Badge tone={statusTone[client.status]}>{client.status}</Badge><Badge tone="blue">{client.personType}</Badge></div>
                <UserRoundCheck className="h-5 w-5 text-blue-200" />
              </div>
              <h2 className="mt-5 text-2xl font-bold">{client.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{client.notes || "Relacion lista para seguimiento comercial, juridico y operativo."}</p>
              <div className="mt-5 grid gap-3">
                <Info icon={<Mail />} label="Correo" value={client.email} dark />
                <Info icon={<Phone />} label="Telefono" value={`${client.phone}${client.alternatePhone ? ` / ${client.alternatePhone}` : ""}`} dark />
                <Info icon={<MessageSquare />} label="Canal preferido" value={client.preferredChannel} dark />
                <Info icon={<Briefcase />} label="Abogado responsable" value={client.responsibleLawyer ?? "Sin asignar"} dark />
                <Info icon={<Briefcase />} label="Origen" value={client.origin} dark />
              </div>
            </div>
          </Card>

          {client.status === "Prospecto" ? <Card className="border-amber-200 bg-amber-50 p-5"><p className="font-bold text-amber-950">Prospecto pendiente de decision</p><p className="mt-1 text-sm leading-6 text-amber-800">Convierte este contacto en cliente cuando exista encargo profesional o consulta facturada. Despues podras crear expediente sin recapturar datos.</p><Button className="mt-4" variant="secondary" onClick={convert}>Convertir a cliente</Button></Card> : null}

          {client.conflictAlert ? <Card className="border-amber-200 bg-amber-50 p-5"><div className="flex items-start gap-3"><AlertTriangle className="mt-1 h-5 w-5 text-amber-700" /><div><p className="font-bold text-amber-950">Alerta de conflicto de interes</p><p className="mt-1 text-sm leading-6 text-amber-800">{client.conflictDetail || "Revisar contraparte y relaciones previas antes de aceptar nuevo encargo."}</p></div></div></Card> : null}

          <Card>
            <CardHeader title="Lectura de relacion" subtitle="Riesgo, cartera y actividad del cliente." />
            <div className="space-y-3 p-5">
              <Metric label="Responsable" value={client.responsibleLawyer ?? "Sin asignar"} tone="blue" />
              <Metric label="Expedientes" value={String(related.length)} tone="blue" />
              <Metric label="Honorarios pendientes" value={money(pendingFees)} tone="green" />
              <Metric label="Ultima interaccion" value={client.lastInteraction} tone="blue" />
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-blue-200 bg-blue-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <ShieldAlert className="mt-1 h-5 w-5 text-blue-700" />
                <div>
                  <p className="font-bold text-slate-950">Seguimiento recomendado</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    Actualizar al cliente sobre {riskiest?.name ?? "su primer expediente"} y confirmar documentos pendientes antes del proximo hito procesal.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={interaction}><MessageSquare className="h-4 w-4" /> Registrar interaccion</Button>
                <Button onClick={() => setTaskOpen(true)}><SquareCheckBig className="h-4 w-4" /> Tarea de seguimiento</Button>
              </div>
            </div>
          </Card>

          {taskOpen ? <Card>
            <CardHeader title="Crear tarea de seguimiento" subtitle="Accion conectada al cliente y, si existe, a uno de sus expedientes." />
            <form onSubmit={submitTask} className="grid gap-4 p-5 md:grid-cols-5">
              <Field label="Tarea"><input name="title" required className={inputClass} defaultValue={`Actualizar a ${client.name}`} /></Field>
              <Field label="Expediente"><select name="caseId" className={inputClass}>{related.length ? related.map((item) => <option key={item.id} value={item.id}>{item.name}</option>) : <option value="">Sin expediente</option>}</select></Field>
              <Field label="Prioridad"><select name="priority" className={inputClass}><option>Media</option><option>Alta</option><option>Baja</option></select></Field>
              <Field label="Fecha limite"><input name="dueDate" className={inputClass} placeholder="12/06/2026" /></Field>
              <Field label="Responsable"><select name="owner" className={inputClass} defaultValue={riskiest?.internalOwner ?? client.responsibleLawyer ?? "Dr. Juan Martinez"}>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field>
              <div className="flex flex-wrap gap-3 md:col-span-5"><Button type="submit"><Save className="h-4 w-4" /> Crear tarea</Button><Button variant="secondary" onClick={() => setTaskOpen(false)}>Cancelar</Button></div>
            </form>
          </Card> : null}

          <Card>
            <CardHeader title="Expedientes del cliente" subtitle="Todos los expedientes asociados, con riesgo y siguiente actuacion." />
            <div className="divide-y divide-legal-line">
              {related.map((legalCase) => (
                <Link href={`/cases/${legalCase.id}`} key={legalCase.id} className="block px-5 py-4 transition hover:bg-slate-50">
                  <div className="grid gap-4 xl:grid-cols-[1fr_180px_120px] xl:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={riskTone[legalCase.risk]}>{legalCase.risk}</Badge>
                        <Badge tone="blue">{legalCase.status}</Badge>
                        <span className="text-xs font-semibold text-slate-400">{legalCase.filingNumber}</span>
                      </div>
                      <p className="mt-3 font-bold text-slate-950">{legalCase.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{legalCase.processType} - {legalCase.proceduralStage}</p>
                    </div>
                    <div className="rounded-md bg-slate-50 p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Siguiente accion</p>
                      <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">{legalCase.currentAction}</p>
                    </div>
                    <div>
                      <Badge tone={riskTone[legalCase.risk]}>Riesgo {legalCase.risk}</Badge>
                      <p className="mt-2 text-xs text-slate-500">{legalCase.internalOwner}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-legal-blue">Abrir <ArrowRight className="h-3.5 w-3.5" /></span>
                    </div>
                  </div>
                </Link>
              ))}
              {!related.length ? <div className="p-5"><EmptyState title="Sin expedientes asociados" description="Crea el primer expediente desde esta ficha para iniciar el flujo de ingreso." /></div> : null}
            </div>
          </Card>

          <Card>
            <CardHeader title="Cartera del cliente" subtitle="Honorarios pendientes derivados de sus expedientes." />
            <div className="grid gap-4 p-5 md:grid-cols-3">
              <Finance label="Pendiente" value={money(pendingFees)} />
              <Finance label="Expedientes con cobro" value={String(related.filter((item) => item.fees.length).length)} />
              <Finance label="Responsable principal" value={riskiest?.internalOwner ?? client.responsibleLawyer ?? "Sin asignar"} />
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Info({ icon, label, value, dark = false }: { icon: ReactNode; label: string; value: string; dark?: boolean }) {
  return (
    <div className={dark ? "flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3" : "flex items-center gap-3"}>
      <div className={dark ? "grid h-8 w-8 place-items-center rounded-md bg-white/10 text-blue-200 [&_svg]:h-4 [&_svg]:w-4" : "text-legal-blue [&_svg]:h-4 [&_svg]:w-4"}>{icon}</div>
      <div>
        <p className={dark ? "text-xs font-bold uppercase tracking-[0.04em] text-slate-400" : "text-xs font-semibold uppercase text-slate-400"}>{label}</p>
        <p className={dark ? "mt-1 text-sm font-semibold text-white" : "mt-1 text-sm font-semibold text-slate-950"}>{value}</p>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "red" | "blue" | "green" }) {
  const colors = tone === "red" ? "bg-rose-50 text-rose-700" : tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700";
  return (
    <div className="flex items-center justify-between rounded-lg border border-legal-line bg-white p-3">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${colors}`}>{value}</span>
    </div>
  );
}

function Finance({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-legal-line bg-slate-50 p-4"><CircleDollarSign className="h-4 w-4 text-emerald-600" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{label}</p><p className="mt-1 text-lg font-bold text-slate-950">{value}</p></div>;
}
