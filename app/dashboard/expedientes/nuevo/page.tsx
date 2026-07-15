import { createClient } from '@/utils/supabase/server'
import { crearExpediente } from '../acciones'
import Link from 'next/link'

export default async function NuevoExpedientePage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch miembros de la firma para el selector de responsable
  const { data: firmaData } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user?.id)
    .single()

  let miembros = []
  if (firmaData?.firma_id) {
    const { data } = await supabase
      .from('miembros_firma')
      .select('id, usuarios(nombre_completo)')
      .eq('firma_id', firmaData.firma_id)
      
    miembros = data || []
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/expedientes" className="text-legal-navy hover:text-legal-gold">
          ← Volver
        </Link>
        <h2 className="text-2xl font-bold text-legal-ink">Nuevo Expediente</h2>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line">
        <form action={crearExpediente} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="font-semibold text-sm text-legal-navy">Nombre del Caso / Expediente *</label>
              <input type="text" id="nombre" name="nombre" required className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" placeholder="Ej. Sucesión Pérez" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="radicado" className="font-semibold text-sm text-legal-navy">Radicado</label>
              <input type="text" id="radicado" name="radicado" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" placeholder="Ej. 11001-31-03-001-2023-00123-00" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cliente" className="font-semibold text-sm text-legal-navy">Cliente</label>
              <input type="text" id="cliente" name="cliente" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" placeholder="Nombre del cliente" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="partes" className="font-semibold text-sm text-legal-navy">Partes Involucradas</label>
              <input type="text" id="partes" name="partes" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" placeholder="Demandante / Demandado" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="descripcion" className="font-semibold text-sm text-legal-navy">Descripción o Hechos Clave</label>
            <textarea id="descripcion" name="descripcion" rows={4} className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" placeholder="Detalles iniciales del caso..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-legal-line/30">
            <div className="flex flex-col gap-2">
              <label htmlFor="riesgo" className="font-semibold text-sm text-legal-navy">Nivel de Riesgo</label>
              <select id="riesgo" name="riesgo" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white">
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
                <option value="critico">Crítico</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="prioridad" className="font-semibold text-sm text-legal-navy">Prioridad</label>
              <select id="prioridad" name="prioridad" defaultValue="normal" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white">
                <option value="baja">Baja</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="responsable_id" className="font-semibold text-sm text-legal-navy">Responsable Principal</label>
              <select id="responsable_id" name="responsable_id" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white">
                <option value="">Seleccionar responsable...</option>
                {miembros.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.usuarios?.nombre_completo || 'Usuario sin nombre'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Link href="/dashboard/expedientes" className="px-6 py-2 border border-legal-line text-legal-navy rounded font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2 bg-legal-gold text-white rounded font-medium hover:bg-yellow-600 shadow-sm transition-colors">
              Crear Expediente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
