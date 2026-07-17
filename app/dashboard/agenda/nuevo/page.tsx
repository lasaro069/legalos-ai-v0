import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { guardarEvento } from '../acciones'

export default async function NuevoEventoPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Obtener firma_id
  const { data: firmaData } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user.id)
    .single()
    
  if (!firmaData) return <div>No tienes acceso.</div>

  // Traer Expedientes activos de la firma
  const { data: expedientes } = await supabase
    .from('expedientes')
    .select('id, nombre, radicado')
    .eq('firma_id', firmaData.firma_id)
    .neq('estado', 'cerrado')
    .order('nombre', { ascending: true })

  // Traer abogados (miembros de la firma)
  const { data: abogados } = await supabase
    .from('miembros_firma')
    .select('id, usuarios(id, nombre_completo, email)')
    .eq('firma_id', firmaData.firma_id)

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {searchParams?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{searchParams.error}</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-legal-ink">Agendar Nuevo Evento</h2>
          <p className="text-sm text-legal-navy/80">Programa términos, audiencias o reuniones.</p>
        </div>
        <Link href="/dashboard/agenda" className="text-legal-blue hover:underline text-sm font-semibold">
          Cancelar y volver
        </Link>
      </div>

      <form action={guardarEvento} className="bg-white p-8 rounded-xl shadow-panel border border-legal-line flex flex-col gap-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="titulo" className="font-semibold text-sm text-legal-navy">Título / Asunto *</label>
            <input type="text" id="titulo" name="titulo" required className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="Ej. Audiencia de Conciliación" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tipo" className="font-semibold text-sm text-legal-navy">Tipo de Evento *</label>
            <select id="tipo" name="tipo" required className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white">
              <option value="termino_procesal">Término Procesal</option>
              <option value="audiencia">Audiencia</option>
              <option value="reunion">Reunión</option>
              <option value="vencimiento_interno">Vencimiento Interno</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="expediente_id" className="font-semibold text-sm text-legal-navy">Expediente Asociado (Opcional)</label>
            <select id="expediente_id" name="expediente_id" className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white">
              <option value="">-- Ninguno (Evento General) --</option>
              {expedientes?.map(exp => (
                <option key={exp.id} value={exp.id}>
                  {exp.nombre} {exp.radicado ? `(${exp.radicado})` : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="fecha_inicio" className="font-semibold text-sm text-legal-navy">Fecha y Hora de Inicio *</label>
            <input type="datetime-local" id="fecha_inicio" name="fecha_inicio" required className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fecha_fin" className="font-semibold text-sm text-legal-navy">Fecha y Hora de Fin (Opcional)</label>
            <input type="datetime-local" id="fecha_fin" name="fecha_fin" className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white" />
          </div>
          
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="descripcion" className="font-semibold text-sm text-legal-navy">Descripción o Notas</label>
            <textarea id="descripcion" name="descripcion" rows={3} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="Detalles, enlaces virtuales, etc."></textarea>
          </div>
          
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="responsable_id" className="font-semibold text-sm text-legal-navy">Abogado Responsable (Opcional)</label>
            <select id="responsable_id" name="responsable_id" className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white">
              <option value="">-- Asignar a... --</option>
              {abogados?.map(ab => (
                <option key={ab.id} value={ab.usuarios.id}>
                  {ab.usuarios.nombre_completo || ab.usuarios.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-legal-line">
          <button type="submit" className="bg-legal-gold hover:bg-yellow-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-transform hover:-translate-y-1">
            Programar Evento
          </button>
        </div>
      </form>
    </div>
  )
}
