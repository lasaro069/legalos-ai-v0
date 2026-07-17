'use client'

import { FileText, Paperclip, User, Calendar } from 'lucide-react'

export default function ActuacionesTable({ actuaciones }: { actuaciones: any[] }) {
  if (!actuaciones || actuaciones.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500 shadow-sm mt-4">
        <FileText size={48} className="mx-auto mb-4 opacity-20 text-legal-blue" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">Aún no hay actuaciones</h3>
        <p className="text-sm">Registra la primera actuación para comenzar la línea de vida de este expediente.</p>
      </div>
    )
  }

  return (
    <div className="relative mt-8 mb-12 ml-4 md:ml-8">
      {/* Línea vertical principal */}
      <div className="absolute top-0 bottom-0 left-[19px] md:left-[23px] w-0.5 bg-slate-200"></div>
      
      <div className="flex flex-col gap-8">
        {actuaciones.map((act, index) => {
          const isLatest = index === 0;
          const fecha = new Date(act.fecha_juridica);
          // Set to Bogota timezone for accurate date reading
          fecha.setHours(fecha.getHours() + 5); 

          return (
            <div key={act.id} className="relative pl-16 md:pl-20 group">
              
              {/* Círculo del Timeline */}
              <div className={`absolute left-0 top-1 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-110
                ${isLatest ? 'bg-legal-gold text-white' : 'bg-legal-blue text-white'}`}>
                <FileText size={isLatest ? 20 : 18} />
              </div>

              {/* Contenido de la Actuación */}
              <div className={`bg-white p-5 md:p-6 rounded-2xl border shadow-sm transition-all
                ${isLatest ? 'border-legal-gold/40 shadow-md ring-1 ring-legal-gold/20' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}>
                
                {/* Cabecera */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider
                      ${isLatest ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                      {act.tipo.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                      <Calendar size={14} />
                      {fecha.toLocaleDateString('es-CO', { timeZone: 'America/Bogota', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {act.documento_url && (
                      <a 
                        href={act.documento_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-legal-blue/5 hover:bg-legal-blue/10 text-legal-blue px-3 py-1.5 rounded-lg transition-colors"
                        title="Ver documento adjunto"
                      >
                        <Paperclip size={14} />
                        Ver Documento
                      </a>
                    )}
                    
                    <a href={`/dashboard/expedientes/${act.expediente_id}/actuaciones/${act.id}/editar`}
                       className="p-1.5 text-slate-400 hover:text-legal-gold hover:bg-yellow-50 rounded-lg transition-colors"
                       title="Editar actuación">
                      ✏️
                    </a>
                  </div>
                </div>
                
                {/* Cuerpo */}
                <h4 className="text-lg font-black text-slate-900 mb-2">{act.titulo}</h4>
                
                {act.descripcion ? (
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    {act.descripcion}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 italic">No hay notas adicionales para esta actuación.</p>
                )}
                
                {/* Pie */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  <User size={14} />
                  Registrado por: <span className="text-slate-700">{act.usuarios?.nombre_completo || 'Usuario'}</span>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}
