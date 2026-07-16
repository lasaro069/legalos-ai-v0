import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import ActuacionesTable from '@/components/actuaciones/ActuacionesTable'
import { notFound } from 'next/navigation'

export default async function DetalleExpedientePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  // Obtener expediente
  const { data: expediente, error } = await supabase
    .from('expedientes')
    .select('*, firmas(nombre), responsable_id, eventos_agenda(*), contactos(nombre)')
    .eq('id', params.id)
    .single()

  if (error || !expediente) {
    notFound()
  }

  // Obtener actuaciones
  const { data: actuaciones } = await supabase
    .from('actuaciones')
    .select('*, usuarios!actuaciones_creado_por_fkey(nombre_completo)')
    .eq('expediente_id', params.id)
    .order('fecha_juridica', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/expedientes" className="text-legal-navy hover:text-legal-gold">
          ← Volver
        </Link>
        <h2 className="text-2xl font-bold text-legal-ink">Detalle del Expediente</h2>
      </div>

      {/* Tarjeta de Resumen del Expediente */}
      <div className="bg-white p-6 rounded-xl shadow-panel border border-legal-line grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-2 py-1 rounded mb-2 border border-gray-200">
            Radicado: {expediente.radicado || 'N/A'}
          </div>
          <h3 className="text-xl font-bold text-legal-ink mb-1">{expediente.nombre}</h3>
          <p className="text-sm text-legal-navy/80 mb-4">{expediente.descripcion || 'Sin descripción'}</p>
          
          <div className="text-sm grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-bold mb-0.5">Cliente</span>
              <span className="font-semibold text-legal-ink">{expediente.contactos?.nombre || 'No asignado'}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-bold mb-0.5">Partes Procesales</span>
              <span className="text-legal-navy">{expediente.partes || 'No especificado'}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-bold mb-0.5">Área Jurídica</span>
              <span className="text-legal-navy">{expediente.area_juridica || 'No especificado'}</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-bold mb-0.5">Tipo de Proceso</span>
              <span className="text-legal-navy">{expediente.tipo_proceso || 'No especificado'}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-[10px] text-gray-500 uppercase font-bold mb-0.5">Autoridad / Juzgado</span>
              <span className="text-legal-navy">{expediente.autoridad || 'No especificado'}</span>
            </div>
            {expediente.cuantia != null && (
              <div className="col-span-2 bg-green-50 p-2 rounded border border-green-100">
                <span className="block text-[10px] text-green-700 uppercase font-bold mb-0.5">Cuantía (Valor)</span>
                <span className="font-bold text-green-800">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(expediente.cuantia)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:items-end md:text-right">
          <div className="flex gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase border border-blue-200 shadow-sm">
              {expediente.estado}
            </span>
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase border border-orange-200 shadow-sm">
              Riesgo: {expediente.riesgo}
            </span>
          </div>
          <div className="text-sm mt-auto">
            <button className="text-legal-gold hover:underline font-medium">
              Editar detalles (Próximamente)
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Términos/Agenda Pendientes */}
      {(() => {
        const terminosPendientes = expediente.eventos_agenda?.filter((t: any) => t.estado !== 'realizada' && t.estado !== 'cancelada') || []
        
        if (terminosPendientes.length > 0) {
          return (
            <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-6 mt-2 shadow-sm">
              <h3 className="text-lg font-bold text-legal-ink mb-4 flex items-center gap-2">
                <span className="text-orange-500">⚠️</span> Términos y Vencimientos Activos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {terminosPendientes.map((termino: any) => {
                  const fecha = new Date(termino.fecha_inicio)
                  const hoy = new Date()
                  fecha.setHours(0,0,0,0)
                  hoy.setHours(0,0,0,0)
                  const diffDias = Math.round((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <div key={termino.id} className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-orange-100 text-orange-800">
                          {termino.tipo.replace('_', ' ')}
                        </span>
                        <span className={`text-xs font-bold ${diffDias < 0 ? 'text-red-600' : diffDias <= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                          {diffDias === 0 ? "Vence hoy" : diffDias < 0 ? `Venció hace ${Math.abs(diffDias)} días` : `En ${diffDias} días`}
                        </span>
                      </div>
                      <h4 className="font-bold text-legal-ink text-sm leading-tight">{termino.titulo}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }
        return null
      })()}

      {/* Sección de Actuaciones */}
      <div className="flex justify-between items-end mt-4">
        <div>
          <h3 className="text-xl font-bold text-legal-ink">Línea de Vida (Actuaciones)</h3>
          <p className="text-sm text-legal-navy/70">Historial cronológico de eventos en el proceso</p>
        </div>
        <Link 
          href={`/dashboard/expedientes/${expediente.id}/actuaciones/nueva`} 
          className="bg-legal-gold hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
        >
          <span>+</span> Registrar Actuación
        </Link>
      </div>

      <ActuacionesTable actuaciones={actuaciones || []} />
    </div>
  )
}
