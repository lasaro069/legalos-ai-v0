"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AlertTriangle, BookOpenCheck, CalendarPlus, CheckCircle2, ClipboardCheck, FileSearch, Gavel, Loader2, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { Badge, Button, Card, Field, Modal, inputClass } from "@/components/ui";

type SuggestionStatus = "Sugerido" | "Creado" | "Descartado";
type ModalType = "actuacion" | "termino" | "tarea" | "riesgo" | "audiencia" | null;

const steps = [
  "Analizando documento...",
  "Extrayendo datos...",
  "Detectando actuaciones...",
  "Detectando posibles terminos...",
  "Generando sugerencias..."
];

const detectedData = [
  ["Tipo de documento", "Auto admisorio"],
  ["Radicado", "68001310300120250004500"],
  ["Juzgado", "Juzgado Primero Civil Municipal de Bucaramanga"],
  ["Fecha del documento", "09/06/2026"],
  ["Area", "Civil"],
  ["Parte demandante", "Juan Perez"],
  ["Parte demandada", "Banco XYZ"]
];

export function DocumentAIAnalysisPanel({ documentTitle = "Auto_Admisorio.pdf" }: { documentTitle?: string }) {
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [analyzed, setAnalyzed] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [termDate, setTermDate] = useState("");
  const [statuses, setStatuses] = useState<Record<"actuacion" | "termino" | "tarea" | "riesgo" | "audiencia", SuggestionStatus>>({
    actuacion: "Sugerido",
    termino: "Sugerido",
    tarea: "Sugerido",
    riesgo: "Sugerido",
    audiencia: "Sugerido"
  });

  useEffect(() => {
    if (!running) return;
    const timeout = window.setTimeout(() => {
      if (stepIndex >= steps.length - 1) {
        setRunning(false);
        setAnalyzed(true);
        return;
      }
      setStepIndex((current) => current + 1);
    }, 650);
    return () => window.clearTimeout(timeout);
  }, [running, stepIndex]);

  function runAnalysis() {
    setAnalyzed(false);
    setStepIndex(0);
    setRunning(true);
    setTermDate("");
    setStatuses({ actuacion: "Sugerido", termino: "Sugerido", tarea: "Sugerido", riesgo: "Sugerido", audiencia: "Sugerido" });
  }

  function discard(kind: keyof typeof statuses) {
    setStatuses((current) => ({ ...current, [kind]: "Descartado" }));
  }

  function submitProceeding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatuses((current) => ({ ...current, actuacion: "Creado" }));
    setActiveModal(null);
  }

  function submitDeadline(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!termDate) return;
    setStatuses((current) => ({ ...current, termino: "Creado" }));
    setActiveModal(null);
  }

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatuses((current) => ({ ...current, tarea: "Creado" }));
    setActiveModal(null);
  }

  function submitRiskTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatuses((current) => ({ ...current, riesgo: "Creado" }));
    setActiveModal(null);
  }

  function submitHearing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatuses((current) => ({ ...current, audiencia: "Creado" }));
    setActiveModal(null);
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-legal-navy p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-300" /><h3 className="text-sm font-semibold">Hallazgos IA del Documento</h3></div>
            <p className="mt-1 text-sm text-slate-300">Analisis simulado, con fuentes visibles y validacion obligatoria del abogado.</p>
          </div>
          <Badge tone="amber">Requiere revision</Badge>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {!analyzed && !running ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-blue-950">LegalOS puede analizar este documento y sugerir actuaciones, terminos, tareas y audiencias.</p>
                <p className="mt-1 text-sm leading-6 text-blue-800">La IA solo propone. El abogado decide que crear, editar o descartar.</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-blue-700" />
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={runAnalysis} disabled={running}>{running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Analizar con IA</Button>
          <Badge tone="blue">Bajo demanda</Badge>
          <Badge tone="slate">{documentTitle}</Badge>
        </div>

        {running ? (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center gap-3 text-sm font-bold text-blue-950"><Loader2 className="h-4 w-4 animate-spin" /> {steps[stepIndex]}</div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-legal-blue transition-all duration-500" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-5">
              {steps.map((step, index) => <div key={step} className={`rounded-md px-3 py-2 text-xs font-semibold ${index <= stepIndex ? "bg-white text-blue-950" : "bg-blue-100 text-blue-400"}`}>{step}</div>)}
            </div>
          </div>
        ) : null}

        {analyzed ? (
          <div className="space-y-5">
            <section className="grid gap-5 xl:grid-cols-[1fr_1.1fr]">
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.04em] text-blue-700">Resumen IA</p>
                <p className="mt-3 text-sm leading-6 text-blue-950">Se admite la demanda ejecutiva presentada por Juan Perez contra Banco XYZ y se ordena la notificacion de la parte demandada.</p>
                <ReviewNotice />
              </div>
              <div className="rounded-lg border border-legal-line bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Datos detectados</p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {detectedData.map(([label, value]) => <Fact key={label} label={label} value={value} />)}
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <AISuggestionCard
                icon={<Gavel />}
                title="Actuacion sugerida"
                status={statuses.actuacion}
                tone="blue"
                facts={[["Tipo", "Auto admisorio"], ["Fecha", "09/06/2026"], ["Fuente", documentTitle]]}
                description="Se admite la demanda y se ordena notificacion."
                onCreate={() => setActiveModal("actuacion")}
                createLabel="Crear actuacion"
                onDiscard={() => discard("actuacion")}
              />

              <AISuggestionCard
                icon={<CalendarPlus />}
                title="Posible termino detectado"
                status={statuses.termino}
                tone="red"
                facts={[["Nombre", "Traslado por 10 dias"], ["Fecha sugerida", "Pendiente de validacion"], ["Riesgo", "Alto"]]}
                description="El documento menciona un traslado procesal por diez dias."
                source="Se corre traslado por el termino de diez (10) dias..."
                warning="Posible termino detectado. Requiere validacion del abogado."
                onCreate={() => setActiveModal("termino")}
                createLabel="Validar y crear termino"
                onDiscard={() => discard("termino")}
              />

              <AISuggestionCard
                icon={<ClipboardCheck />}
                title="Tarea sugerida"
                status={statuses.tarea}
                tone="amber"
                facts={[["Titulo", "Preparar notificacion"], ["Prioridad", "Alta"], ["Fuente", "Notifiquese a la parte demandada..."]]}
                description="Verificar direccion de la parte demandada y preparar gestion de notificacion."
                onCreate={() => setActiveModal("tarea")}
                createLabel="Crear tarea"
                onDiscard={() => discard("tarea")}
              />

              <AISuggestionCard
                icon={<AlertTriangle />}
                title="Riesgos detectados"
                status={statuses.riesgo}
                tone="red"
                facts={[["Riesgo", "Alto"], ["Causa", "Notificacion y traslado pendiente"], ["Revision", "Abogado responsable"]]}
                description="El documento activa una actuacion procesal sensible. Si no se valida la notificacion y el traslado, puede perderse oportunidad de respuesta."
                source="Se admite la demanda y se ordena notificacion de la parte demandada."
                warning="Riesgo detectado por IA. Requiere revision del abogado antes de tomar decisiones."
                onCreate={() => setActiveModal("riesgo")}
                createLabel="Crear tarea"
                onDiscard={() => discard("riesgo")}
              />

              <AISuggestionCard
                icon={<FileSearch />}
                title="Audiencia sugerida"
                status={statuses.audiencia}
                tone="slate"
                facts={[["Titulo", "No se detecto audiencia programada"], ["Estado", "Sin audiencia detectada"], ["Tratamiento", "Hallazgo neutral"]]}
                description="El documento no menciona una audiencia programada. Esto no es un error; solo deja constancia de que no se detecto agenda formal."
                onCreate={() => setActiveModal("audiencia")}
                createLabel="Crear audiencia"
                onDiscard={() => discard("audiencia")}
              />
            </section>
          </div>
        ) : null}
      </div>

      {activeModal === "actuacion" ? <Modal title="Crear actuacion desde sugerencia IA" onClose={() => setActiveModal(null)}>
        <form onSubmit={submitProceeding} className="grid gap-4">
          <SourceBox documentTitle={documentTitle} />
          <Field label="Tipo"><input className={inputClass} defaultValue="Auto admisorio" /></Field>
          <Field label="Fecha"><input className={inputClass} defaultValue="09/06/2026" /></Field>
          <Field label="Descripcion"><textarea className={`${inputClass} min-h-24 py-3`} defaultValue="Se admite la demanda y se ordena notificacion." /></Field>
          <Field label="Origen"><input className={inputClass} defaultValue="Sugerencia IA" /></Field>
          <Button type="submit"><CheckCircle2 className="h-4 w-4" /> Guardar actuacion</Button>
        </form>
      </Modal> : null}

      {activeModal === "termino" ? <Modal title="Crear termino desde sugerencia IA" onClose={() => setActiveModal(null)}>
        <form onSubmit={submitDeadline} className="grid gap-4">
          <SourceBox documentTitle={documentTitle} warning />
          <Field label="Nombre"><input className={inputClass} defaultValue="Traslado por 10 dias" /></Field>
          <Field label="Riesgo"><input className={inputClass} defaultValue="Alto" /></Field>
          <Field label="Origen"><input className={inputClass} defaultValue="Sugerencia IA" /></Field>
          <Field label="Fecha limite" hint="Obligatoria. La IA no calcula ni guarda el termino sin validacion humana."><input required type="date" className={inputClass} value={termDate} onChange={(event) => setTermDate(event.target.value)} /></Field>
          {!termDate ? <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">Este termino fue sugerido por IA. Debe ser validado por el abogado antes de guardarse.</p> : null}
          <Button type="submit" disabled={!termDate}><CheckCircle2 className="h-4 w-4" /> Guardar termino</Button>
        </form>
      </Modal> : null}

      {activeModal === "tarea" ? <Modal title="Crear tarea desde sugerencia IA" onClose={() => setActiveModal(null)}>
        <form onSubmit={submitTask} className="grid gap-4">
          <SourceBox documentTitle={documentTitle} />
          <Field label="Titulo"><input className={inputClass} defaultValue="Preparar notificacion" /></Field>
          <Field label="Descripcion"><textarea className={`${inputClass} min-h-20 py-3`} defaultValue="Verificar direccion de la parte demandada y preparar gestion de notificacion." /></Field>
          <Field label="Prioridad"><select className={inputClass} defaultValue="Alta"><option>Alta</option><option>Media</option><option>Baja</option></select></Field>
          <Field label="Responsable"><input className={inputClass} defaultValue="Dr. Juan Martinez" /></Field>
          <Field label="Fecha limite"><input type="date" className={inputClass} /></Field>
          <Button type="submit"><CheckCircle2 className="h-4 w-4" /> Guardar tarea</Button>
        </form>
      </Modal> : null}

      {activeModal === "riesgo" ? <Modal title="Crear tarea desde riesgo detectado por IA" onClose={() => setActiveModal(null)}>
        <form onSubmit={submitRiskTask} className="grid gap-4">
          <SourceBox documentTitle={documentTitle} warning />
          <Field label="Titulo"><input className={inputClass} defaultValue="Revisar riesgo de notificacion y traslado" /></Field>
          <Field label="Descripcion"><textarea className={`${inputClass} min-h-20 py-3`} defaultValue="Validar direccion, forma de notificacion, termino de traslado y siguiente actuacion del expediente." /></Field>
          <Field label="Prioridad"><select className={inputClass} defaultValue="Alta"><option>Alta</option><option>Media</option><option>Baja</option></select></Field>
          <Field label="Responsable"><input className={inputClass} defaultValue="Dr. Juan Martinez" /></Field>
          <Field label="Fecha limite"><input type="date" className={inputClass} /></Field>
          <Button type="submit"><CheckCircle2 className="h-4 w-4" /> Guardar tarea</Button>
        </form>
      </Modal> : null}

      {activeModal === "audiencia" ? <Modal title="Crear audiencia desde revision IA" onClose={() => setActiveModal(null)}>
        <form onSubmit={submitHearing} className="grid gap-4">
          <SourceBox documentTitle={documentTitle} />
          <Field label="Titulo"><input className={inputClass} defaultValue="Audiencia por definir" /></Field>
          <Field label="Estado"><input className={inputClass} defaultValue="Sin audiencia detectada en documento" /></Field>
          <Field label="Fecha"><input type="date" className={inputClass} /></Field>
          <Field label="Juzgado"><input className={inputClass} defaultValue="Juzgado Primero Civil Municipal de Bucaramanga" /></Field>
          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">La IA no detecto una audiencia. El abogado puede crear una manualmente si corresponde.</p>
          <Button type="submit"><CheckCircle2 className="h-4 w-4" /> Guardar audiencia</Button>
        </form>
      </Modal> : null}
    </Card>
  );
}

function AISuggestionCard({ icon, title, status, tone, facts, description, source, warning, createLabel, onCreate, onDiscard }: {
  icon: ReactNode;
  title: string;
  status: SuggestionStatus;
  tone: "blue" | "red" | "amber" | "slate";
  facts: [string, string][];
  description: string;
  source?: string;
  warning?: string;
  createLabel?: string;
  onCreate?: () => void;
  onDiscard: () => void;
}) {
  const disabled = status !== "Sugerido";
  return (
    <div className="rounded-lg border border-legal-line bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-50 text-legal-blue ring-1 ring-legal-line [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
          <div>
            <p className="font-bold text-slate-950">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>
        <Badge tone={status === "Creado" ? "green" : status === "Descartado" ? "red" : tone}>{status}</Badge>
      </div>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {facts.map(([label, value]) => <Fact key={`${title}-${label}`} label={label} value={value} />)}
      </div>
      {source ? <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-900"><strong>Fuente:</strong> {source}</div> : null}
      {warning ? <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-900"><AlertTriangle className="mr-1 inline h-3.5 w-3.5" /> {warning}</div> : <ReviewNotice />}
      <div className="mt-4 flex flex-wrap gap-2">
        {onCreate && createLabel ? <Button onClick={onCreate} disabled={disabled}>{createLabel}</Button> : null}
        {onCreate ? <Button variant="secondary" onClick={onCreate} disabled={disabled}>Editar</Button> : null}
        <Button variant="secondary" onClick={onDiscard} disabled={disabled}><XCircle className="h-4 w-4" /> Descartar</Button>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md bg-slate-50 p-3"><p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-900">{value}</p></div>;
}

function ReviewNotice() {
  return <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-900"><ShieldCheck className="mr-1 inline h-3.5 w-3.5" /> Requiere revision del abogado.</p>;
}

function SourceBox({ documentTitle, warning = false }: { documentTitle: string; warning?: boolean }) {
  return (
    <div className={warning ? "rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900" : "rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950"}>
      <div className="flex items-center gap-2 font-bold"><BookOpenCheck className="h-4 w-4" /> Documento origen</div>
      <p className="mt-1">{documentTitle}</p>
      <p className="mt-1 text-xs">Origen: Sugerencia IA. Requiere revision del abogado.</p>
    </div>
  );
}
