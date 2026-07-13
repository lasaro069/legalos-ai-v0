"use client";

import type { ReactNode } from "react";
import { Bell, Briefcase, Building2, CalendarClock, CheckCircle2, CreditCard, Gavel, Lock, Mail, ShieldCheck, SquareCheckBig, UserRound, Users } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, Field, inputClass } from "@/components/ui";
import { useLegalStore } from "@/lib/store";

const preferences = [
  { title: "Alertas de terminos por correo", detail: "Recordatorio anticipado para terminos criticos." },
  { title: "Recordatorios de audiencias", detail: "Preparacion, juzgado y documentos asociados." },
  { title: "Resumen diario del despacho", detail: "Riesgos, dinero y tareas para iniciar el dia." },
  { title: "Modo de IA conservador", detail: "Recomendaciones prudentes para decisiones juridicas." }
];

export default function SettingsPage() {
  const { firm, team, cases, tasks, hearings, deadlines } = useLegalStore();
  const owners = team.map((member) => ({
    ...member,
    cases: cases.filter((legalCase) => legalCase.internalOwner === member.name || legalCase.assistantOwner === member.name).length,
    tasks: tasks.filter((task) => task.owner === member.name && task.status !== "Completada").length,
    terms: deadlines.filter((term) => term.owner === member.name && term.status === "Pendiente").length,
    hearings: hearings.filter((hearing) => hearing.responsibleLawyer === member.name || hearing.assistantOwner === member.name).length
  }));
  const owner = team.find((member) => member.role === "Propietario");
  const lawyers = team.filter((member) => member.role === "Abogado" || member.role === "Propietario");
  const assistants = team.filter((member) => member.role === "Auxiliar Juridico");
  return (
    <AppShell>
      <Header title="Ajustes del Despacho" subtitle="Mi Firma, equipo mock, roles y preferencias operativas de LegalOS." />
      <div className="grid gap-5 p-5 xl:grid-cols-[1fr_380px] lg:p-8">
        <div className="space-y-5">
          <Card className="overflow-hidden border-slate-800 bg-legal-obsidian text-white shadow-executive">
            <div className="grid gap-5 p-5 md:grid-cols-[1fr_260px]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100">
                  <ShieldCheck className="h-4 w-4" /> Despacho configurado
                </div>
                <h2 className="mt-4 text-2xl font-bold">{firm.name} opera con alertas, agenda, responsables y equipo listos para demo comercial.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">Esta vista comunica control, seguridad y madurez de producto sin activar autenticacion ni infraestructura real.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                {[{ label: "Abogados", value: String(firm.lawyers) }, { label: "Auxiliares", value: String(firm.assistants) }, { label: "Plan", value: firm.plan }].map((signal) => (
                  <div key={signal.label} className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{signal.label}</p>
                    <p className="mt-1 text-lg font-bold text-white">{signal.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Perfil del abogado" subtitle="Datos que aparecen en expedientes, reportes y comunicaciones." action={<UserRound className="h-4 w-4 text-legal-blue" />} />
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Field label="Nombre profesional" hint="Visible en tareas, audiencias y comunicaciones."><input className={inputClass} defaultValue="Dr. Juan Martinez" /></Field>
              <Field label="Correo principal" hint="Canal de seguimiento del despacho."><input className={inputClass} defaultValue="juan@martinezlegal.co" /></Field>
              <Field label="Tarjeta profesional"><input className={inputClass} defaultValue="TP 183.420 C.S.J." /></Field>
              <Field label="Especialidad"><input className={inputClass} defaultValue="Derecho civil y comercial" /></Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Mi Firma" subtitle="Entidad conceptual del despacho. Mock visual, sin multiempresa ni autenticacion real." action={<Building2 className="h-4 w-4 text-legal-blue" />} />
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="md:col-span-2 flex items-center gap-4 rounded-lg border border-legal-line bg-slate-50 p-4">
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-legal-blue text-lg font-bold text-white">{firm.logo}</div>
                <div><p className="font-bold text-slate-950">{firm.name}</p><p className="mt-1 text-sm text-slate-500">{firm.description}</p></div>
              </div>
              <Field label="Nombre del despacho"><input className={inputClass} defaultValue={firm.name} /></Field>
              <Field label="Ciudad"><input className={inputClass} defaultValue={firm.city} /></Field>
              <Field label="Numero de abogados"><input className={inputClass} defaultValue={firm.lawyers} /></Field>
              <Field label="Numero de auxiliares"><input className={inputClass} defaultValue={firm.assistants} /></Field>
              <Field label="Plan actual"><input className={inputClass} defaultValue={firm.plan} /></Field>
              <Field label="Telefono"><input className={inputClass} defaultValue="+57 310 555 0192" /></Field>
              <Field label="Sitio web"><input className={inputClass} defaultValue="gamarralegal.co" /></Field>
              <div className="md:col-span-2 grid gap-3 md:grid-cols-4">
                <FirmMetric icon={<Briefcase />} label="Expedientes" value={String(cases.length)} />
                <FirmMetric icon={<CalendarClock />} label="Terminos abiertos" value={String(deadlines.filter((term) => term.status === "Pendiente").length)} />
                <FirmMetric icon={<Gavel />} label="Audiencias" value={String(hearings.length)} />
                <FirmMetric icon={<SquareCheckBig />} label="Tareas abiertas" value={String(tasks.filter((task) => task.status !== "Completada").length)} />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Vista de equipo" subtitle="Equipo mock del despacho con rol, carga operativa y alcance esperado." action={<Users className="h-4 w-4 text-legal-blue" />} />
            <div className="grid gap-3 p-5">
              {owners.map((member) => (
                <div key={member.id} className="rounded-lg border border-legal-line bg-white p-4">
                  <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr] xl:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={member.role === "Propietario" ? "blue" : member.role === "Abogado" ? "green" : "amber"}>{member.role}</Badge>
                        <Badge tone={member.active ? "green" : "slate"}>{member.active ? "Activo" : "Inactivo"}</Badge>
                      </div>
                      <p className="mt-3 font-bold text-slate-950">{member.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{member.email}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{member.city}</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-4">
                      <MiniMetric label="Expedientes" value={member.cases} />
                      <MiniMetric label="Terminos" value={member.terms} />
                      <MiniMetric label="Audiencias" value={member.hearings} />
                      <MiniMetric label="Tareas" value={member.tasks} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Roles del MVP" subtitle="Alcance funcional preparado para producto. No son permisos reales todavia." action={<ShieldCheck className="h-4 w-4 text-legal-blue" />} />
            <div className="grid gap-3 p-5 md:grid-cols-3">
              <RoleCard title="Propietario" person={owner?.name ?? "Sin propietario"} detail="Ve la Bandeja General, todos los expedientes y la operacion completa del despacho." />
              <RoleCard title="Abogado" person={`${lawyers.length} activos`} detail="Responsable juridico de expedientes, terminos, audiencias, actuaciones y tareas." />
              <RoleCard title="Auxiliar Juridico" person={`${assistants.length} activo`} detail="Apoya documentos, agenda, tareas y actualizacion de informacion. No es responsable juridico principal." />
            </div>
          </Card>

          <Card>
            <CardHeader title="Preferencias operativas" subtitle="Controles de alerta que refuerzan la promesa de no olvidar terminos." action={<Bell className="h-4 w-4 text-legal-blue" />} />
            <div className="grid gap-3 p-5 md:grid-cols-2">
              {preferences.map((item) => (
                <label key={item.title} className="flex items-start justify-between gap-4 rounded-lg border border-legal-line bg-white p-4 shadow-sm transition hover:border-legal-blue hover:bg-blue-50/30">
                  <span>
                    <span className="block text-sm font-bold text-slate-950">{item.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span>
                  </span>
                  <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-blue-600" />
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Plan actual</h2>
              <CreditCard className="h-4 w-4 text-legal-blue" />
            </div>
            <p className="mt-4 text-3xl font-bold">{firm.plan}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Gestion avanzada para despachos que necesitan control diario de riesgo, terminos y dinero pendiente.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="blue">Activo</Badge>
              <Badge tone="green">Listo para firma pequena</Badge>
            </div>
            <Button className="mt-5 w-full" variant="secondary">Ver capacidades del plan</Button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-legal-blue" />
              <h2 className="font-semibold">Seguridad del despacho</h2>
            </div>
            <div className="mt-4 space-y-3">
              <SecurityRow icon={<CheckCircle2 className="h-4 w-4" />} label="Actividad registrada" value="24 eventos recientes" />
              <SecurityRow icon={<Mail className="h-4 w-4" />} label="Correo verificado" value="juan@martinezlegal.co" />
              <SecurityRow icon={<ShieldCheck className="h-4 w-4" />} label="Permisos por rol" value="Preparado para equipo" />
            </div>
            <Button className="mt-5 w-full" variant="secondary">Revisar controles</Button>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function SecurityRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-legal-line bg-slate-50 p-3">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-white text-legal-blue shadow-sm">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-950">{label}</p>
        <p className="text-xs text-slate-500">{value}</p>
      </div>
    </div>
  );
}

function FirmMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-legal-line bg-white p-3">
      <div className="text-legal-blue [&_svg]:h-4 [&_svg]:w-4">{icon}</div>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}

function RoleCard({ title, person, detail }: { title: string; person: string; detail: string }) {
  return (
    <div className="rounded-lg border border-legal-line bg-slate-50 p-4">
      <Badge tone={title === "Propietario" ? "blue" : title === "Abogado" ? "green" : "amber"}>{title}</Badge>
      <p className="mt-3 font-bold text-slate-950">{person}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}
