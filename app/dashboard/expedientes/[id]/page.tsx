import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import ActuacionesTable from '@/components/actuaciones/ActuacionesTable'
import { notFound } from 'next/navigation'

export default async function DetalleExpedientePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  // Obtener expediente
  const { data: expediente, error } = await supabase
    .from('expedientes')
    .select('*, firmas(nombre), responsable_id')
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
          
          <div className="text-sm grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div>
              <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Cliente</span>
              {expediente.cliente || 'No asignado'}
            </div>
            <div>
              <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Partes</span>
              {expediente.partes || 'No asignado'}
            </div>
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
