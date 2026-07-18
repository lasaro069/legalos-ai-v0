"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Bot, Briefcase, CalendarClock, CalendarDays, CircleDollarSign, FileText, Home, Menu, Scale, Search, Settings, SquareCheckBig, Users, X, LogOut, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Bandeja del Día", icon: Home },
  { href: "/dashboard/expedientes", label: "Expedientes", icon: Briefcase },
  { href: "/dashboard/agenda", label: "Control de Términos", icon: CalendarClock },
  { href: "/dashboard/audiencias", label: "Audiencias", icon: CalendarDays },
  { href: "/dashboard/tareas", label: "Tareas", icon: SquareCheckBig },
  { href: "/dashboard/contactos", label: "Contactos", icon: Phone },
  { href: "/dashboard/equipo", label: "Equipo", icon: Users },
  { href: "/dashboard/documentos", label: "Documentos", icon: FileText },
  { href: "/dashboard/financiero", label: "Financiero", icon: CircleDollarSign },
  { href: "/dashboard/ai", label: "Asistente Jurídico", icon: Bot },
];

interface SidebarProps {
  firmaNombre: string;
  firmaSlogan: string;
  firmaLogoUrl?: string;
  usuarioNombre: string;
  usuarioRol: string;
  usuarioIniciales: string;
  alertasCount: number;
  onLogout: () => void;
}

export function Sidebar({
  firmaNombre,
  firmaSlogan,
  firmaLogoUrl,
  usuarioNombre,
  usuarioRol,
  usuarioIniciales,
  alertasCount,
  onLogout
}: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      onLogout();
    });
  };

  const nav = (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-legal-obsidian text-white shadow-2xl shadow-slate-950/20 overflow-y-auto">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5 sticky top-0 bg-legal-obsidian z-10">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-legal-ink shadow-lg shadow-blue-950/30 overflow-hidden">
          {firmaLogoUrl ? (
            <img src={firmaLogoUrl} alt={firmaNombre} className="h-full w-full object-cover" />
          ) : (
            <Scale className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-wide truncate" title={firmaNombre}>{firmaNombre || "LegalOS AI"}</p>
          <p className="text-xs text-slate-400 truncate" title={firmaSlogan}>{firmaSlogan || "Sistema operativo jurídico"}</p>
        </div>
      </div>
      
      <div className="px-3 pt-4 shrink-0">
        <div className="flex min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm text-slate-400 shadow-sm cursor-text hover:bg-white/10 transition-colors">
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Buscar expediente, cliente...</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={() => setOpen(false)} 
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white", 
                active && "bg-white text-legal-ink shadow-lg shadow-blue-950/40"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-legal-blue" : "text-slate-400 group-hover:text-white")} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="shrink-0 mt-auto">
        <div className="mx-3 mb-3 rounded-lg border border-blue-300/20 bg-blue-400/10 p-3 text-sm shadow-lg shadow-blue-950/20">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-blue-100">Bandeja del día</p>
            {alertasCount > 0 && (
              <span className="rounded-full bg-rose-400/20 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-100 ring-1 ring-rose-300/20">
                {alertasCount} alertas
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-300">Términos, audiencias y tareas urgentes.</p>
        </div>
        
        <div className="m-3 mt-0 rounded-lg border border-white/10 bg-white/5 p-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {usuarioIniciales}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold" title={usuarioNombre}>{usuarioNombre}</p>
              <p className="truncate text-xs text-slate-400 capitalize">{usuarioRol} - {firmaNombre}</p>
            </div>
          </div>
          <div className="flex gap-2 border-t border-white/10 pt-3">
            <Link href="/dashboard/settings" className="flex-1 flex justify-center items-center gap-2 rounded-md bg-white/5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
              <Settings className="h-3 w-3" /> Ajustes
            </Link>
            <button 
              onClick={handleLogout}
              disabled={isPending}
              className="flex-1 flex justify-center items-center gap-2 rounded-md bg-white/5 py-1.5 text-xs font-medium text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
            >
              <LogOut className="h-3 w-3" /> Salir
            </button>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <button 
        className="fixed left-3 top-3 z-50 rounded-md bg-legal-ink p-2 text-white lg:hidden shadow-md" 
        onClick={() => setOpen(true)} 
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">
        {nav}
      </div>
      
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 transform transition-transform duration-300 ease-in-out">
            {nav}
            <button 
              className="absolute -right-12 top-3 rounded-md p-2 text-white bg-legal-ink/50 hover:bg-legal-ink backdrop-blur-sm" 
              onClick={() => setOpen(false)} 
              aria-label="Cerrar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
