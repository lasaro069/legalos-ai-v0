import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Calendar, Clock, AlertCircle, CalendarPlus, Briefcase, ChevronRight } from 'lucide-react'

// Helper to determine the group of an event based on its date
function getEventGroup(dateStr: string) {
  const eventDate = new Date(dateStr)
  const today = new Date()
  
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' })
  const eventYMD = formatter.format(eventDate)
  const todayYMD = formatter.format(today)
  
  const eventDay = new Date(`${eventYMD}T00:00:00`)
  const currentDay = new Date(`${todayYMD}T00:00:00`)
  
  const diffTime = eventDay.getTime() - currentDay.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'vencidos'
  if (diffDays === 0) return 'hoy'
  if (diffDays > 0 && diffDays <= 7) return 'esta_semana'
  return 'proximamente'
}

const tipoLabels: Record<string, string> = {
  termino_procesal: 'Término Procesal',
  audiencia: 'Audiencia',
  reunion: 'Reunión',
  vencimiento_interno: 'Venc. Interno',
  otro: 'Otro'
}

export default async function AgendaPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 1. Identificar la firma
  const { data: miembros } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user.id)

  const firmaIds = miembros?.map(m => m.firma_id) || []
  if (firmaIds.length === 0) return <div>No tienes acceso.</div>

  // 2. Traer Eventos (Solo pendientes o vencidos que no hayan sido "realizados")
  const { data: eventos, error } = await supabase
    .from('eventos_agenda')
    .select('*, expedientes(nombre, radicado)')
    .in('firma_id', firmaIds)
    .not('estado', 'in', '("realizada","cancelada")')
    .order('fecha_inicio', { ascending: true })

  // 3. Agrupar eventos
  const groups: Record<string, any[]> = {
    vencidos: [],
    hoy: [],
    esta_semana: [],
    proximamente: []
  }

  if (eventos) {
    eventos.forEach(evt => {
      const groupKey = getEventGroup(evt.fecha_inicio)
      groups[groupKey].push(evt)
    })
  }

  const renderEventList = (list: any[], emptyMessage: string) => {
    if (list.length === 0) {
      return (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
          {emptyMessage}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        {list.map(evt => {
          const date = new Date(evt.fecha_inicio)
          const isOverdue = getEventGroup(evt.fecha_inicio) === 'vencidos'
          
          return (
            <div key={evt.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg shrink-0 mt-1 flex flex-col items-center justify-center min-w-[50px]
                  ${isOverdue ? 'bg-red-50 text-red-600' : 'bg-legal-blue/10 text-legal-blue'}`}>
                  <span className="text-xs font-bold uppercase">{date.toLocaleDateString('es-CO', { timeZone: 'America/Bogota', month: 'short' })}</span>
                  <span className="text-lg font-black leading-none">{date.toLocaleDateString('es-CO', { timeZone: 'America/Bogota', day: 'numeric' })}</span>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full
                      ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                      {tipoLabels[evt.tipo] || evt.tipo}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Clock size={12} /> {date.toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className={`font-bold text-base mb-1 ${isOverdue ? 'text-red-700' : 'text-slate-800'}`}>
                    {evt.titulo}
                  </h4>
                  {evt.expedientes && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <Briefcase size={14} className="text-legal-gold" />
                      <span className="truncate max-w-[200px] md:max-w-md">{evt.expedientes.nombre}</span>
                      {evt.expedientes.radicado && <span className="text-slate-400 font-mono">({evt.expedientes.radicado})</span>}
                    </div>
                  )}
                  {!evt.expedientes && (
                    <p className="text-xs text-slate-500 italic">Evento general (Sin expediente)</p>
                  )}
                </div>
              </div>
              
              <Link href={`/dashboard/agenda/${evt.id}`} className="opacity-0 group-hover:opacity-100 p-2 text-legal-blue hover:bg-blue-50 rounded-full transition-all flex items-center justify-center">
                <ChevronRight size={20} />
              </Link>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Calendar className="text-legal-gold" size={32} />
            Agenda y Vencimientos
          </h2>
          <p className="text-sm text-slate-500 mt-1">Gestión de términos procesales, audiencias y reuniones.</p>
        </div>
        <Link 
          href="/dashboard/agenda/nuevo" 
          className="bg-legal-gold hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
        >
          <CalendarPlus size={18} /> Nuevo Evento
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
          <strong>Error cargando la agenda:</strong> {error.message}
        </div>
      )}

      <div className="space-y-10">
        
        {/* VENCIDOS */}
        {groups.vencidos.length > 0 && (
          <section>
            <h3 className="text-lg font-black text-red-600 flex items-center gap-2 mb-4 border-b border-red-100 pb-2">
              <AlertCircle size={20} /> Retrasados / Vencidos
            </h3>
            {renderEventList(groups.vencidos, '')}
          </section>
        )}

        {/* HOY */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
            Hoy
          </h3>
          {renderEventList(groups.hoy, 'No tienes eventos programados para hoy.')}
        </section>

        {/* ESTA SEMANA */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
            Próximos 7 días
          </h3>
          {renderEventList(groups.esta_semana, 'No hay eventos en los próximos 7 días.')}
        </section>

        {/* PROXIMAMENTE */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
            Más Adelante
          </h3>
          {renderEventList(groups.proximamente, 'No hay eventos programados a futuro.')}
        </section>

      </div>
    </div>
  )
}
