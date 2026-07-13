"use client";

import { useState } from "react";
import { BookOpenCheck, CheckCircle2, Loader2, ShieldCheck, Sparkles, XCircle } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

const responses = {
  case: "Analisis preliminar: el expediente presenta riesgo probatorio medio-alto por dependencia de testimonios y dictamen pericial pendiente. Se recomienda preparar interrogatorio y verificar termino de traslado.",
  document: "Resumen ejecutivo: el documento contiene pretensiones, relato factico y anexos principales. Revisar cuantificacion, nexo causal y acreditacion de perjuicios.",
  dates: "Fechas detectadas: audiencia inicial 12/06/2026, posible termino probatorio 10/06/2026, conciliacion 14/06/2026. Requiere revision del abogado.",
  risks: "Riesgos detectados: falta de soporte pericial definitivo, posible excepcion procesal y plazo corto para preparar testigos.",
  checklist: "Checklist: validar poderes, consolidar pruebas, preparar interrogatorio, revisar notificaciones y definir teoria del caso.",
  ask: "Respuesta del expediente: el punto central es la responsabilidad civil y la cuantificacion de perjuicios.",
  hearing: "Preparacion sugerida: revisar documentos vinculados, validar teoria del caso, preparar preguntas por testigo y dejar listo formato de resultado posterior.",
  draft: "Borrador sugerido: memorial breve con hechos relevantes, solicitud concreta y anexo documental. Debe ajustarse a estrategia, juzgado y prueba disponible."
};

export function AIResponsePanel({
  type = "case",
  button = "Analizar con IA",
  source = "Contexto visible del expediente, documentos vinculados y datos registrados en LegalOS.",
  embedded = false
}: {
  type?: keyof typeof responses;
  button?: string;
  source?: string;
  embedded?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [accepted, setAccepted] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const run = () => {
    setLoading(true);
    setAnswer("");
    window.setTimeout(() => {
      setAnswer(responses[type]);
      setLoading(false);
    }, 850);
  };
  const saveSuggestion = (status: "Aceptada" | "Rechazada") => {
    if (!answer) return;
    const item = `${status}: ${answer.slice(0, 92)}${answer.length > 92 ? "..." : ""}`;
    if (status === "Aceptada") setAccepted((current) => [item, ...current].slice(0, 3));
    if (status === "Rechazada") setRejected((current) => [item, ...current].slice(0, 3));
    setAnswer("");
  };

  const Shell = embedded ? "div" : Card;
  return (
    <Shell className={embedded ? "overflow-hidden rounded-lg border border-legal-line bg-white" : "overflow-hidden"}>
      <div className="bg-legal-navy p-5 text-white"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-300" /><h3 className="text-sm font-semibold">Asistente Juridico</h3></div><p className="mt-1 text-sm text-slate-300">Apoyo bajo demanda, barato y contextual. No decide por el abogado.</p></div>
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={run} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{button}</Button>
          <Badge tone="blue">Bajo demanda</Badge>
          <Badge tone="amber">No crea terminos automaticos</Badge>
        </div>
        {loading ? <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">Procesando informacion del expediente...</div> : null}
        {answer ? <>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-800"><div className="mb-2 flex items-center gap-2 font-semibold text-blue-800"><CheckCircle2 className="h-4 w-4" /> Sugerencia generada</div>{answer}</div>
          <div className="rounded-lg border border-legal-line bg-slate-50 p-4 text-sm leading-6 text-slate-700"><div className="mb-2 flex items-center gap-2 font-semibold text-slate-800"><BookOpenCheck className="h-4 w-4" /> Fuente usada</div>{source}</div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><div className="mb-2 flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" /> Requiere revision del abogado</div>No crea terminos, no radica documentos y no reemplaza criterio profesional.</div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => saveSuggestion("Aceptada")}><CheckCircle2 className="h-4 w-4" /> Aceptar sugerencia</Button>
            <Button variant="secondary" onClick={() => saveSuggestion("Rechazada")}><XCircle className="h-4 w-4" /> Rechazar</Button>
          </div>
        </> : null}
        {accepted.length || rejected.length ? <div className="grid gap-3 md:grid-cols-2">
          <SuggestionLog title="Aceptadas" items={accepted} tone="green" />
          <SuggestionLog title="Rechazadas" items={rejected} tone="red" />
        </div> : null}
      </div>
    </Shell>
  );
}

function SuggestionLog({ title, items, tone }: { title: string; items: string[]; tone: "green" | "red" }) {
  return (
    <div className={tone === "green" ? "rounded-lg border border-emerald-200 bg-emerald-50 p-3" : "rounded-lg border border-rose-200 bg-rose-50 p-3"}>
      <p className={tone === "green" ? "text-xs font-bold uppercase tracking-[0.04em] text-emerald-700" : "text-xs font-bold uppercase tracking-[0.04em] text-rose-700"}>{title}</p>
      <div className="mt-2 space-y-2">
        {items.length ? items.map((item) => <p key={item} className="text-xs leading-5 text-slate-700">{item}</p>) : <p className="text-xs text-slate-500">Sin registros.</p>}
      </div>
    </div>
  );
}
