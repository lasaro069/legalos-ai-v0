"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CircleDollarSign, CreditCard, TrendingUp } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Card, CardHeader } from "@/components/ui";
import { financialSummary, invoices } from "@/lib/mock-data";
import { useLegalStore } from "@/lib/store";
import { money } from "@/lib/utils";

const tone = { Alto: "red", Medio: "amber", Bajo: "green" } as const;

export default function BillingPage() {
  const { cases } = useLegalStore();
  return (
    <AppShell>
      <Header title="Financiero" subtitle="Honorarios, cuentas pendientes y dinero conectado al expediente." />
      <div className="space-y-5 p-5 lg:p-8">
        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="overflow-hidden border-slate-800 bg-legal-obsidian text-white shadow-executive">
            <div className="p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100"><CircleDollarSign className="h-4 w-4" /> Salud financiera</div>
              <h2 className="mt-4 text-3xl font-bold">Hay {money(financialSummary.pending)} por cobrar y {money(financialSummary.atRisk)} en riesgo.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">LegalOS conecta honorarios con expedientes activos para priorizar cobros antes de hitos procesales.</p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <FinanceSignal icon={TrendingUp} label="Cobrado" value={money(financialSummary.collected)} />
                <FinanceSignal icon={CreditCard} label="Por cobrar" value={money(financialSummary.pending)} />
                <FinanceSignal icon={AlertTriangle} label="En riesgo" value={money(financialSummary.atRisk)} />
              </div>
            </div>
          </Card>
          <Card className="border-rose-200 bg-rose-50 p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-rose-700">Mayor exposicion</p><AlertTriangle className="h-4 w-4 text-rose-700" /></div><p className="mt-4 text-2xl font-bold text-rose-950">Constructora S.A.S.</p><p className="mt-2 text-sm leading-6 text-rose-800">Factura vencida conectada a audiencia de pruebas. La recomendacion es solicitar anticipo antes de la preparacion probatoria.</p><Link href="/cases/l-2026-0009" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-rose-800">Abrir expediente <ArrowRight className="h-4 w-4" /></Link></Card>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader title="Honorarios por gestionar" subtitle="Prioridad financiera conectada al expediente" />
            <div className="space-y-3 p-5">
              {invoices.map((invoice) => (
                <Link href={`/cases/${invoice.caseId}`} key={invoice.id} className="block rounded-lg border border-legal-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-legal-blue hover:shadow-panel">
                  <div className="grid gap-4 lg:grid-cols-[1fr_160px_160px_120px] lg:items-center">
                    <div>
                      {(() => {
                        const legalCase = cases.find((item) => item.id === invoice.caseId);
                        return (
                          <>
                      <div className="flex flex-wrap items-center gap-2"><Badge tone={invoice.status === "Vencida" ? "red" : invoice.status === "Programada" ? "blue" : "amber"}>{invoice.status}</Badge><Badge tone={tone[invoice.risk as keyof typeof tone]}>{invoice.risk}</Badge><span className="text-xs font-semibold text-slate-400">{invoice.id}</span></div>
                      <h3 className="mt-3 font-bold text-slate-950">{invoice.client}</h3>
                      <p className="mt-1 text-sm text-slate-500">Honorarios conectados al expediente activo</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">Responsable: {legalCase?.internalOwner ?? "Sin responsable"}</p>
                          </>
                        );
                      })()}
                    </div>
                    <div className="rounded-md bg-emerald-50 p-3"><p className="text-xs font-bold uppercase tracking-[0.04em] text-emerald-700">Monto</p><p className="mt-1 text-sm font-bold text-slate-950">{money(invoice.amount)}</p></div>
                    <div className="rounded-md bg-amber-50 p-3"><p className="text-xs font-bold uppercase tracking-[0.04em] text-amber-700">Vence</p><p className="mt-1 text-sm font-bold text-slate-950">{invoice.dueDate}</p></div>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-legal-blue">Ver caso <ArrowRight className="h-4 w-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
          <Card className="overflow-hidden">
            <div className="bg-legal-ink p-5 text-white"><div className="flex items-center gap-2"><CircleDollarSign className="h-5 w-5 text-blue-200" /><h2 className="font-semibold">Recomendacion financiera</h2></div><p className="mt-2 text-sm leading-6 text-slate-300">Prioriza cobro de Constructora S.A.S. antes de audiencia de pruebas y solicita anticipo para preparacion probatoria.</p></div>
            <div className="space-y-3 p-5 text-sm text-slate-600"><p>Mayor exposicion: {money(15400000)} vencidos.</p><p>Accion sugerida: enviar estado de cuenta con avance procesal y siguiente hito.</p><Link href="/cases/l-2026-0009" className="inline-flex items-center gap-2 font-semibold text-legal-blue">Abrir expediente <ArrowRight className="h-4 w-4" /></Link></div>
          </Card>
        </section>

        <Card>
          <CardHeader title="Pipeline de cobro" subtitle="Vista ejecutiva de recuperacion de honorarios" />
          <div className="grid gap-4 p-5 md:grid-cols-4">
            <PipelineStage label="Facturado" value={money(62400000)} progress={100} tone="bg-slate-600" />
            <PipelineStage label="Por cobrar" value={money(financialSummary.pending)} progress={74} tone="bg-blue-600" />
            <PipelineStage label="En riesgo" value={money(financialSummary.atRisk)} progress={28} tone="bg-rose-600" />
            <PipelineStage label="Cobrado" value={money(financialSummary.collected)} progress={46} tone="bg-emerald-600" />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function FinanceSignal({ icon: Icon, label, value }: { icon: typeof CircleDollarSign; label: string; value: string }) {
  return <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4"><Icon className="h-4 w-4 text-blue-200" /><p className="mt-3 text-xs text-slate-400">{label}</p><p className="mt-1 text-lg font-bold text-white">{value}</p></div>;
}

function PipelineStage({ label, value, progress, tone }: { label: string; value: string; progress: number; tone: string }) {
  return <div className="rounded-lg border border-legal-line bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">{label}</p><p className="mt-2 text-lg font-bold text-slate-950">{value}</p><div className="mt-4 h-2 rounded-full bg-slate-200"><div className={`h-2 rounded-full ${tone}`} style={{ width: `${progress}%` }} /></div></div>;
}
