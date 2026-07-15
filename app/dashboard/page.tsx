import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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

  // 2. Traer KPIs Básicos
  const { count: expedientesActivosCount } = await supabase
    .from('expedientes')
    .select('*', { count: 'exact', head: true })
    .in('firma_id', firmaIds)
    .eq('estado', 'activo')

  // 3. Traer Vencimientos (Alertas Urgentes)
  const hoyStr = new Date().toISOString()
  const { data: eventosUrgentes } = await supabase
    .from('eventos_agenda')
    .select('*, expedientes(nombre)')
    .in('firma_id', firmaIds)
    .neq('estado', 'realizada')
    .neq('estado', 'cancelada')
    .order('fecha_inicio', { ascending: true })
    .limit(6)

  // 4. Traer Últimas Actuaciones (Recientes)
  const { data: ultimasActuaciones } = await supabase
    .from('actuaciones')
    .select('*, expedientes!inner(firma_id, nombre, radicado), responsable:usuarios!actuaciones_creado_por_fkey(nombre_completo)')
    .in('expedientes.firma_id', firmaIds)
    .order('created_at', { ascending: false })
    .limit(8)

  // Cálculo de KPIs de eventos
  let eventosVencidos = 0
  let eventosProximos = 0
  const hoy = new Date()
  hoy.setHours(0,0,0,0)

  eventosUrgentes?.forEach(e => {
    const fecha = new Date(e.fecha_inicio)
    fecha.setHours(0,0,0,0)
    const diffDias = Math.round((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDias < 0) eventosVencidos++
    if (diffDias >= 0 && diffDias <= 3) eventosProximos++
  })

  return (
    <>
      <h2 className="text-2xl font-bold text-legal-ink mb-6">Bandeja del Día</h2>
      
      {/* TARJETAS KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-legal-line shadow-panel flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Expedientes Activos</p>
            <p className="text-3xl font-bold text-legal-navy">{expedientesActivosCount || 0}</p>
          </div>
          <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-xl">📂</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-panel flex items-center justify-between">
          <div>
            <p className="text-sm text-red-600 font-semibold mb-1">Términos Vencidos</p>
            <p className="text-3xl font-bold text-red-600">{eventosVencidos}</p>
          </div>
          <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center text-xl">⚠️</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-panel flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-600 font-semibold mb-1">Vencen Próximamente</p>
            <p className="text-3xl font-bold text-orange-600">{eventosProximos}</p>
          </div>
          <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center text-xl">⏳</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: ALERTAS URGENTES */}
        <section className="bg-white rounded-xl shadow-panel border border-legal-line overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-legal-line/50 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-legal-ink text-lg">Alertas Urgentes</h3>
            <Link href="/dashboard/agenda" className="text-sm text-legal-blue hover:underline">Ver agenda completa</Link>
          </div>
          <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-4">
            {(!eventosUrgentes || eventosUrgentes.length === 0) ? (
              <p className="text-gray-500 text-sm text-center mt-10">Todo al día. No hay vencimientos urgentes.</p>
            ) : (
              eventosUrgentes.map((evento) => {
                const fecha = new Date(evento.fecha_inicio)
                fecha.setHours(0,0,0,0)
                const diffDias = Math.round((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
                
                const isVencido = diffDias < 0
                
                return (
                  <div key={evento.id} className={`p-4 rounded-lg border flex flex-col gap-2 ${isVencido ? 'border-red-200 bg-red-50/30' : 'border-orange-200 bg-orange-50/30'}`}>
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isVencido ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                        {isVencido ? 'Vencido' : diffDias === 0 ? 'Vence hoy' : `En ${diffDias} días`}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">
                        {fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h4 className="font-bold text-legal-ink text-sm leading-tight">{evento.titulo}</h4>
                    {evento.expediente_id && (
                      <Link href={`/dashboard/expedientes/${evento.expediente_id}`} className="text-xs text-legal-blue hover:underline mt-1">
                        Expediente: {evento.expedientes?.nombre}
                      </Link>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* COLUMNA DERECHA: ÚLTIMAS ACTUACIONES */}
        <section className="bg-white rounded-xl shadow-panel border border-legal-line overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-legal-line/50 bg-gray-50">
            <h3 className="font-bold text-legal-ink text-lg">Últimas Actuaciones en la Firma</h3>
          </div>
          <div className="p-5 flex-1 overflow-y-auto">
            {(!ultimasActuaciones || ultimasActuaciones.length === 0) ? (
              <p className="text-gray-500 text-sm text-center mt-10">Aún no hay actuaciones registradas.</p>
            ) : (
              <div className="relative border-l-2 border-legal-line/50 ml-3 flex flex-col gap-6">
                {ultimasActuaciones.map((act: any) => (
                  <div key={act.id} className="relative pl-6">
                    <span className="absolute -left-2 top-1 bg-white border-2 border-legal-gold w-4 h-4 rounded-full"></span>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-legal-ink text-sm">{act.titulo}</h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {new Date(act.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-legal-navy/70 mb-2 font-mono">
                      Exp: {act.expedientes?.radicado || 'Sin radicado'} - {act.expedientes?.nombre}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded capitalize">
                        {act.tipo.replace('_', ' ')}
                      </span>
                      <Link href={`/dashboard/expedientes/${act.expediente_id}`} className="text-xs text-legal-gold hover:underline font-semibold">
                        Ver actuación →
                      </Link>
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
