"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarClock, CheckCircle2, CircleDollarSign, FileText, FileUp, Gavel, Paperclip, Save, ShieldAlert, Users } from "lucide-react";
import { AppShell, Header } from "@/components/sidebar";
import { Badge, Button, Card, CardHeader, Field, inputClass } from "@/components/ui";
import { useLegalStore } from "@/lib/store";
import { CaseStatus, DocumentCategory, DocumentType, LegalArea, Risk, legalAreas } from "@/types";
import { PartyRole, ProceedingType } from "@/types";

export default function NewCasePage() {
  const router = useRouter();
  const { clients, team, addCase, addCaseDocument, addCaseParty, addCaseProceeding, addCaseDeadline, addCaseFee } = useLegalStore();
  const [saved, setSaved] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<{ name: string; size: number }[]>([]);

  useEffect(() => {
    const clientId = new URLSearchParams(window.location.search).get("clientId");
    setSelectedClient(clientId ?? clients[0]?.id ?? "");
  }, [clients]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const initialFiles = form.getAll("initialFiles").filter((file): file is File => file instanceof File && Boolean(file.name));
    const created = addCase({
      name: String(form.get("name")),
      filingNumber: String(form.get("filingNumber") || "Sin radicado"),
      clientId: String(form.get("clientId")),
      city: String(form.get("city") || "Sin ciudad"),
      legalArea: String(form.get("legalArea")) as LegalArea,
      processType: String(form.get("processType")),
      proceduralStage: String(form.get("proceduralStage") || "Sin etapa definida"),
      status: String(form.get("status")) as CaseStatus,
      createdAt: new Date().toLocaleDateString("es-CO"),
      nextHearing: String(form.get("nextHearing")),
      criticalDeadline: String(form.get("initialDeadlineDate") || form.get("criticalDeadline") || "Sin termino inicial"),
      court: String(form.get("court") || "Sin juzgado definido"),
      counterparty: String(form.get("counterparty")),
      opposingCounsel: String(form.get("opposingCounsel")),
      amount: Number(form.get("amount") || 0),
      internalOwner: String(form.get("internalOwner")),
      assistantOwner: String(form.get("assistantOwner") || "") || undefined,
      risk: String(form.get("risk")) as Risk,
      description: String(form.get("description")),
      currentAction: String(form.get("currentAction") || form.get("initialProceedingTitle") || "Definir siguiente actuacion juridica")
    });
    if (String(form.get("extraPartyName") || "").trim()) {
      addCaseParty(created.id, {
        name: String(form.get("extraPartyName")),
        role: String(form.get("extraPartyRole")) as PartyRole,
        detail: String(form.get("extraPartyDetail")),
        isClient: false,
        isOpposing: String(form.get("extraPartyRole")) === "Contraparte" || String(form.get("extraPartyRole")) === "Demandado"
      });
    }
    if (String(form.get("initialProceedingTitle") || "").trim()) {
      addCaseProceeding(created.id, {
        type: String(form.get("initialProceedingType")) as ProceedingType,
        title: String(form.get("initialProceedingTitle")),
        date: String(form.get("initialProceedingDate") || new Date().toLocaleDateString("es-CO")),
        description: String(form.get("initialProceedingDescription") || "Primera actuacion registrada al crear el expediente."),
        origin: "Manual",
        owner: String(form.get("internalOwner")),
        sourceType: "Expediente",
        sourceId: created.id,
        createsTerm: Boolean(form.get("initialProceedingCreatesTerm"))
      });
    }
    if (String(form.get("initialDeadlineTitle") || "").trim() && String(form.get("initialDeadlineDate") || "").trim()) {
      addCaseDeadline(created.id, {
        title: String(form.get("initialDeadlineTitle")),
        date: String(form.get("initialDeadlineDate")),
        time: String(form.get("initialDeadlineTime") || "17:00"),
        type: String(form.get("initialDeadlineType") || "Termino procesal"),
        origin: "Manual",
        priority: String(form.get("initialDeadlinePriority") || "Media") as "Baja" | "Media" | "Alta",
        owner: String(form.get("internalOwner")),
        consequence: String(form.get("initialDeadlineConsequence") || "Riesgo procesal si no se atiende el termino."),
        sourceType: "Expediente",
        sourceId: created.id
      });
    }
    if (String(form.get("initialFeeConcept") || "").trim() && Number(form.get("initialFeeAmount") || 0) > 0) {
      addCaseFee(created.id, {
        concept: String(form.get("initialFeeConcept")),
        amount: Number(form.get("initialFeeAmount") || 0),
        status: String(form.get("initialFeeStatus") || "Por cobrar") as "Programado" | "Por cobrar" | "Vencido" | "Pagado",
        dueDate: String(form.get("initialFeeDueDate") || "")
      });
    }
    initialFiles.forEach((file) => {
      const type = inferDocumentType(file.name);
      addCaseDocument({
        title: file.name,
        type,
        category: inferDocumentCategory(type),
        caseId: created.id,
        association: "Expediente",
        sourceType: "Expediente",
        sourceId: created.id,
        status: "Pendiente",
        summary: `Archivo inicial cargado al crear expediente. Tamano: ${formatBytes(file.size)}. Pendiente de revision juridica.`
      });
    });
    setSaved(true);
    window.setTimeout(() => router.push(`/cases/${created.id}`), 700);
  }

  function updateSelectedFiles(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(Array.from(event.currentTarget.files ?? []).map((file) => ({ name: file.name, size: file.size })));
  }

  return (
    <AppShell>
      <Header title="Crear expediente" subtitle="Registra datos juridicos, responsables, partes, cuantia y primer termino operativo." />
      <div className="grid gap-5 p-5 xl:grid-cols-[1fr_360px] lg:p-8">
        <Card>
          <CardHeader title="Crear expediente profesional" subtitle="Primero lo obligatorio. Luego agrega contexto juridico y registros iniciales si ya los tienes." />
          <form onSubmit={submit} className="grid gap-5 p-5 md:grid-cols-2">
            <FormBlock icon={<ShieldAlert />} title="Campos obligatorios" subtitle="Con esto el expediente ya puede existir y operar.">
              <Field label="Nombre del expediente" hint="Usa una referencia clara para ubicarlo en segundos."><input name="name" required className={inputClass} placeholder="Ej. Alvarez vs. Aseguradora" /></Field>
              <Field label="Cliente"><select name="clientId" required className={inputClass} value={selectedClient} onChange={(event) => setSelectedClient(event.target.value)}>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></Field>
              <Field label="Area juridica"><select name="legalArea" required className={inputClass}>{legalAreas.map((area) => <option key={area}>{area}</option>)}</select></Field>
              <Field label="Tipo de proceso"><input name="processType" required className={inputClass} placeholder="Verbal, laboral, familia..." /></Field>
              <Field label="Abogado responsable"><select name="internalOwner" required className={inputClass}>{team.filter((member) => member.role === "Propietario" || member.role === "Abogado").map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field>
              <Field label="Estado"><select name="status" required className={inputClass}><option>En proceso</option><option>Investigacion</option><option>Conciliacion</option><option>Terminado</option><option>Archivado</option><option>Cerrado</option></select></Field>
            </FormBlock>

            <FormBlock icon={<FileText />} title="Datos juridicos opcionales" subtitle="Completa lo que tengas; el resto puede actualizarse desde el detalle.">
              <Field label="Radicado"><input name="filingNumber" className={inputClass} placeholder="11001400301220260045600" /></Field>
              <Field label="Juzgado / autoridad"><input name="court" className={inputClass} placeholder="Juzgado 12 Civil Municipal" /></Field>
              <Field label="Ciudad"><input name="city" className={inputClass} placeholder="Bogota" /></Field>
              <Field label="Etapa procesal"><input name="proceduralStage" className={inputClass} placeholder="Admisorio, pruebas, alegatos..." /></Field>
              <Field label="Contraparte"><input name="counterparty" className={inputClass} placeholder="Persona o empresa demandada" /></Field>
              <Field label="Apoderado contrario"><input name="opposingCounsel" className={inputClass} placeholder="Nombre del abogado contrario" /></Field>
              <Field label="Auxiliar asignado"><select name="assistantOwner" className={inputClass}><option value="">Sin auxiliar</option>{team.filter((member) => member.role === "Auxiliar Juridico").map((member) => <option key={member.id} value={member.name}>{member.name}</option>)}</select></Field>
              <Field label="Cuantia"><input name="amount" type="number" min="0" className={inputClass} placeholder="185000000" /></Field>
              <Field label="Proxima audiencia" hint="Ejemplo: Audiencia inicial - 15/07/2026"><input name="nextHearing" className={inputClass} placeholder="Audiencia inicial - 15/07/2026" /></Field>
              <Field label="Riesgo inicial"><select name="risk" className={inputClass}><option>Bajo</option><option>Medio</option><option>Alto</option></select></Field>
              <div className="md:col-span-2"><Field label="Siguiente actuacion esperada"><input name="currentAction" className={inputClass} placeholder="Preparar audiencia, radicar memorial o cerrar pruebas" /></Field></div>
              <div className="md:col-span-2"><Field label="Descripcion ejecutiva"><textarea name="description" className={`${inputClass} min-h-28 py-3`} placeholder="Resumen del caso, riesgo principal y contexto procesal" /></Field></div>
            </FormBlock>

            <FormBlock icon={<Users />} title="Partes procesales iniciales" subtitle="Cliente y contraparte quedan en el expediente; agrega una parte adicional si aplica.">
              <Field label="Parte adicional"><input name="extraPartyName" className={inputClass} placeholder="Tercero, autoridad, apoderado, demandado adicional..." /></Field>
              <Field label="Rol"><select name="extraPartyRole" className={inputClass}><option>Demandante</option><option>Demandado</option><option>Contraparte</option><option>Tercero</option><option>Apoderado</option><option>Autoridad</option><option>Otro</option></select></Field>
              <div className="md:col-span-2"><Field label="Detalle"><input name="extraPartyDetail" className={inputClass} placeholder="Documento, relacion procesal, apoderado o nota relevante" /></Field></div>
            </FormBlock>

            <FormBlock icon={<Gavel />} title="Primera actuacion opcional" subtitle="Si el expediente ya viene con una providencia, memorial o evento inicial, registralo desde el nacimiento.">
              <Field label="Tipo"><select name="initialProceedingType" className={inputClass}><option>Demanda</option><option>Contestacion</option><option>Auto</option><option>Sentencia</option><option>Recurso</option><option>Notificacion</option><option>Audiencia</option><option>Memorial</option><option>Otra</option></select></Field>
              <Field label="Titulo"><input name="initialProceedingTitle" className={inputClass} placeholder="Auto admisorio, radicacion de demanda..." /></Field>
              <Field label="Fecha"><input name="initialProceedingDate" className={inputClass} placeholder="10/06/2026" /></Field>
              <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-slate-700"><input name="initialProceedingCreatesTerm" type="checkbox" /> Puede generar termino</label>
              <div className="md:col-span-2"><Field label="Descripcion"><input name="initialProceedingDescription" className={inputClass} placeholder="Que ocurrio y que implica para el expediente" /></Field></div>
            </FormBlock>

            <FormBlock icon={<CalendarClock />} title="Primer termino opcional" subtitle="Registra el primer plazo si ya existe. No se obliga a inventarlo.">
              <Field label="Termino"><input name="initialDeadlineTitle" className={inputClass} placeholder="Contestar traslado, radicar memorial..." /></Field>
              <Field label="Fecha limite"><input name="initialDeadlineDate" className={inputClass} placeholder="10/06/2026" /></Field>
              <Field label="Hora"><input name="initialDeadlineTime" className={inputClass} defaultValue="17:00" /></Field>
              <Field label="Tipo"><input name="initialDeadlineType" className={inputClass} placeholder="Termino procesal" /></Field>
              <Field label="Prioridad"><select name="initialDeadlinePriority" className={inputClass}><option>Media</option><option>Alta</option><option>Baja</option></select></Field>
              <Field label="Termino principal visible"><input name="criticalDeadline" className={inputClass} placeholder="Si quieres mostrar una fecha critica general" /></Field>
              <div className="md:col-span-2"><Field label="Riesgo / consecuencia"><input name="initialDeadlineConsequence" className={inputClass} placeholder="Que pasa si no se cumple este termino" /></Field></div>
            </FormBlock>

            <FormBlock icon={<CircleDollarSign />} title="Honorarios iniciales opcionales" subtitle="Deja una base financiera si ya se pacto honorario o anticipo.">
              <Field label="Concepto"><input name="initialFeeConcept" className={inputClass} placeholder="Anticipo, cuota inicial, honorarios..." /></Field>
              <Field label="Monto"><input name="initialFeeAmount" type="number" min="0" className={inputClass} /></Field>
              <Field label="Estado"><select name="initialFeeStatus" className={inputClass}><option>Por cobrar</option><option>Programado</option><option>Vencido</option><option>Pagado</option></select></Field>
              <Field label="Fecha de cobro"><input name="initialFeeDueDate" className={inputClass} placeholder="15/07/2026" /></Field>
            </FormBlock>

            <div className="md:col-span-2">
              <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-950"><FileUp className="h-4 w-4 text-legal-blue" /> Documentos iniciales</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">Carga demanda, poder, anexos o pruebas para que nazcan asociados al expediente.</p>
                  </div>
                  <label className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-legal-blue px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                    <Paperclip className="h-4 w-4" />
                    Seleccionar archivos
                    <input name="initialFiles" type="file" multiple className="sr-only" onChange={updateSelectedFiles} />
                  </label>
                </div>
                {selectedFiles.length ? <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {selectedFiles.map((file) => (
                    <div key={`${file.name}-${file.size}`} className="rounded-md border border-blue-100 bg-white p-3 text-sm">
                      <p className="font-semibold text-slate-900">{file.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatBytes(file.size)} - se guardara como documento pendiente</p>
                    </div>
                  ))}
                </div> : <p className="mt-3 text-xs font-semibold text-slate-500">Sin archivos seleccionados. Puedes crear el expediente y cargarlos despues desde Documentos.</p>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-legal-line pt-5 md:col-span-2">
              <Button type="submit"><Save className="h-4 w-4" /> Guardar expediente</Button>
              <Link href="/cases" className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-legal-line bg-white px-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /> Cancelar</Link>
              {saved ? <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Expediente creado. Abriendo detalle...</span> : null}
            </div>
          </form>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <Badge tone="blue">Expediente operativo</Badge>
            <h2 className="mt-4 text-xl font-bold text-slate-950">El expediente nace con responsables, partes y plazos claros.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Desde el detalle se podran agregar documentos, pruebas, anexos, audiencias, tareas, terminos, notas y honorarios.</p>
          </Card>
          <Card>
            <CardHeader title="Checklist de calidad" />
            <div className="space-y-3 p-5">
              <Checklist icon={<ShieldAlert />} title="Riesgo inicial definido" />
              <Checklist icon={<CalendarClock />} title="Termino inicial opcional" />
              <Checklist icon={<FileText />} title="Actuacion o documento inicial si existe" />
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Checklist({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-legal-line bg-slate-50 p-3">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-white text-legal-blue shadow-sm [&_svg]:h-4 [&_svg]:w-4">{icon}</div>
      <p className="text-sm font-bold text-slate-800">{title}</p>
    </div>
  );
}

function FormBlock({ icon, title, subtitle, children }: { icon: ReactNode; title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 rounded-lg border border-legal-line bg-slate-50/60 p-4 md:col-span-2 md:grid-cols-2">
      <div className="md:col-span-2">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-legal-blue shadow-sm [&_svg]:h-4 [&_svg]:w-4">{icon}</div>
          <div>
            <h2 className="text-sm font-bold text-slate-950">{title}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

function inferDocumentType(fileName: string): DocumentType {
  const name = fileName.toLowerCase();
  if (name.includes("demanda")) return "Demanda";
  if (name.includes("contestacion")) return "Contestacion";
  if (name.includes("poder")) return "Poder";
  if (name.includes("memorial")) return "Memorial";
  if (name.includes("auto")) return "Auto";
  if (name.includes("sentencia")) return "Sentencia";
  if (name.includes("contrato")) return "Contrato";
  if (name.includes("prueba")) return "Prueba";
  if (name.includes("anexo")) return "Anexo";
  if (name.includes("correo") || name.includes("comunicacion")) return "Comunicacion";
  return "Otro";
}

function inferDocumentCategory(type: DocumentType): DocumentCategory {
  if (type === "Prueba") return "Prueba";
  if (type === "Anexo") return "Anexo";
  if (type === "Comunicacion") return "Comunicacion";
  return "Documento";
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
