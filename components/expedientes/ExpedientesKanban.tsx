'use client'

import Link from 'next/link'

type Expediente = {
  id: string
  nombre: string
  radicado: string
  estado: string
  riesgo: string
  prioridad: string
  cliente: string
}

const COLUMNAS = [
  { id: 'activo', titulo: 'Activos', color: 'bg-blue-50 border-blue-200', text: 'text-blue-800' },
  { id: 'archivado', titulo: 'Archivados', color: 'bg-gray-50 border-gray-200', text: 'text-gray-800' },
  { id: 'cerrado', titulo: 'Cerrados', color: 'bg-green-50 border-green-200', text: 'text-green-800' },
]

export default function ExpedientesKanban({ expedientes }: { expedientes: Expediente[] }) {
  // En un Kanban real usaríamos drag and drop (dnd-kit), aquí hacemos un layout simple para el MVP
  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[500px] flex-1">
      {COLUMNAS.map(columna => {
        const expedientesColumna = expedientes.filter(e => e.estado === columna.id)
        
        return (
          <div key={columna.id} className={`flex-1 min-w-[320px] max-w-[400px] rounded-xl border ${columna.color} p-4 flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-bold capitalize ${columna.text}`}>{columna.titulo}</h3>
              <span className="bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-gray-700">
                {expedientesColumna.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
              {expedientesColumna.map(exp => (
                <Link href={`/dashboard/expedientes/${exp.id}`} key={exp.id} className="block bg-white p-4 rounded-lg shadow-sm border border-legal-line/30 hover:shadow-md transition-shadow group cursor-pointer relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-legal-navy bg-blue-50 px-2 py-1 rounded">
                      {exp.radicado || 'Sin radicado'}
                    </span>
                  </div>
                  <h4 className="font-bold text-legal-ink leading-tight mb-2 group-hover:text-legal-blue transition-colors">
                    {exp.nombre}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3 truncate" title={exp.contactos?.nombre || 'Sin cliente'}>
                    👤 {exp.contactos?.nombre || 'Sin cliente'}
                  </p>
                  <div className="flex justify-between items-center mt-2 border-t pt-2 border-gray-50">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      exp.riesgo === 'critico' ? 'bg-red-100 text-red-700' :
                      exp.riesgo === 'alto' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      Riesgo: {exp.riesgo}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      exp.prioridad === 'urgente' ? 'bg-red-100 text-red-700' :
                      exp.prioridad === 'alta' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {exp.prioridad}
                    </span>
                  </div>
                </Link>
              ))}
              
              {expedientesColumna.length === 0 && (
                <div className="text-center p-6 text-sm text-gray-400 border-2 border-dashed border-gray-200/60 rounded-lg mt-2 bg-white/50">
                  No hay expedientes en esta columna
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
