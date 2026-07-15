import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { registrarActuacion } from '../acciones'

export default async function NuevaActuacionPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: expediente, error } = await supabase
    .from('expedientes')
    .select('id, nombre, radicado')
    .eq('id', params.id)
    .single()

  if (error || !expediente) {
    notFound()
  }

  const tiposActuacion = [
    'demanda', 'admision', 'inadmision', 'rechazo', 'contestacion', 
    'auto', 'notificacion', 'traslado', 'memorial', 'requerimiento', 
    'audiencia', 'sentencia', 'recurso', 'conciliacion', 'comunicacion', 'otra'
  ]

  // Para el defaultValue de input type="date", necesitamos el formato ISO de "hoy" (YYYY-MM-DD)
  // Al ser un Server Component, Date() usa el timezone del servidor (UTC).
  const hoyStr = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/dashboard/expedientes/${expediente.id}`} className="text-legal-navy hover:text-legal-gold">
          ← Volver
        </Link>
        <h2 className="text-2xl font-bold text-legal-ink">Registrar Actuación</h2>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line">
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm">
          <strong>Expediente:</strong> {expediente.nombre} <br/>
          <span className="text-gray-500">Radicado: {expediente.radicado || 'S/N'}</span>
        </div>

        <form action={registrarActuacion} className="flex flex-col gap-6">
          <input type="hidden" name="expediente_id" value={expediente.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="tipo" className="font-semibold text-sm text-legal-navy">Tipo de Actuación *</label>
              <select id="tipo" name="tipo" required className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white capitalize">
                {tiposActuacion.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="fecha_juridica" className="font-semibold text-sm text-legal-navy">Fecha Jurídica *</label>
              <input type="date" id="fecha_juridica" name="fecha_juridica" required defaultValue={hoyStr} className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="titulo" className="font-semibold text-sm text-legal-navy">Título / Resumen *</label>
            <input type="text" id="titulo" name="titulo" required placeholder="Ej. Auto Admisorio de la Demanda" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="descripcion" className="font-semibold text-sm text-legal-navy">Descripción Detallada</label>
            <textarea id="descripcion" name="descripcion" rows={4} placeholder="Decisión del juez, observaciones..." className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold"></textarea>
          </div>

          <div className="flex flex-col gap-2 p-4 border border-dashed border-legal-gold/50 bg-yellow-50/30 rounded-lg">
            <label htmlFor="archivo" className="font-semibold text-sm text-legal-navy">Documento Adjunto (Opcional)</label>
            <input type="file" id="archivo" name="archivo" accept=".pdf,.png,.jpg,.jpeg" className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-legal-navy file:text-white hover:file:bg-legal-obsidian cursor-pointer transition-colors" />
            <p className="text-xs text-gray-500 mt-1">Sube el PDF de la providencia o constancia.</p>
          </div>

          <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-legal-line/30">
            <Link href={`/dashboard/expedientes/${expediente.id}`} className="px-6 py-2 border border-legal-line text-legal-navy rounded font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2 bg-legal-gold text-white rounded font-medium hover:bg-yellow-600 shadow-sm transition-colors">
              Guardar Actuación
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
