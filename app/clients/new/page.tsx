"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, Phone, Save, UserRoundPlus } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, Field, inputClass } from "@/components/ui";
import { useLegalStore } from "@/lib/store";
import { ClientStatus, PersonType } from "@/types";

export default function NewClientPage() {
  const router = useRouter();
  const { addClient } = useLegalStore();
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const client = addClient({
      name: String(form.get("name")),
      personType: String(form.get("personType")) as PersonType,
      documentType: String(form.get("documentType")),
      document: String(form.get("document")),
      representative: String(form.get("representative")),
      phone: String(form.get("phone")),
      alternatePhone: String(form.get("alternatePhone")),
      email: String(form.get("email")),
      preferredChannel: String(form.get("preferredChannel")),
      city: String(form.get("city")),
      address: String(form.get("address")),
      notes: String(form.get("notes")),
      status: String(form.get("status")) as ClientStatus,
      origin: String(form.get("origin")),
      conflictAlert: form.get("conflictAlert") === "on",
      conflictDetail: String(form.get("conflictDetail"))
    });
    setSaved(true);
    window.setTimeout(() => router.push(`/clients/${client.id}`), 700);
  }

  return (
    <AppShell>
      <Header title="Crear cliente" subtitle="Registra una relacion con datos listos para seguimiento, expediente y comunicacion." />
      <div className="grid gap-5 p-5 xl:grid-cols-[1fr_340px] lg:p-8">
        <Card>
          <CardHeader title="Datos completos del cliente" subtitle="Informacion clave para contacto, conflicto de interes, expediente y seguimiento." />
          <form onSubmit={submit} className="grid gap-5 p-5 md:grid-cols-2">
            <Field label="Nombre completo o razon social"><input name="name" required className={inputClass} placeholder="Ej. Maria Fernanda Alvarez" /></Field>
            <Field label="Tipo de persona"><select name="personType" className={inputClass}><option>Natural</option><option>Juridica</option></select></Field>
            <Field label="Tipo de documento"><select name="documentType" className={inputClass}><option>Cedula de ciudadania</option><option>NIT</option><option>Cedula de extranjeria</option><option>Pasaporte</option></select></Field>
            <Field label="Numero de documento"><input name="document" required className={inputClass} placeholder="52.418.903" /></Field>
            <Field label="Representante legal"><input name="representative" className={inputClass} placeholder="Solo si aplica" /></Field>
            <Field label="Telefono"><input name="phone" required className={inputClass} placeholder="+57 310 000 0000" /></Field>
            <Field label="Telefono alterno"><input name="alternatePhone" className={inputClass} placeholder="+57 601 000 0000" /></Field>
            <Field label="Correo"><input name="email" type="email" required className={inputClass} placeholder="cliente@correo.com" /></Field>
            <Field label="Canal preferido"><select name="preferredChannel" className={inputClass}><option>WhatsApp</option><option>Correo</option><option>Telefono</option><option>Presencial</option></select></Field>
            <Field label="Ciudad"><input name="city" className={inputClass} placeholder="Bogota" /></Field>
            <Field label="Estado"><select name="status" className={inputClass}><option>Prospecto</option><option>Activo</option><option>Inactivo</option></select></Field>
            <Field label="Origen del cliente"><input name="origin" className={inputClass} placeholder="Referido, web, evento, cliente corporativo..." /></Field>
            <div className="md:col-span-2"><Field label="Direccion"><input name="address" className={inputClass} placeholder="Ciudad, direccion principal" /></Field></div>
            <div className="md:col-span-2"><Field label="Notas"><textarea name="notes" className={`${inputClass} min-h-24 py-3`} placeholder="Contexto comercial, preferencias y observaciones iniciales" /></Field></div>
            <div className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <label className="flex items-center gap-3 text-sm font-bold text-amber-900"><input name="conflictAlert" type="checkbox" /> Marcar alerta de conflicto de interes</label>
              <Field label="Detalle de conflicto"><input name="conflictDetail" className={`${inputClass} mt-3`} placeholder="Ej. posible relacion con contraparte o cliente anterior" /></Field>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-legal-line pt-5 md:col-span-2">
              <Button type="submit"><Save className="h-4 w-4" /> Guardar cliente</Button>
              <Link href="/clients" className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /> Cancelar</Link>
              {saved ? <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Cliente creado. Abriendo relacion...</span> : null}
            </div>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <Badge tone="green">Relacion activa</Badge>
            <h2 className="mt-4 text-xl font-bold text-slate-950">Cada cliente debe abrir una vista de seguimiento.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">La demo comunica que LegalOS no es solo una libreta: conecta personas, expedientes, riesgo y acciones.</p>
          </Card>
          <Card>
            <CardHeader title="Lo que LegalOS preparara" />
            <div className="space-y-3 p-5">
              <Preview icon={<UserRoundPlus />} title="Ficha ejecutiva de cliente" />
              <Preview icon={<Mail />} title="Canal de comunicacion" />
              <Preview icon={<Phone />} title="Seguimiento recomendado" />
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Preview({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-legal-line bg-slate-50 p-3">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-white text-legal-blue shadow-sm [&_svg]:h-4 [&_svg]:w-4">{icon}</div>
      <p className="text-sm font-bold text-slate-800">{title}</p>
    </div>
  );
}
