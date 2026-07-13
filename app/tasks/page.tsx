"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { CheckCircle2, MessageSquarePlus, Plus, ShieldAlert, TimerReset } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, Field, inputClass } from "@/components/ui";
import { resolveSource, type ResolvedSource } from "@/lib/source-resolver";
import { useLegalStore } from "@/lib/store";
import { Priority, Task, TaskStatus, TaskType, WorkSource } from "@/types";

const priorityTone = { Alta: "red", Media: "amber", Baja: "green" } as const;
const statusTone = { Pendiente: "amber", "En curso": "blue", Bloqueada: "red", Completada: "green" } as const;

export default function TasksPage() {
  const { tasks, cases, documents, hearings, deadlines, team, addTask, updateTask, addTaskComment, completeTask, caseName } = useLegalStore();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Abiertas");
  const [owner, setOwner] = useState("Todos");
  const [caseFilter, setCaseFilter] = useState("Todos");
  const [commentTask, setCommentTask] = useState("");
  const caseArea = (caseId: string) => cases.find((legalCase) => legalCase.id === caseId)?.legalArea ?? "Sin area";
  const resolveTaskSource = (task: Task) => resolveSource(task, { cases, documents, hearings, deadlines });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addTask({
      title: String(form.get("title")),
      caseId: String(form.get("caseId")),
      type: String(form.get("type")) as TaskType,
      status: String(form.get("status")) as TaskStatus,
      source: String(form.get("source")) as WorkSource,
      priority: String(form.get("priority")) as Priority,
      dueDate: String(form.get("dueDate")),
      owner: String(form.get("owner")),
      comments: String(form.get("comment")) ? [String(form.get("comment"))] : []
    });
    setOpen(false);
  }

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addTaskComment(commentTask, String(form.get("comment")));
    setCommentTask("");
  }

  const owners = Array.from(new Set(tasks.map((task) => task.owner)));
  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesStatus = status === "Todas" || (status === "Abiertas" ? task.status !== "Completada" : task.status === status);
    const matchesOwner = owner === "Todos" || task.owner === owner;
    const matchesCase = caseFilter === "Todos" || task.caseId === caseFilter;
    return matchesStatus && matchesOwner && matchesCase;
  }), [caseFilter, owner, status, tasks]);

  const pending = tasks.filter((task) => task.status !== "Completada");
  const critical = pending.filter((task) => task.priority === "Alta" || task.status === "Bloqueada");
  const today = pending.filter((task) => task.dueDate === "10/06/2026" || task.dueDate === "09/06/2026");
  const week = pending.filter((task) => ["10/06/2026", "11/06/2026", "12/06/2026", "14/06/2026", "17/06/2026"].includes(task.dueDate));

  return (
    <AppShell>
      <Header title="Tareas" subtitle="Acciones internas por estado, responsable, expediente y urgencia real." action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Nueva tarea</Button>} />
      <div className="space-y-5 p-5 lg:p-8">
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-5"><TimerReset className="h-5 w-5 text-amber-600" /><p className="mt-4 text-sm font-semibold text-slate-600">Abiertas</p><p className="mt-1 text-3xl font-bold">{pending.length}</p><p className="text-xs text-slate-500">Acciones pendientes</p></Card>
          <Card className="border-rose-200 bg-rose-50 p-5"><ShieldAlert className="h-5 w-5 text-rose-700" /><p className="mt-4 text-sm font-semibold text-rose-700">Criticas</p><p className="mt-1 text-3xl font-bold text-rose-950">{critical.length}</p><p className="text-xs text-rose-700">Alta prioridad o bloqueadas</p></Card>
          <Card className="p-5"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><p className="mt-4 text-sm font-semibold text-slate-600">Completadas</p><p className="mt-1 text-3xl font-bold">{tasks.filter((task) => task.status === "Completada").length}</p><p className="text-xs text-slate-500">Trabajo cerrado</p></Card>
        </section>

        <Card>
          <CardHeader title="Filtros de trabajo" subtitle="Filtra por estado, abogado y expediente." />
          <div className="grid gap-3 p-4 md:grid-cols-3">
            <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}><option>Abiertas</option><option>Pendiente</option><option>En curso</option><option>Bloqueada</option><option>Completada</option><option>Todas</option></select>
            <select className={inputClass} value={owner} onChange={(event) => setOwner(event.target.value)}><option>Todos</option>{owners.map((item) => <option key={item}>{item}</option>)}</select>
            <select className={inputClass} value={caseFilter} onChange={(event) => setCaseFilter(event.target.value)}><option>Todos</option>{cases.map((legalCase) => <option key={legalCase.id} value={legalCase.id}>{legalCase.name}</option>)}</select>
          </div>
        </Card>

        {open ? <Card>
          <CardHeader title="Crear tarea operativa" subtitle="Puede venir de expediente, audiencia, documento, cliente, termino o manual." />
          <form onSubmit={submit} className="grid gap-4 p-5 md:grid-cols-4">
            <Field label="Tarea"><input name="title" required className={inputClass} /></Field>
            <Field label="Expediente"><select name="caseId" className={inputClass}>{cases.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
            <Field label="Tipo"><select name="type" className={inputClass}><option>Tarea interna</option><option>Termino judicial</option><option>Seguimiento al cliente</option><option>Cobro</option><option>Preparacion de audiencia</option></select></Field>
            <Field label="Estado"><select name="status" className={inputClass}><option>Pendiente</option><option>En curso</option><option>Bloqueada</option><option>Completada</option></select></Field>
            <Field label="Origen"><select name="source" className={inputClass}><option>Manual</option><option>Expediente</option><option>Actuacion</option><option>Audiencia</option><option>Documento</option><option>Cliente</option><option>Termino</option></select></Field>
            <Field label="Prioridad"><select name="priority" className={inputClass}><option>Alta</option><option>Media</option><option>Baja</option></select></Field>
            <Field label="Fecha limite"><input name="dueDate" className={inputClass} placeholder="12/06/2026" /></Field>
            <Field label="Responsable"><select name="owner" className={inputClass}>{team.map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field>
            <div className="md:col-span-4"><Field label="Comentario inicial"><input name="comment" className={inputClass} /></Field></div>
            <div className="md:col-span-4"><Button type="submit">Crear tarea</Button></div>
          </form>
        </Card> : null}

        <section className="grid gap-4 lg:grid-cols-3">
          <Lane title="Hoy" tone="blue" tasks={today} caseName={caseName} caseArea={caseArea} resolveTaskSource={resolveTaskSource} />
          <Lane title="Esta semana" tone="green" tasks={week} caseName={caseName} caseArea={caseArea} resolveTaskSource={resolveTaskSource} />
          <Lane title="Critico" tone="red" tasks={critical} caseName={caseName} caseArea={caseArea} resolveTaskSource={resolveTaskSource} />
        </section>

        <Card>
          <CardHeader title="Tareas operativas" subtitle={`${visibleTasks.length} tareas visibles`} />
          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {visibleTasks.map((task) => (
              <TaskCard key={task.id} task={task} caseName={caseName} caseArea={caseArea} source={resolveTaskSource(task)} onComplete={completeTask} onUpdate={updateTask} onComment={setCommentTask} />
            ))}
          </div>
        </Card>

        {commentTask ? <Card>
          <CardHeader title="Agregar comentario" />
          <form onSubmit={submitComment} className="flex flex-wrap items-end gap-3 p-5"><Field label="Comentario"><input name="comment" required className={inputClass} /></Field><Button type="submit">Guardar comentario</Button><Button variant="secondary" onClick={() => setCommentTask("")}>Cancelar</Button></form>
        </Card> : null}
      </div>
    </AppShell>
  );
}

function TaskCard({ task, caseName, caseArea, source, onComplete, onUpdate, onComment }: {
  task: Task;
  caseName: (id: string) => string;
  caseArea: (id: string) => string;
  source: ResolvedSource;
  onComplete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onComment: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-legal-line bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-panel">
                <div className="flex items-start justify-between gap-4">
                  <label className="flex min-w-0 items-start gap-3">
                    <input className="mt-1" type="checkbox" checked={task.status === "Completada"} onChange={() => onComplete(task.id)} />
                    <span className={task.status === "Completada" ? "font-semibold text-slate-400 line-through" : "font-bold text-slate-950"}>{task.title}</span>
                  </label>
                  <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2"><Badge tone={statusTone[task.status]}>{task.status}</Badge><Badge tone="blue">{task.type}</Badge><Badge>{task.source}</Badge></div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md bg-slate-50 p-3"><p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Expediente</p><p className="mt-1 text-sm font-semibold text-slate-800">{caseName(task.caseId)}</p><p className="mt-1 text-xs font-bold text-legal-blue">{caseArea(task.caseId)}</p></div>
                  <div className="rounded-md bg-amber-50 p-3"><p className="text-xs font-bold uppercase tracking-[0.04em] text-amber-700">Fecha limite</p><p className="mt-1 text-sm font-bold text-slate-950">{task.dueDate}</p></div>
                </div>
                <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.04em] text-blue-700">Origen</p>
                  <p className="mt-1 text-sm font-semibold text-blue-950">Origen: {source.label}</p>
                  <p className="mt-1 text-xs leading-5 text-blue-800">{source.detail}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="text-slate-500">Responsable: {task.owner}</span>
                  <select className={inputClass} value={task.status} onChange={(event) => onUpdate(task.id, { status: event.target.value as TaskStatus })}><option>Pendiente</option><option>En curso</option><option>Bloqueada</option><option>Completada</option></select>
                </div>
                {task.comments.length ? <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-600">{task.comments.map((comment) => <p key={comment}>{comment}</p>)}</div> : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => onComment(task.id)}><MessageSquarePlus className="h-4 w-4" /> Comentar</Button>
                  {source.caseHref ? <Link href={source.caseHref} className="inline-flex min-h-9 items-center justify-center rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Abrir expediente</Link> : null}
                  {source.href && source.href !== source.caseHref ? <Link href={source.href} className="inline-flex min-h-9 items-center justify-center rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">Abrir fuente</Link> : null}
                </div>
              </div>
  );
}

function Lane({ title, tasks, tone, caseName, caseArea, resolveTaskSource }: { title: string; tasks: ReturnType<typeof useLegalStore>["tasks"]; tone: "blue" | "red" | "green"; caseName: (id: string) => string; caseArea: (id: string) => string; resolveTaskSource: (task: Task) => ResolvedSource }) {
  const colors = tone === "red" ? "border-rose-200 bg-rose-50 text-rose-800" : tone === "green" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-blue-200 bg-blue-50 text-blue-800";
  return <Card className={`border ${colors}`}><div className="border-b border-current/10 px-5 py-4"><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs opacity-80">{tasks.length} acciones</p></div><div className="space-y-2 p-4">{tasks.slice(0, 4).map((task) => {
    const source = resolveTaskSource(task);
    return <div key={task.id} className="rounded-md bg-white/75 p-3 text-sm ring-1 ring-white/70"><p className="font-semibold text-slate-900">{task.title}</p><p className="mt-1 text-xs text-slate-500">{caseName(task.caseId)} - {caseArea(task.caseId)} - {task.owner}</p><p className="mt-1 text-xs font-semibold text-slate-600">Origen: {source.label}</p></div>;
  })}{!tasks.length ? <p className="text-sm text-slate-600">Sin tareas en este carril.</p> : null}</div></Card>;
}
