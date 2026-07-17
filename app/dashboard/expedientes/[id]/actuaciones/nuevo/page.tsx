import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { guardarActuacion } from '../../../acciones'

const tiposActuacion = [
  'demanda', 'admision', 'inadmision', 'rechazo', 'contestacion', 
  'auto', 'notificacion', 'traslado', 'memorial', 'requerimiento', 
  'audiencia', 'sentencia', 'recurso', 'conciliacion', 'comunicacion', 'otra'
]

export default async function NuevaActuacionPage({
  params,
  searchParams,
}: {
  params: { id: string },
  searchParams?: { error?: string }
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Validar acceso al expediente
  const { data: expediente, error: expError } = await supabase
    .from('expedientes')
    .select('id, nombre, radicado')
    .eq('id', params.id)
    .single()

  if (expError || !expediente) {
    return <div>Expediente no encontrado o sin acceso.</div>
  }

  // Obtener fecha actual en zona horaria local (Bogota) para el default value
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' })
  const hoyStr = formatter.format(new Date()) // YYYY-MM-DD

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
          <h2 className="text-2xl font-bold text-slate-900">Registrar Actuación</h2>
          <p className="text-sm text-slate-500 mt-1">
            Para el expediente: <strong>{expediente.nombre}</strong> {expediente.radicado && `(${expediente.radicado})`}
          </p>
        </div>
        <Link href={`/dashboard/expedientes/${expediente.id}`} className="text-legal-blue hover:underline text-sm font-semibold">
          Cancelar y volver
        </Link>
      </div>

      <form action={guardarActuacion} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
        <input type="hidden" name="expediente_id" value={expediente.id} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="titulo" className="font-semibold text-sm text-slate-800">Título de la Actuación *</label>
            <input type="text" id="titulo" name="titulo" required className="border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-blue/50" placeholder="Ej. Auto admisorio de la demanda" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tipo" className="font-semibold text-sm text-slate-800">Tipo de Actuación *</label>
            <select id="tipo" name="tipo" required className="border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-blue/50 bg-white capitalize">
              {tiposActuacion.map(tipo => (
                <option key={tipo} value={tipo}>{tipo.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="fecha_juridica" className="font-semibold text-sm text-slate-800">Fecha del Documento/Actuación *</label>
            <input 
              type="date" 
              id="fecha_juridica" 
              name="fecha_juridica" 
              defaultValue={hoyStr}
              required 
              className="border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-blue/50 bg-white" 
            />
          </div>
          
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="descripcion" className="font-semibold text-sm text-slate-800">Descripción o Resumen</label>
            <textarea id="descripcion" name="descripcion" rows={4} className="border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-blue/50" placeholder="Resumen de las decisiones o puntos clave del documento..."></textarea>
          </div>
          
          <div className="flex flex-col gap-2 md:col-span-2 bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300">
            <label htmlFor="documento" className="font-bold text-sm text-slate-800 mb-1">Subir Documento (Opcional)</label>
            <p className="text-xs text-slate-500 mb-3">Adjunta el PDF, foto o documento relacionado a esta actuación.</p>
            <input 
              type="file" 
              id="documento" 
              name="documento" 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-legal-blue file:text-white hover:file:bg-legal-navy file:cursor-pointer cursor-pointer text-sm text-slate-600" 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 mt-2">
          <button type="submit" className="bg-legal-navy hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-transform hover:-translate-y-0.5">
            Registrar Actuación
          </button>
        </div>
      </form>
    </div>
  )
}
