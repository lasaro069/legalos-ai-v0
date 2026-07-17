import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertTriangle, Briefcase, CalendarClock, DollarSign, TrendingUp, ChevronRight, Clock } from 'lucide-react'

export default async function DashboardPage() {
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
  if (firmaIds.length === 0) return <div>No perteneces a ninguna firma.</div>

  // 2. Traer Expedientes Activos para KPIs
  const { data: expedientesActivos } = await supabase
    .from('expedientes')
    .select('riesgo, cuantia')
    .in('firma_id', firmaIds)
    .eq('estado', 'activo')

  const expedientesActivosCount = expedientesActivos?.length || 0;
  
  let casosEnRiesgo = 0;
  let cuantiaTotal = 0;
  
  expedientesActivos?.forEach(exp => {
    if (exp.riesgo === 'alto' || exp.riesgo === 'critico') casosEnRiesgo++;
    if (exp.cuantia) cuantiaTotal += Number(exp.cuantia);
  });

  const formatCOP = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  // 3. Traer Vencimientos (Alertas Urgentes)
  const hoyStr = new Date().toISOString()
  const { data: eventosUrgentes } = await supabase
    .from('eventos_agenda')
    .select('*, expedientes(nombre)')
    .in('firma_id', firmaIds)
    .neq('estado', 'realizada')
    .neq('estado', 'cancelada')
    .order('fecha_inicio', { ascending: true })
    .limit(8)

  // 4. Traer Últimas Actuaciones (Recientes)
  const { data: ultimasActuaciones } = await supabase
    .from('actuaciones')
    .select('*, expedientes!inner(firma_id, nombre, radicado), responsable:usuarios!actuaciones_creado_por_fkey(nombre_completo)')
    .in('expedientes.firma_id', firmaIds)
    .order('created_at', { ascending: false })
    .limit(10)

  // Cálculo de KPIs de eventos
  let eventosVencidos = 0
  let eventosProximos = 0
  
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' })
  const hoyYMD = formatter.format(new Date())
  const hoyStrBog = new Date(`${hoyYMD}T00:00:00`)

  eventosUrgentes?.forEach(e => {
    const eventYMD = formatter.format(new Date(e.fecha_inicio))
    const fechaStrBog = new Date(`${eventYMD}T00:00:00`)
    
    const diffDias = Math.round((fechaStrBog.getTime() - hoyStrBog.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDias < 0) eventosVencidos++
    if (diffDias >= 0 && diffDias <= 3) eventosProximos++
  })

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bandeja del Día</h2>
          <p className="text-sm text-slate-500 mt-1">Resumen general y alertas tempranas de tu firma.</p>
        </div>
        <Link href="/dashboard/expedientes/nuevo" className="hidden md:flex items-center gap-2 bg-legal-blue hover:bg-legal-navy text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <span>+ Nuevo Expediente</span>
        </Link>
      </div>
      
      {/* TARJETAS KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* KPI 1: Expedientes Activos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase size={64} className="text-legal-blue" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-50 text-legal-blue p-2 rounded-lg">
                <Briefcase size={20} />
              </div>
              <p className="text-sm text-slate-600 font-medium">Expedientes Activos</p>
            </div>
            <p className="text-3xl font-black text-slate-900">{expedientesActivosCount}</p>
          </div>
        </div>

        {/* KPI 2: Casos en Riesgo Crítico/Alto */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle size={64} className="text-red-600" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-50 text-red-600 p-2 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <p className="text-sm text-slate-600 font-medium">Riesgo Alto / Crítico</p>
            </div>
            <p className="text-3xl font-black text-slate-900">{casosEnRiesgo}</p>
          </div>
        </div>

        {/* KPI 3: Cuantía Activa (Monetario) */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden group text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={64} className="text-emerald-400" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/10 text-emerald-400 p-2 rounded-lg backdrop-blur-sm">
                <DollarSign size={20} />
              </div>
              <p className="text-sm text-slate-300 font-medium">Cuantía Activa</p>
            </div>
            <p className="text-2xl font-black text-white truncate" title={formatCOP(cuantiaTotal)}>
              {formatCOP(cuantiaTotal)}
            </p>
          </div>
        </div>

        {/* KPI 4: Vencimientos Urgentes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CalendarClock size={64} className="text-orange-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-50 text-orange-500 p-2 rounded-lg">
                <CalendarClock size={20} />
              </div>
              <p className="text-sm text-slate-600 font-medium">Alertas Urgentes</p>
            </div>
            <p className="text-3xl font-black text-slate-900">
              <span className="text-red-600">{eventosVencidos}</span>
              <span className="text-slate-300 font-light mx-1">/</span>
              <span className="text-orange-500">{eventosProximos}</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Vencidos / Próximos 3d</p>
          </div>
        </div>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: ALERTAS URGENTES */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[550px]">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-lg">Alertas Tempranas</h3>
            </div>
            <Link href="/dashboard/agenda" className="text-sm font-semibold text-legal-blue hover:text-legal-navy transition-colors flex items-center gap-1 group">
              Agenda completa <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3">
            {(!eventosUrgentes || eventosUrgentes.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <CalendarClock size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">Todo al día. No hay vencimientos urgentes.</p>
              </div>
            ) : (
              eventosUrgentes.map((evento) => {
                const eventYMD = formatter.format(new Date(evento.fecha_inicio))
                const fechaStrBog = new Date(`${eventYMD}T00:00:00`)
                const diffDias = Math.round((fechaStrBog.getTime() - hoyStrBog.getTime()) / (1000 * 60 * 60 * 24))
                
                const isVencido = diffDias < 0
                const isHoy = diffDias === 0
                const evtDateObj = new Date(evento.fecha_inicio)
                
                return (
                  <div key={evento.id} className="group flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
                    <div className="flex flex-col items-center justify-center w-14 shrink-0 border-r border-slate-100 pr-4">
                      <span className="text-xs font-bold text-slate-400 uppercase">{evtDateObj.toLocaleDateString('es-CO', { timeZone: 'America/Bogota', month: 'short' })}</span>
                      <span className={`text-2xl font-black ${isVencido ? 'text-red-500' : isHoy ? 'text-orange-500' : 'text-slate-700'}`}>{evtDateObj.toLocaleDateString('es-CO', { timeZone: 'America/Bogota', day: 'numeric' })}</span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                          ${isVencido ? 'bg-red-50 text-red-600 border border-red-100' : 
                            isHoy ? 'bg-orange-50 text-orange-600 border border-orange-100' : 
                            'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                          {isVencido ? 'Vencido' : isHoy ? 'Vence Hoy' : `En ${diffDias} días`}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm truncate mb-0.5" title={evento.titulo}>{evento.titulo}</h4>
                      {evento.expediente_id ? (
                        <Link href={`/dashboard/expedientes/${evento.expediente_id}`} className="text-xs text-slate-500 hover:text-legal-blue transition-colors truncate">
                          {evento.expedientes?.nombre}
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-400">Evento independiente</span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* COLUMNA DERECHA: ÚLTIMAS ACTUACIONES */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[550px]">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-legal-blue rounded-full"></div>
              <h3 className="font-bold text-slate-800 text-lg">Actividad Reciente</h3>
            </div>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {(!ultimasActuaciones || ultimasActuaciones.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <TrendingUp size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">Aún no hay actuaciones registradas.</p>
              </div>
            ) : (
              <div className="relative border-l border-slate-200 ml-4 space-y-8 pb-4">
                {ultimasActuaciones.map((act: any) => (
                  <div key={act.id} className="relative pl-6 group">
                    <span className="absolute -left-1.5 top-1 w-3 h-3 bg-white border-2 border-legal-blue rounded-full group-hover:scale-125 transition-transform group-hover:border-legal-navy"></span>
                    
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-slate-800 text-sm group-hover:text-legal-blue transition-colors">{act.titulo}</h4>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap ml-3 font-medium flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(act.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-500 mb-2 truncate">
                      <span className="font-semibold text-slate-600">{act.expedientes?.radicado || 'Sin radicado'}</span>
                      <span className="mx-1.5 text-slate-300">•</span> 
                      {act.expedientes?.nombre}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded capitalize">
                        {act.tipo.replace('_', ' ')}
                      </span>
                      {act.responsable?.nombre_completo && (
                        <span className="text-[10px] text-slate-400">Por {act.responsable.nombre_completo.split(' ')[0]}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  )
}
