"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { Bell, Bot, Briefcase, CalendarClock, CalendarDays, CircleDollarSign, FileText, Home, Menu, Scale, Search, Settings, SquareCheckBig, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme";

const items = [
  { href: "/dashboard", label: "Bandeja del Dia", icon: Home },
  { href: "/cases", label: "Expedientes", icon: Briefcase },
  { href: "/deadlines", label: "Control de Terminos", icon: CalendarClock },
  { href: "/hearings", label: "Audiencias", icon: CalendarDays },
  { href: "/tasks", label: "Tareas", icon: SquareCheckBig },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/documents", label: "Documentos", icon: FileText },
  { href: "/billing", label: "Financiero", icon: CircleDollarSign },
  { href: "/ai", label: "Asistente Juridico", icon: Bot },
  { href: "/settings", label: "Ajustes", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-legal-obsidian text-white shadow-2xl shadow-slate-950/20">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-legal-ink shadow-lg shadow-blue-950/30"><Scale className="h-5 w-5" /></div>
        <div><p className="text-sm font-bold tracking-wide">LegalOS AI</p><p className="text-xs text-slate-400">Sistema operativo juridico</p></div>
      </div>
      <div className="px-3 pt-4">
        <div className="flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm text-slate-400 shadow-sm">
          <Search className="h-4 w-4" />
          Buscar expediente, cliente...
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white", active && "bg-white text-legal-ink shadow-lg shadow-blue-950/40")}>
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-legal-blue" : "text-slate-400 group-hover:text-white")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mx-3 mb-3 rounded-lg border border-blue-300/20 bg-blue-400/10 p-3 text-sm shadow-lg shadow-blue-950/20">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-blue-100">Bandeja del dia</p>
          <span className="rounded-full bg-rose-400/20 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-100 ring-1 ring-rose-300/20">6 alertas</span>
        </div>
        <p className="mt-1 text-xs leading-5 text-slate-300">Terminos, audiencias y tareas en una sola vista.</p>
      </div>
      <div className="m-3 mt-0 rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">JM</div><div className="min-w-0"><p className="truncate text-sm font-semibold">Dr. Juan Martinez</p><p className="truncate text-xs text-slate-400">Propietario - Gamarra Legal</p></div></div>
      </div>
    </aside>
  );

  return (
    <>
      <button className="fixed left-3 top-3 z-50 rounded-md bg-legal-ink p-2 text-white lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">{nav}</div>
      {open ? <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-slate-950/50" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0">{nav}<button className="absolute right-3 top-3 rounded-md p-2 text-white" onClick={() => setOpen(false)} aria-label="Cerrar menu"><X className="h-5 w-5" /></button></div></div> : null}
    </>
  );
}

export function Header({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 border-b border-legal-line/80 bg-white/90 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between lg:px-8 dark:border-slate-800/90 dark:bg-slate-950/90">
      <div className="pl-12 lg:pl-0"><h1 className="text-xl font-bold text-slate-950">{title}</h1><p className="text-sm leading-6 text-slate-500">{subtitle}</p></div>
      <div className="flex flex-wrap items-center gap-2"><ThemeToggle /><div className="hidden items-center gap-2 rounded-md border border-legal-line bg-slate-50 px-3 py-2 text-sm text-slate-600 shadow-sm sm:flex"><Bell className="h-4 w-4 text-legal-blue" /> Jueves, 11 de junio de 2026</div>{action}</div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-legal-surface"><Sidebar /><main className="lg:pl-72">{children}</main></div>;
}
