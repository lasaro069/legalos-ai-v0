import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Calendar, Clock, Briefcase, CheckCircle, XCircle, ArrowLeft, User, FileText, CalendarClock } from 'lucide-react'
import { cambiarEstadoEvento, aplazarEvento } from '../acciones'

const tipoLabels: Record<string, string> = {
  termino_procesal: 'Término Procesal',
  audiencia: 'Audiencia',
  reunion: 'Reunión',
  vencimiento_interno: 'Venc. Interno',
  otro: 'Otro'
}

export default async function EventoDetallePage({ params }: { params: { id: string } }) {
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

  // Obtener detalle del evento
  const { data: evento, error } = await supabase
    .from('eventos_agenda')
    .select(`
      *,
      expedientes(id, nombre, radicado),
      creador:usuarios!eventos_agenda_creado_por_fkey(nombre_completo, email),
      responsable:usuarios!eventos_agenda_responsable_id_fkey(nombre_completo, email)
    `)
    .eq('id', params.id)
    .eq('firma_id', firmaData.firma_id)
    .single()

  if (error || !evento) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Evento no encontrado</h2>
        <p className="text-slate-500 mb-6">El evento que buscas no existe o no tienes acceso a él.</p>
        <Link href="/dashboard/agenda" className="text-legal-blue hover:underline">Volver a la Agenda</Link>
      </div>
    )
  }

  const fechaInicio = new Date(evento.fecha_inicio)
  
  // Format for the "Aplazar" input value (YYYY-MM-DDThh:mm) in Bogota timezone
  const formatterYMD = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' })
  const ymd = formatterYMD.format(fechaInicio)
  const formatterTime = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bogota', hour12: false, hour: '2-digit', minute: '2-digit' })
  const timeStr = formatterTime.format(fechaInicio) // Usually HH:MM
  
  // Combine to create the local datetime string required by <input type="datetime-local">
  const localDatetimeStr = `${ymd}T${timeStr.padStart(5, '0')}`

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Link href="/dashboard/agenda" className="text-sm font-semibold text-legal-blue hover:text-legal-navy transition-colors flex items-center gap-1 mb-6">
        <ArrowLeft size={16} /> Volver a la Agenda
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Cabecera del Evento */}
        <div className="p-8 border-b border-slate-100 relative">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-legal-blue/10 text-legal-blue">
              {tipoLabels[evento.tipo] || evento.tipo}
            </span>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider
              ${evento.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' :
                evento.estado === 'realizada' ? 'bg-emerald-100 text-emerald-700' :
                evento.estado === 'vencida' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
              Estado: {evento.estado}
            </span>
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 mb-4">{evento.titulo}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="text-slate-400" size={18} />
              <span className="font-medium">{fechaInicio.toLocaleDateString('es-CO', { timeZone: 'America/Bogota', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-slate-400" size={18} />
              <span className="font-medium">{fechaInicio.toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Detalles (Izquierda) */}
          <div className="md:col-span-2 p-8 space-y-8 bg-slate-50/30">
            
            {evento.expediente_id && evento.expedientes && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Briefcase size={14} /> Expediente Vinculado
                </h3>
                <p className="font-semibold text-slate-800 text-base mb-1">{evento.expedientes.nombre}</p>
                {evento.expedientes.radicado && (
                  <p className="text-slate-500 text-sm font-mono mb-4">Radicado: {evento.expedientes.radicado}</p>
                )}
                <Link href={`/dashboard/expedientes/${evento.expediente_id}`} className="inline-block bg-legal-navy hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
                  Abrir Expediente
                </Link>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <FileText size={14} /> Descripción / Notas
              </h3>
              <div className="bg-white p-5 rounded-xl border border-slate-200 min-h-[100px] text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                {evento.descripcion || <span className="text-slate-400 italic">No hay descripción adicional para este evento.</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <User size={12} /> Creado por
                </h3>
                <p className="text-sm font-medium text-slate-700">{evento.creador?.nombre_completo || evento.creador?.email || 'Desconocido'}</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <User size={12} /> Responsable
                </h3>
                <p className="text-sm font-medium text-slate-700">{evento.responsable?.nombre_completo || evento.responsable?.email || 'Sin asignar'}</p>
              </div>
            </div>

          </div>

          {/* Acciones (Derecha) */}
          <div className="p-6 bg-white flex flex-col gap-8">
            
            {evento.estado === 'pendiente' || evento.estado === 'vencida' ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Resolución</h3>
                
                <form action={cambiarEstadoEvento.bind(null, evento.id, 'realizada')}>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold py-2.5 px-4 rounded-xl transition-colors">
                    <CheckCircle size={18} /> Marcar Cumplida
                  </button>
                </form>

                <form action={cambiarEstadoEvento.bind(null, evento.id, 'cancelada')}>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-200 font-bold py-2.5 px-4 rounded-xl transition-colors">
                    <XCircle size={18} /> Cancelar Evento
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
                <p className="text-sm font-medium text-slate-600">Este evento ya está resuelto.</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Aplazar / Reprogramar</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Si necesitas cambiar la fecha, actualízala aquí. El evento volverá a estado pendiente con la nueva fecha.
              </p>
              
              <form action={aplazarEvento} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={evento.id} />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Nueva Fecha y Hora</label>
                  <input 
                    type="datetime-local" 
                    name="nueva_fecha" 
                    defaultValue={localDatetimeStr}
                    required 
                    className="border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-legal-gold/50" 
                  />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-2 px-4 rounded-lg transition-colors shadow-sm text-sm">
                  <CalendarClock size={16} /> Guardar Cambios
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
