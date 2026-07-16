import { Bell, CreditCard, Lock, ShieldCheck, CheckCircle2, Mail, Briefcase, CalendarClock, Gavel, SquareCheckBig } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader } from "@/components/ui";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./components/ProfileForm";
import { FirmForm } from "./components/FirmForm";
import { TeamManagement } from "./components/TeamManagement";
import type { ReactNode } from "react";

const preferences = [
  { title: "Alertas de terminos por correo", detail: "Recordatorio anticipado para terminos criticos." },
  { title: "Recordatorios de audiencias", detail: "Preparacion, juzgado y documentos asociados." },
  { title: "Resumen diario del despacho", detail: "Riesgos, dinero y tareas para iniciar el dia." },
  { title: "Modo de IA conservador", detail: "Recomendaciones prudentes para decisiones juridicas." }
];

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch User Profile
  const { data: userProfile } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch Firm Membership & Firm details
  const { data: membership } = await supabase
    .from('miembros_firma')
    .select('*, firmas(*)')
    .eq('usuario_id', user.id)
    .eq('estado', 'activo')
    .single();

  if (!membership || !membership.firmas) {
    // If they have no firm, they should probably go to onboarding
    redirect('/onboarding');
  }

  const firma = membership.firmas;
  const isOwner = membership.rol === 'propietario';

  // Fetch all team members for this firm
  const { data: teamMembers } = await supabase
    .from('miembros_firma')
    .select('*, usuarios(*)')
    .eq('firma_id', firma.id)
    .order('created_at', { ascending: true });

  const activeTeam = teamMembers?.filter(m => m.estado !== 'inactivo') || [];
  const lawyers = activeTeam.filter(m => m.rol === 'abogado' || m.rol === 'propietario').length;
  const assistants = activeTeam.filter(m => m.rol === 'auxiliar').length;

  return (
    <AppShell>
      <Header title="Ajustes del Despacho" subtitle="Configuración de mi perfil, mi firma y mi equipo de trabajo." />
      <div className="grid gap-5 p-5 xl:grid-cols-[1fr_380px] lg:p-8">
        <div className="space-y-5">
          <Card className="overflow-hidden border-slate-800 bg-legal-obsidian text-white shadow-executive">
            <div className="grid gap-5 p-5 md:grid-cols-[1fr_260px]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100">
                  <ShieldCheck className="h-4 w-4" /> Despacho Activo
                </div>
                <h2 className="mt-4 text-2xl font-bold">{firma.nombre}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">Este es tu espacio de trabajo. Puedes editar la información y gestionar a tu equipo desde este panel.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Abogados</p>
                  <p className="mt-1 text-lg font-bold text-white">{lawyers}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Auxiliares</p>
                  <p className="mt-1 text-lg font-bold text-white">{assistants}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.04em] text-slate-400">Plan</p>
                  <p className="mt-1 text-lg font-bold text-white">PRO</p>
                </div>
              </div>
            </div>
          </Card>

          <ProfileForm initialData={{...userProfile, email: user.email}} />

          <FirmForm initialData={firma} canEdit={isOwner} />

          <TeamManagement teamMembers={activeTeam} canEdit={isOwner} firmaId={firma.id} />

          <Card>
            <CardHeader title="Preferencias operativas" subtitle="Controles de alerta que refuerzan la promesa de no olvidar terminos. (Datos simulados)" action={<Bell className="h-4 w-4 text-legal-blue" />} />
            <div className="grid gap-3 p-5 md:grid-cols-2">
              {preferences.map((item) => (
                <label key={item.title} className="flex items-start justify-between gap-4 rounded-lg border border-legal-line bg-white p-4 shadow-sm transition hover:border-legal-blue hover:bg-blue-50/30">
                  <span>
                    <span className="block text-sm font-bold text-slate-950">{item.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span>
                  </span>
                  <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-blue-600" />
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Plan actual</h2>
              <CreditCard className="h-4 w-4 text-legal-blue" />
            </div>
            <p className="mt-4 text-3xl font-bold">PRO</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">Gestion avanzada para despachos que necesitan control diario de riesgo, terminos y dinero pendiente.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="blue">Activo</Badge>
              <Badge tone="green">Listo para operar</Badge>
            </div>
            <Button className="mt-5 w-full" variant="secondary">Ver capacidades del plan</Button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-legal-blue" />
              <h2 className="font-semibold">Seguridad del despacho</h2>
            </div>
            <div className="mt-4 space-y-3">
              <SecurityRow icon={<CheckCircle2 className="h-4 w-4" />} label="Actividad registrada" value="Eventos recientes" />
              <SecurityRow icon={<Mail className="h-4 w-4" />} label="Correo verificado" value={user.email || ''} />
              <SecurityRow icon={<ShieldCheck className="h-4 w-4" />} label="Permisos por rol" value="Preparado para equipo" />
            </div>
            <Button className="mt-5 w-full" variant="secondary">Revisar controles</Button>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function SecurityRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-legal-line bg-slate-50 p-3">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-white text-legal-blue shadow-sm">{icon}</div>
      <div>
        <p className="text-sm font-bold text-slate-950">{label}</p>
        <p className="text-xs text-slate-500">{value}</p>
      </div>
    </div>
  );
}
