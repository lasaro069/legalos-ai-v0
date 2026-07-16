import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { guardarExpediente } from '../acciones'
import { redirect } from 'next/navigation'

export default async function NuevoExpedientePage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }
  
  // Fetch miembros de la firma para el selector de responsable
  const { data: firmaData } = await supabase
    .from('miembros_firma')
    .select('id, firma_id, rol')
    .eq('usuario_id', user.id)
    .single()
    
  if (!firmaData) {
    return <div>No tienes permiso para crear expedientes en esta firma.</div>
  }
  
  const { data: abogados } = await supabase
    .from('miembros_firma')
    .select('id, usuarios(id, nombre_completo, email)')
    .eq('firma_id', firmaData.firma_id)

  const { data: contactos } = await supabase
    .from('contactos')
    .select('id, nombre, identificacion')
    .eq('firma_id', firmaData.firma_id)
    .order('nombre', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto">
      {searchParams?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error de base de datos: </strong>
          <span className="block sm:inline">{searchParams.error}</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-legal-ink">Crear Nuevo Expediente</h2>
          <p className="text-sm text-legal-navy/80">Ingresa los detalles básicos para abrir un caso en la plataforma.</p>
        </div>
        <Link href="/dashboard/expedientes" className="text-legal-blue hover:underline text-sm font-semibold">
          Cancelar y volver
        </Link>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line">
        <form action={guardarExpediente} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="nombre" className="font-semibold text-sm text-legal-navy">Nombre del Expediente *</label>
              <input type="text" id="nombre" name="nombre" required className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" placeholder="Ej. Sucesión Familia Pérez" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="radicado" className="font-semibold text-sm text-legal-navy">Número de Radicado</label>
              <input type="text" id="radicado" name="radicado" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" placeholder="Ej. 11001310303520230012300" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cliente_id" className="font-semibold text-sm text-legal-navy">Cliente Principal (Del Directorio) *</label>
              <select id="cliente_id" name="cliente_id" required className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white">
                <option value="">-- Seleccione un cliente --</option>
                {contactos?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.nombre} {c.identificacion ? `(${c.identificacion})` : ''}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Si el cliente no existe, primero debes crearlo en el Directorio.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="partes" className="font-semibold text-sm text-legal-navy">Otras Partes Procesales</label>
              <input type="text" id="partes" name="partes" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" placeholder="Ej. Demandado: Carlos Ramírez" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="riesgo" className="font-semibold text-sm text-legal-navy">Nivel de Riesgo</label>
              <select id="riesgo" name="riesgo" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white">
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="responsable_id" className="font-semibold text-sm text-legal-navy">Abogado Responsable</label>
              <select id="responsable_id" name="responsable_id" defaultValue={firmaData.id} className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white">
                {abogados?.map((ab: any) => (
                  <option key={ab.id} value={ab.id}>
                    {ab.usuarios.nombre_completo || ab.usuarios.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="descripcion" className="font-semibold text-sm text-legal-navy">Descripción / Hechos Clave</label>
            <textarea id="descripcion" name="descripcion" rows={4} className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" placeholder="Resumen del caso..."></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-legal-gold hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg shadow transition-colors">
              Guardar Expediente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
