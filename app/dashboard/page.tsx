"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, ArrowRight, Clock3, FileText, Gavel, History, ShieldAlert, SquareCheckBig, TimerReset, UserRound } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader } from "@/components/ui";
import { resolveSource } from "@/lib/source-resolver";
import { useLegalStore } from "@/lib/store";
import { CaseDeadline, LegalCase, Priority } from "@/types";

const priorityTone = { Alta: "red", Media: "amber", Baja: "green" } as const;
const riskTone = { Alto: "red", Medio: "amber", Bajo: "green" } as const;
const today = new Date("2026-06-10T12:00:00");

type AlertDeadline = CaseDeadline & { caseName: string; legalArea: string; caseId: string };
type NextAction = { title: string; caseName: string; priority: Priority; href: string; detail: string };

function parseLegalDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T12:00:00`);
  const [day, month, year] = value.split("/");
  return new Date(`${year}-${month}-${day}T12:00:00`);
}

function daysFromToday(value: string) {
  return Math.ceil((parseLegalDate(value).getTime() - today.getTime()) / 86400000);
}

function deadlineLabel(deadline: CaseDeadline) {
  const days = daysFromToday(deadline.date);
  if (days < 0) return `${Math.abs(days)} dia(s) vencido`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence manana";
  return `Faltan ${days} dias`;
}

function priorityWeight(priority: Priority) {
  return priority === "Alta" ? 0 : priority === "Media" ? 1 : 2;
}

export default function DashboardPage() {
  const { cases, hearings, tasks, documents, activities, firm, team } = useLegalStore();
  const [scope, setScope] = useState<"mi" | "general">("mi");
  const [currentUser, setCurrentUser] = useState("Dr. Juan Martinez");
  const currentMember = team.find((member) => member.name === currentUser);

  const scopedCases = scope === "mi" ? cases.filter((legalCase) => legalCase.internalOwner === currentUser || legalCase.assistantOwner === currentUser) : cases;
  const scopedHearings = scope === "mi" ? hearings.filter((hearing) => hearing.responsibleLawyer === currentUser || hearing.assistantOwner === currentUser) : hearings;
  const scopedTasks = scope === "mi" ? tasks.filter((task) => task.owner === currentUser) : tasks;
  const sourceContext = { cases, documents, hearings, deadlines: scopedCases.flatMap((legalCase) => legalCase.deadlines) };

  const criticalDeadlines = useMemo(() => scopedCases
    .flatMap((legalCase) => legalCase.deadlines.map((deadline) => ({ ...deadline, caseName: legalCase.name, legalArea: legalCase.legalArea, caseId: legalCase.id })))
    .filter((deadline) => deadline.status === "Pendiente" && (deadline.priority === "Alta" || daysFromToday(deadline.date) <= 3))
    .sort((a, b) => parseLegalDate(a.date).getTime() - parseLegalDate(b.date).getTime())
    .slice(0, 5), [scopedCases]);

  const upcomingHearings = useMemo(() => scopedHearings
    .filter((hearing) => {
      const days = daysFromToday(hearing.date);
      return days >= 0 && days <= 7 && hearing.status !== "Realizada";
    })
    .sort((a, b) => parseLegalDate(a.date).getTime() - parseLegalDate(b.date).getTime() || a.time.localeCompare(b.time))
    .slice(0, 5), [scopedHearings]);

  const todaysTasks = useMemo(() => scopedTasks
    .filter((task) => !task.completed && daysFromToday(task.dueDate) <= 0)
    .sort((a, b) => priorityWeight(a.priority) - priorityWeight(b.priority))
    .slice(0, 5), [scopedTasks]);

  const riskCases = useMemo(() => scopedCases
    .filter((legalCase) => legalCase.risk === "Alto" || legalCase.riskScore >= 70)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5), [scopedCases]);

  const nextActions = useMemo<NextAction[]>(() => [
    ...criticalDeadlines.map((deadline) => ({ title: `Atender termino: ${deadline.title}`, caseName: deadline.caseName, priority: deadline.priority, href: `/cases/${deadline.caseId}`, detail: deadlineLabel(deadline) })),
    ...upcomingHearings.map((hearing) => {
      const legalCase = cases.find((item) => item.id === hearing.caseId);
      return { title: `Preparar audiencia: ${hearing.type}`, caseName: legalCase?.name ?? "Sin expediente", priority: daysFromToday(hearing.date) <= 1 ? "Alta" as const : "Media" as const, href: `/hearings/${hearing.id}`, detail: `${hearing.date} ${hearing.time}` };
    }),
    ...todaysTasks.map((task) => {
      const legalCase = cases.find((item) => item.id === task.caseId);
      return { title: task.title, caseName: legalCase?.name ?? "Sin expediente", priority: task.priority, href: `/cases/${task.caseId}`, detail: `Limite ${task.dueDate}` };
    }),
    ...riskCases.map((legalCase) => ({ title: "Revisar expediente en riesgo", caseName: legalCase.name, priority: legalCase.risk === "Alto" ? "Alta" as const : "Media" as const, href: `/cases/${legalCase.id}`, detail: legalCase.currentAction }))
  ].sort((a, b) => priorityWeight(a.priority) - priorityWeight(b.priority)).slice(0, 6), [cases, criticalDeadlines, riskCases, todaysTasks, upcomingHearings]);

  const totalAlerts = criticalDeadlines.length + upcomingHearings.length + todaysTasks.length + riskCases.length;

  return (
    <AppShell>
      <Header title="Bandeja del Dia" subtitle="Centro operativo diario: que atender hoy para no perder terminos, audiencias o expedientes." />
      <div className="space-y-5 p-5 lg:p-8">
        <Card className="border-slate-800 bg-legal-obsidian p-5 text-white shadow-executive">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Miercoles, 10 de junio de 2026</p>
              <h2 className="mt-3 text-2xl font-bold">{totalAlerts} alertas pendientes</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                {criticalDeadlines.length} terminos criticos · {upcomingHearings.length} audiencias proximas · {todaysTasks.length} tareas del dia · {riskCases.length} expedientes en riesgo
              </p>
            </div>
            <div className="flex max-w-md flex-wrap gap-2">
              <select className="min-h-9 rounded-md border border-white/10 bg-white/[0.08] px-3 text-sm font-semibold text-white outline-none" value={currentUser} onChange={(event) => setCurrentUser(event.target.value)}>
                {team.map((member) => <option key={member.id} value={member.name} className="text-slate-900">{member.name} - {member.role}</option>)}
              </select>
              <Button variant={scope === "mi" ? "primary" : "secondary"} onClick={() => setScope("mi")}>Mi Bandeja</Button>
              <Button variant={scope === "general" ? "primary" : "secondary"} onClick={() => setScope("general")}>Bandeja General</Button>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.06] p-3 text-sm text-slate-300">
            <div className="flex flex-wrap items-center gap-2"><UserRound className="h-4 w-4 text-blue-200" /><strong className="text-white">Modo despacho preparado:</strong><span>{scope === "mi" ? `Vista filtrada para ${currentUser} (${currentMember?.role ?? "rol operativo"}).` : "Vista general del despacho, pensada para propietario."}</span></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            <QuickLink href="/deadlines" icon={<TimerReset />} label="Control de Terminos" />
            <QuickLink href="/hearings" icon={<Gavel />} label="Audiencias" />
            <QuickLink href="/tasks" icon={<SquareCheckBig />} label="Tareas" />
            <QuickLink href="/cases" icon={<FileText />} label="Expedientes" />
          </div>
        </Card>

        <section className="grid gap-5 xl:grid-cols-2">
          <ActionBlock icon={<TimerReset />} title="Terminos criticos" subtitle="Plazos que pueden afectar el expediente." href="/deadlines" empty="No hay terminos criticos para esta bandeja.">
            {criticalDeadlines.map((deadline) => (
              <DeadlineAlert key={deadline.id} deadline={deadline} origin={resolveSource(deadline, sourceContext).label} />
            ))}
          </ActionBlock>

          <ActionBlock icon={<Gavel />} title="Audiencias proximas" subtitle="Audiencias de los proximos 7 dias que requieren preparacion." href="/hearings" empty="No hay audiencias proximas en esta bandeja.">
            {upcomingHearings.map((hearing) => {
              const legalCase = cases.find((item) => item.id === hearing.caseId);
              return <HearingAlert key={hearing.id} hearing={hearing} caseName={legalCase?.name ?? "Sin expediente"} legalArea={legalCase?.legalArea ?? "Sin area"} origin={resolveSource(hearing, sourceContext).label} />;
            })}
          </ActionBlock>

          <ActionBlock icon={<SquareCheckBig />} title="Tareas del dia" subtitle="Tareas vencidas o con fecha limite hoy." href="/tasks" empty="No hay tareas vencidas o para hoy.">
            {todaysTasks.map((task) => {
              const legalCase = cases.find((item) => item.id === task.caseId);
              return <TaskAlert key={task.id} task={task} caseName={legalCase?.name ?? "Sin expediente"} origin={resolveSource(task, sourceContext).label} />;
            })}
          </ActionBlock>

          <ActionBlock icon={<AlertTriangle />} title="Expedientes en riesgo" subtitle="Casos de mayor riesgo que deben revisarse." href="/cases" empty="No hay expedientes de alto riesgo en esta bandeja.">
            {riskCases.map((legalCase) => (
              <RiskCaseCard key={legalCase.id} legalCase={legalCase} />
            ))}
          </ActionBlock>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader title="Proximas acciones" subtitle="Ordenadas por urgencia operativa." />
            <div className="space-y-3 p-5">
              {nextActions.map((action) => (
                <Link key={`${action.title}-${action.caseName}-${action.detail}`} href={action.href} className="block rounded-lg border border-legal-line bg-white p-4 transition hover:border-legal-blue hover:bg-blue-50/40">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">{action.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{action.caseName}</p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{action.detail}</p>
                    </div>
                    <Badge tone={priorityTone[action.priority]}>{action.priority}</Badge>
                  </div>
                </Link>
              ))}
              {!nextActions.length ? <EmptyLine text="Sin proximas acciones pendientes." /> : null}
            </div>
          </Card>

          <Card>
            <CardHeader title="Actividad Juridica Reciente" subtitle="Ultimos movimientos registrados en LegalOS." />
            <div className="space-y-1 p-5">
              {activities.slice(0, 6).map((activity, index) => (
                <div key={activity.id} className="relative flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="grid h-8 w-8 place-items-center rounded-full border border-legal-line bg-white text-legal-blue"><History className="h-4 w-4" /></div>
                    {index < activities.slice(0, 6).length - 1 ? <div className="mt-1 h-full w-px bg-legal-line" /> : null}
                  </div>
                  <div className="min-w-0 rounded-lg border border-legal-line bg-white p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{activity.time}</p>
                    <p className="mt-1 font-bold text-slate-950">{activity.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{activity.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return <Link href={href} className="inline-flex min-h-9 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 [&_svg]:h-4 [&_svg]:w-4">{icon}{label}</Link>;
}

function ActionBlock({ icon, title, subtitle, href, empty, children }: { icon: ReactNode; title: string; subtitle: string; href: string; empty: string; children: ReactNode }) {
  const hasItems = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} action={<Link href={href} className="inline-flex items-center gap-1 text-sm font-bold text-legal-blue">Ver <ArrowRight className="h-4 w-4" /></Link>} />
      <div className="p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-legal-blue">{icon}{title}</div>
        <div className="space-y-3">{hasItems ? children : <EmptyLine text={empty} />}</div>
      </div>
    </Card>
  );
}

function DeadlineAlert({ deadline, origin }: { deadline: AlertDeadline; origin: string }) {
  return (
    <div className="rounded-lg border border-legal-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-950">{deadline.title}</p>
          <p className="mt-1 text-sm text-slate-500">{deadline.caseName} · {deadline.legalArea}</p>
        </div>
        <Badge tone={priorityTone[deadline.priority]}>{deadline.priority}</Badge>
      </div>
      <InfoGrid items={[["Fecha limite", `${deadline.date} ${deadline.time}`], ["Responsable", deadline.owner], ["Riesgo", deadlineLabel(deadline)], ["Origen", origin]]} />
      <Link href={`/cases/${deadline.caseId}`} className="mt-4 inline-flex min-h-9 items-center justify-center rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Ver Expediente</Link>
    </div>
  );
}

function HearingAlert({ hearing, caseName, legalArea, origin }: { hearing: ReturnType<typeof useLegalStore>["hearings"][number]; caseName: string; legalArea: string; origin: string }) {
  return (
    <div className="rounded-lg border border-legal-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-950">{hearing.type}</p>
          <p className="mt-1 text-sm text-slate-500">{caseName} · {legalArea}</p>
        </div>
        <Badge tone="blue">{hearing.status}</Badge>
      </div>
      <InfoGrid items={[["Fecha", `${hearing.date} ${hearing.time}`], ["Juzgado", hearing.court], ["Responsable", hearing.responsibleLawyer ?? "Sin responsable"], ["Origen", origin]]} />
      <Link href={`/hearings/${hearing.id}`} className="mt-4 inline-flex min-h-9 items-center justify-center rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Preparar Audiencia</Link>
    </div>
  );
}

function TaskAlert({ task, caseName, origin }: { task: ReturnType<typeof useLegalStore>["tasks"][number]; caseName: string; origin: string }) {
  return (
    <div className="rounded-lg border border-legal-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-950">{task.title}</p>
          <p className="mt-1 text-sm text-slate-500">{caseName}</p>
        </div>
        <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
      </div>
      <InfoGrid items={[["Fecha limite", task.dueDate], ["Responsable", task.owner], ["Estado", task.status], ["Origen", origin]]} />
      <Link href={`/cases/${task.caseId}`} className="mt-4 inline-flex min-h-9 items-center justify-center rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Ir al Expediente</Link>
    </div>
  );
}

function RiskCaseCard({ legalCase }: { legalCase: LegalCase }) {
  return (
    <div className="rounded-lg border border-legal-line bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-950">{legalCase.name}</p>
          <p className="mt-1 text-sm text-slate-500">{legalCase.legalArea} · {legalCase.internalOwner}</p>
        </div>
        <Badge tone={riskTone[legalCase.risk]}>{legalCase.risk}</Badge>
      </div>
      <InfoGrid items={[["Nivel de riesgo", `${legalCase.riskScore}/100`], ["Causa", legalCase.currentAction], ["Proximo hito", legalCase.criticalDeadline], ["Estado", legalCase.status]]} />
      <Link href={`/cases/${legalCase.id}`} className="mt-4 inline-flex min-h-9 items-center justify-center rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Revisar Expediente</Link>
    </div>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={`${label}-${value}`} className="rounded-md bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{label}</p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">{text}</div>;
}
