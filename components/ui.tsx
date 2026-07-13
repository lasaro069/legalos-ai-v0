import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("rounded-lg border border-legal-line/70 bg-white shadow-panel ring-1 ring-white/80 transition-shadow duration-200", className)}>{children}</section>;
}

export function CardHeader({ title, action, subtitle }: { title: string; action?: ReactNode; subtitle?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-legal-line/80 bg-gradient-to-b from-white to-slate-50/70 px-5 py-4">
      <div>
        <h2 className="text-sm font-bold tracking-[0.01em] text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Button({ children, className, variant = "primary", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-legal-blue text-white shadow-sm shadow-blue-900/10 hover:-translate-y-px hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100",
        variant === "secondary" && "border border-legal-line bg-white text-slate-900 shadow-sm hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-100",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "blue" | "green" | "amber" | "red" | "slate" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    red: "bg-rose-50 text-rose-700 ring-rose-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200"
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.02em] ring-1", tones[tone])}>{children}</span>;
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      {label}
      {children}
      {hint ? <span className="text-xs font-normal leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

export const inputClass = "min-h-10 rounded-md border border-legal-line bg-white px-3 text-sm text-slate-950 outline-none shadow-sm shadow-slate-200/40 transition placeholder:text-slate-400 hover:border-slate-300 focus:border-legal-blue focus:ring-4 focus:ring-blue-100";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-slate-300 bg-gradient-to-b from-white to-slate-50 px-6 py-12 text-center">
      <div>
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-blue-200" />
        <h3 className="text-sm font-bold text-slate-950">{title}</h3>
        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm [&_tbody_tr]:transition [&_tbody_tr:hover]:bg-slate-50/80 [&_td]:px-4 [&_td]:py-4 [&_th]:bg-slate-50 [&_th]:px-4 [&_th]:py-3 [&_th]:text-[11px] [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-[0.04em] [&_th]:text-slate-500">{children}</table></div>;
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-lg border border-legal-line bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-legal-line px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100">Cerrar</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
