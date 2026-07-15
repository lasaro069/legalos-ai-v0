import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { guardarEvento } from '../acciones'

export default async function NuevoEventoPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: miembros } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user.id)

  const firmaIds = miembros?.map(m => m.firma_id) || []

  // Obtener expedientes para el select
  const { data: expedientes } = await supabase
    .from('expedientes')
    .select('id, nombre, radicado')
    .in('firma_id', firmaIds)

  const tiposEvento = [
    'termino_procesal', 'audiencia', 'reunion', 'vencimiento_interno', 'otro'
  ]

  const hoy = new Date().toISOString().slice(0, 16)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/agenda" className="text-legal-navy hover:text-legal-gold">
          ← Volver
        </Link>
        <h2 className="text-2xl font-bold text-legal-ink">Nuevo Vencimiento / Término</h2>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line">
        <form action={guardarEvento} className="flex flex-col gap-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="tipo" className="font-semibold text-sm text-legal-navy">Tipo de Evento *</label>
              <select id="tipo" name="tipo" required className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white">
                {tiposEvento.map(t => (
                  <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="fecha_inicio" className="font-semibold text-sm text-legal-navy">Fecha límite / Fecha de Inicio *</label>
              <input type="datetime-local" id="fecha_inicio" name="fecha_inicio" required defaultValue={hoy} className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="titulo" className="font-semibold text-sm text-legal-navy">Título / Resumen *</label>
            <input type="text" id="titulo" name="titulo" required placeholder="Ej. Contestación de demanda, Audiencia inicial" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="expediente_id" className="font-semibold text-sm text-legal-navy">Vincular a Expediente (Opcional)</label>
            <select id="expediente_id" name="expediente_id" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white">
              <option value="">-- Ninguno (Evento administrativo) --</option>
              {expedientes?.map(exp => (
                <option key={exp.id} value={exp.id}>
                  {exp.radicado ? `[${exp.radicado}] ` : ''}{exp.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="descripcion" className="font-semibold text-sm text-legal-navy">Notas adicionales</label>
            <textarea id="descripcion" name="descripcion" rows={3} placeholder="Link de zoom, observaciones..." className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold"></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-legal-line/30">
            <Link href="/dashboard/agenda" className="px-6 py-2 border border-legal-line text-legal-navy rounded font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2 bg-legal-gold text-white rounded font-medium hover:bg-yellow-600 shadow-sm transition-colors">
              Guardar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
