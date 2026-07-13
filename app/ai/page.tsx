"use client";

import { useState } from "react";
import { AlertTriangle, BookOpenCheck, CalendarClock, CheckCircle2, ClipboardList, FilePenLine, FileSearch, FileText, ShieldCheck, Sparkles, TimerReset, XCircle } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader } from "@/components/ui";
import { cases, documents, hearings, tasks } from "@/lib/mock-data";

const safeguards = [
  { label: "Bajo demanda", detail: "Solo se ejecuta cuando el abogado lo solicita.", icon: Sparkles },
  { label: "Fuente visible", detail: "Cada resultado muestra de donde salio la informacion.", icon: BookOpenCheck },
  { label: "Revision obligatoria", detail: "El abogado valida antes de usar, radicar o crear terminos.", icon: ShieldCheck },
  { label: "Costo controlado", detail: "Primero usa contexto interno y respuestas cortas.", icon: TimerReset }
];

const tools = [
  {
    name: "Redactor",
    description: "Convierte hechos, instrucciones y hallazgos en un borrador juridico revisable.",
    icon: FilePenLine,
    source: "Expediente Alvarez + demanda + notas internas",
    output: "Borrador sugerido: memorial de aclaracion probatoria sobre dictamen pericial y nexo causal.",
    review: "Requiere revision de hechos, citas, pretensiones y tono antes de radicar."
  },
  {
    name: "Investigador",
    description: "Ordena preguntas de investigacion, hechos relevantes y lineas de analisis.",
    icon: FileSearch,
    source: "Expediente activo + actuaciones + tareas abiertas",
    output: "Linea de investigacion sugerida: revisar culpa exclusiva, soporte de cuantias y consistencia testimonial.",
    review: "No reemplaza investigacion juridica externa ni validacion normativa del abogado."
  },
  {
    name: "Analizador de documentos",
    description: "Resume documentos, detecta fechas relevantes y propone hallazgos convertibles en tareas.",
    icon: FileText,
    source: "Documento seleccionado + expediente asociado",
    output: "Fecha detectada como posible termino: 12/06/2026. Hallazgo: cruzar cuantia con dictamen pericial.",
    review: "Las fechas son posibles terminos. Deben validarse antes de alimentar Control de Terminos."
  },
  {
    name: "Preparador de audiencias",
    description: "Sugiere checklist, preguntas y puntos de preparacion para una audiencia concreta.",
    icon: ClipboardList,
    source: "Audiencia inicial + documentos vinculados + tareas previas",
    output: "Checklist sugerido: confirmar enlace, revisar pruebas, preparar interrogatorio y registrar resultado posterior.",
    review: "El abogado define estrategia, preguntas finales y decisiones procesales."
  }
];

export default function AIPage() {
  const [active, setActive] = useState(tools[0]);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const critical = [...cases].sort((a, b) => b.riskScore - a.riskScore)[0];
  const urgentTasks = tasks.filter((task) => !task.completed).slice(0, 3);
  const pendingDocuments = documents.filter((document) => document.status !== "Analizado").length;
  const hearingsToPrepare = hearings.filter((hearing) => hearing.checklist.some((item) => !item.completed)).length;
  const saveDecision = (decision: "Aceptada" | "Rechazada") => {
    const item = `${decision}: ${active.name} - ${active.output.slice(0, 86)}...`;
    if (decision === "Aceptada") setAccepted((current) => [item, ...current].slice(0, 4));
    if (decision === "Rechazada") setRejected((current) => [item, ...current].slice(0, 4));
  };

  return (
    <AppShell>
      <Header title="Asistente Juridico" subtitle="IA bajo demanda, con fuentes visibles y revision obligatoria del abogado." />
      <div className="space-y-6 p-5 lg:p-8">
        <Card className="overflow-hidden border-slate-800 bg-legal-obsidian text-white shadow-executive">
          <div className="grid gap-6 p-6 xl:grid-cols-[1fr_360px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100"><ShieldCheck className="h-4 w-4" /> Asistente responsable</div>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight">LegalOS usa IA para acelerar trabajo juridico, no para decidir por el abogado.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Funciona por solicitud puntual, con contexto del sistema, respuestas compactas, fuente usada y aviso de revision profesional.</p>
              <div className="mt-6 grid gap-3 md:grid-cols-4">{safeguards.map((item) => <Safeguard key={item.label} {...item} />)}</div>
            </div>
            <div className="rounded-lg border border-amber-300/30 bg-amber-500/10 p-5">
              <div className="flex items-center justify-between"><p className="text-sm font-semibold text-amber-100">Limite juridico</p><AlertTriangle className="h-5 w-5 text-amber-200" /></div>
              <p className="mt-4 text-sm leading-6 text-slate-200">Las respuestas son borradores, resumenes o sugerencias. No crean terminos, no radican documentos y no sustituyen criterio profesional.</p>
              <div className="mt-5 rounded-md border border-white/10 bg-white/[0.06] p-3">
                <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Caso usado como contexto demo</p>
                <p className="mt-1 text-sm font-semibold text-white">{critical.name}</p>
              </div>
            </div>
          </div>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric title="Tareas para priorizar" value={urgentTasks.length} detail="Sugerencias basadas en tareas abiertas" tone="amber" />
          <Metric title="Documentos por revisar" value={pendingDocuments} detail="Candidatos para resumen o hallazgo" tone="blue" />
          <Metric title="Audiencias con preparacion" value={hearingsToPrepare} detail="Checklist abierto o resultado pendiente" tone="red" />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_390px]">
          <Card>
            <CardHeader title="Herramientas del asistente" subtitle="Cuatro usos concretos, controlados y baratos." action={<Badge tone="blue">Bajo demanda</Badge>} />
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const selected = active.name === tool.name;
                return (
                  <button key={tool.name} onClick={() => setActive(tool)} className={`rounded-lg border p-4 text-left transition hover:-translate-y-0.5 hover:border-legal-blue hover:bg-blue-50/40 hover:shadow-panel ${selected ? "border-legal-blue bg-blue-50 shadow-panel" : "border-legal-line bg-white"}`}>
                    <div className="flex items-start gap-4">
                      <div className="grid h-10 w-10 place-items-center rounded-md bg-white text-legal-blue ring-1 ring-legal-line"><Icon className="h-5 w-5" /></div>
                      <div>
                        <h3 className="font-semibold text-slate-950">{tool.name}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{tool.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="bg-legal-navy p-5 text-white">
              <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-blue-300" /><h2 className="font-semibold">{active.name}</h2></div>
              <p className="mt-1 text-sm text-slate-300">Resultado simulado para revision del abogado.</p>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-800">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.04em] text-blue-700">Borrador / sugerencia</p>
                {active.output}
              </div>
              <ReviewBlock label="Fuente usada" value={active.source} />
              <ReviewBlock label="Requiere revision del abogado" value={active.review} tone="amber" />
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => saveDecision("Aceptada")}><CheckCircle2 className="h-4 w-4" /> Aceptar sugerencia</Button>
                <Button variant="secondary" onClick={() => saveDecision("Rechazada")}><XCircle className="h-4 w-4" /> Rechazar</Button>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <DecisionLog title="Sugerencias aceptadas" items={accepted} tone="green" />
          <DecisionLog title="Sugerencias rechazadas" items={rejected} tone="red" />
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          <Card>
            <CardHeader title="Uso recomendado" />
            <div className="space-y-3 p-5">
              {["Pedir resumen corto de expediente", "Convertir hallazgo en tarea sugerida", "Preparar checklist de audiencia", "Redactar primer borrador revisable"].map((item) => <Guideline key={item} text={item} />)}
            </div>
          </Card>
          <Card>
            <CardHeader title="Lo que no debe hacer" />
            <div className="space-y-3 p-5">
              {["Crear terminos automaticamente", "Radicar documentos sin revision", "Decidir estrategia procesal", "Responder al cliente como decision final"].map((item) => <Guideline key={item} text={item} danger />)}
            </div>
          </Card>
          <Card>
            <CardHeader title="Control de costo" />
            <div className="space-y-3 p-5">
              {["Usar contexto del expediente actual", "Respuestas cortas por defecto", "No ejecutar procesos masivos", "Pedir IA solo desde una accion concreta"].map((item) => <Guideline key={item} text={item} />)}
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

function Safeguard({ label, detail, icon: Icon }: { label: string; detail: string; icon: typeof Sparkles }) {
  return <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4"><Icon className="h-4 w-4 text-blue-200" /><p className="mt-3 text-sm font-semibold text-white">{label}</p><p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p></div>;
}

function Metric({ title, value, detail, tone }: { title: string; value: number; detail: string; tone: "amber" | "blue" | "red" }) {
  const tones = { amber: "text-amber-700 bg-amber-50", blue: "text-blue-700 bg-blue-50", red: "text-rose-700 bg-rose-50" };
  return <Card className="p-5"><div className={`grid h-9 w-9 place-items-center rounded-md ${tones[tone]}`}><CalendarClock className="h-4 w-4" /></div><p className="mt-4 text-sm font-semibold text-slate-600">{title}</p><p className="mt-1 text-3xl font-bold text-slate-950">{value}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></Card>;
}

function ReviewBlock({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "amber" }) {
  return <div className={`rounded-lg border p-4 ${tone === "amber" ? "border-amber-200 bg-amber-50" : "border-legal-line bg-slate-50"}`}><p className={`text-xs font-bold uppercase tracking-[0.04em] ${tone === "amber" ? "text-amber-700" : "text-slate-400"}`}>{label}</p><p className="mt-2 text-sm leading-6 text-slate-700">{value}</p></div>;
}

function Guideline({ text, danger = false }: { text: string; danger?: boolean }) {
  return <div className="flex items-start gap-3 rounded-lg border border-legal-line bg-slate-50 p-3 text-sm font-semibold text-slate-800">{danger ? <AlertTriangle className="mt-0.5 h-4 w-4 text-rose-600" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />}<span>{text}</span></div>;
}

function DecisionLog({ title, items, tone }: { title: string; items: string[]; tone: "green" | "red" }) {
  return (
    <Card>
      <CardHeader title={title} subtitle="Registro simulado para mostrar control humano sobre la IA." action={<Badge tone={tone}>{items.length}</Badge>} />
      <div className="space-y-2 p-5">
        {items.length ? items.map((item) => <div key={item} className={tone === "green" ? "rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-slate-700" : "rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-slate-700"}>{item}</div>) : <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">Sin sugerencias registradas.</p>}
      </div>
    </Card>
  );
}
