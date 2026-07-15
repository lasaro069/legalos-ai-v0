'use client'

import Link from 'next/link'

export default function ListaVencimientos({ eventos }: { eventos: any[] }) {
  if (!eventos || eventos.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl border border-legal-line text-center text-gray-500 shadow-panel">
        <div className="text-4xl mb-4 opacity-50">📅</div>
        <h3 className="text-lg font-semibold text-legal-ink mb-1">Tu agenda está libre</h3>
        <p className="text-sm">No tienes vencimientos ni audiencias próximas.</p>
      </div>
    )
  }

  // Ordenar eventos por fecha de inicio
  const eventosOrdenados = [...eventos].sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime())

  return (
    <div className="flex flex-col gap-4">
      {eventosOrdenados.map((evento) => {
        const fecha = new Date(evento.fecha_inicio)
        const hoy = new Date()
        
        // Normalizar a medianoche para cálculo de días justos
        fecha.setHours(0,0,0,0)
        hoy.setHours(0,0,0,0)
        
        const msPerDay = 1000 * 60 * 60 * 24
        const diffDias = Math.round((fecha.getTime() - hoy.getTime()) / msPerDay)
        
        // Lógica de color
        let colorBorde = "border-gray-200"
        let colorFondo = "bg-white"
        let badgeColor = "bg-gray-100 text-gray-800"

        if (evento.estado === 'realizada') {
          colorBorde = "border-green-200"
          colorFondo = "bg-green-50/30"
          badgeColor = "bg-green-100 text-green-800"
        } else if (diffDias < 0) {
          colorBorde = "border-red-300"
          colorFondo = "bg-red-50/50"
          badgeColor = "bg-red-100 text-red-800"
        } else if (diffDias <= 3) {
          colorBorde = "border-orange-300"
          colorFondo = "bg-orange-50/50"
          badgeColor = "bg-orange-100 text-orange-800"
        } else {
          colorBorde = "border-blue-200"
          badgeColor = "bg-blue-100 text-blue-800"
        }

        let diffTexto = diffDias === 0 ? "Vence hoy" : diffDias === 1 ? "Mañana" : diffDias === -1 ? "Venció ayer" : diffDias < 0 ? `Hace ${Math.abs(diffDias)} días` : `En ${diffDias} días`
        
        if (evento.estado === 'realizada') {
          diffTexto = "Completado"
        }

        const formatoFecha = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
        const formatoCapitalizado = formatoFecha.charAt(0).toUpperCase() + formatoFecha.slice(1)

        return (
          <div key={evento.id} className={`p-5 rounded-xl border ${colorBorde} ${colorFondo} shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row gap-4 justify-between items-start md:items-center`}>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeColor}`}>
                  {evento.tipo.replace('_', ' ')}
                </span>
                <span className={`text-xs font-semibold ${diffDias < 0 && evento.estado !== 'realizada' ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatoCapitalizado}
                </span>
              </div>
              <h3 className="text-lg font-bold text-legal-ink leading-tight">{evento.titulo}</h3>
              {evento.expedientes && (
                <Link href={`/dashboard/expedientes/${evento.expediente_id}`} className="text-sm text-legal-blue hover:underline mt-1">
                  Exp: {evento.expedientes.nombre}
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <div className={`text-sm font-bold ${evento.estado === 'realizada' ? 'text-green-600' : diffDias < 0 ? 'text-red-600' : diffDias <= 3 ? 'text-orange-600' : 'text-legal-navy'}`}>
                  {diffTexto}
                </div>
                <div className="text-xs text-gray-500">
                  Responsable: {evento.responsable?.nombre_completo || 'Sin asignar'}
                </div>
              </div>
              
              <button 
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${evento.estado === 'realizada' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white hover:border-legal-gold'}`}
                title={evento.estado === 'realizada' ? 'Completado' : 'Marcar como realizado'}
              >
                {evento.estado === 'realizada' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                )}
              </button>
            </div>
            
          </div>
        )
      })}
    </div>
  )
}
