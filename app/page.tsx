import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, CircleDollarSign, FileText, Scale, ShieldAlert, Sparkles, TimerReset } from "lucide-react";

const signals = ["Terminos visibles", "Audiencias priorizadas", "Expedientes conectados a tareas"];
const valueProof = ["No es CRM", "No es archivo", "Es direccion del despacho"];
const metrics = [
  { label: "Riesgo procesal", value: "Alto", tone: "text-rose-700" },
  { label: "Honorarios en riesgo", value: "$12.6M", tone: "text-emerald-700" },
  { label: "Vence en", value: "24h", tone: "text-amber-700" }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-legal-obsidian text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-legal-ink shadow-lg shadow-blue-950/40"><Scale className="h-5 w-5" /></div>
          <div><p className="text-sm font-bold tracking-wide">LegalOS AI</p><p className="text-xs text-slate-400">Sistema operativo juridico</p></div>
        </div>
        <Link href="/dashboard" className="inline-flex min-h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-legal-ink shadow-lg shadow-blue-950/20 hover:bg-blue-50">Entrar <ArrowRight className="h-4 w-4" /></Link>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 pb-12 pt-4 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-sm text-blue-100">
            <Sparkles className="h-4 w-4" />
            Inteligencia operativa para firmas modernas
          </div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">Empieza el dia sabiendo que atender primero.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">LegalOS AI organiza expedientes, terminos, audiencias, tareas y documentos en una bandeja diaria para que el despacho trabaje con menos ruido y mas control.</p>
          <div className="mt-6 flex flex-wrap gap-2">{valueProof.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] text-slate-300">{item}</span>)}</div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-legal-blue px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 hover:bg-blue-700">Entrar a Bandeja del Dia <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/ai" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white hover:bg-white/10">Ver Asistente Juridico</Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">{signals.map((item) => <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> {item}</div>)}</div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-10 hidden h-28 w-28 rounded-full bg-blue-500/20 blur-3xl lg:block" />
          <div className="absolute -right-10 bottom-8 hidden h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl lg:block" />
          <div className="relative rounded-xl border border-white/10 bg-white/[0.07] p-3 shadow-2xl shadow-blue-950/40">
            <div className="overflow-hidden rounded-lg bg-legal-paper text-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                <div><p className="text-sm font-bold">Despacho hoy</p><p className="text-xs text-slate-500">Martes, 9 de junio de 2026</p></div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700 ring-1 ring-emerald-200">Bajo control</div>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-3">{metrics.map((item) => <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold text-slate-500">{item.label}</p><p className={`mt-2 text-2xl font-bold ${item.tone}`}>{item.value}</p></div>)}</div>
              <div className="grid gap-4 p-4 pt-0 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-rose-700"><ShieldAlert className="h-4 w-4" /> Caso critico destacado</div>
                  <h2 className="mt-3 font-bold">Alvarez vs. Aseguradora Andina</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Audiencia inicial y cierre probatorio requieren actuacion inmediata.</p>
                  <div className="mt-4 rounded-md bg-white p-3 text-xs font-bold uppercase tracking-[0.04em] text-rose-700 ring-1 ring-rose-100">Prioridad alta del despacho</div>
                  <div className="mt-4 rounded-md bg-white p-3 text-xs leading-5 text-rose-800 ring-1 ring-rose-100">Accion sugerida: cerrar matriz probatoria y preparar preguntas antes del termino.</div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: CalendarClock, text: "Audiencia inicial - 12/06" },
                    { icon: FileText, text: "Dictamen pericial pendiente" },
                    { icon: TimerReset, text: "Termino en 24 horas" },
                    { icon: CircleDollarSign, text: "$8.2M por cobrar" }
                  ].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold shadow-sm"><Icon className="h-4 w-4 text-legal-blue" /> {text}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
