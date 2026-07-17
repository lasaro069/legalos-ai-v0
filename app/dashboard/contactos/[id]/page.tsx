import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Building2, User, Phone, Mail, MapPin, Briefcase } from 'lucide-react'

export default async function DetalleContactoPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  // Obtener contacto
  const { data: contacto, error } = await supabase
    .from('contactos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !contacto) {
    notFound()
  }

  // Obtener expedientes asociados al contacto
  const { data: expedientes } = await supabase
    .from('expedientes')
    .select('id, nombre, radicado, estado, riesgo, cuantia, area_juridica')
    .eq('cliente_id', params.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/contactos" className="text-legal-navy hover:text-legal-gold">
          ← Volver al Directorio
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: PERFIL */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
              <div className={`p-4 rounded-2xl mb-4 ${contacto.tipo_persona === 'juridica' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-legal-blue'}`}>
                {contacto.tipo_persona === 'juridica' ? <Building2 size={48} /> : <User size={48} />}
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-1">{contacto.nombre}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                  {contacto.tipo_identificacion}
                </span>
                <span className="text-sm font-mono text-slate-500">{contacto.identificacion || 'Sin ID'}</span>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Teléfono</p>
                  <p className="text-sm text-slate-700 font-medium">{contacto.telefono || 'No registrado'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Correo Electrónico</p>
                  <p className="text-sm text-slate-700 font-medium">{contacto.correo || 'No registrado'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Dirección / Ciudad</p>
                  <p className="text-sm text-slate-700 font-medium">
                    {contacto.direccion ? `${contacto.direccion}, ` : ''}
                    {contacto.ciudad || 'Ubicación no registrada'}
                  </p>
                </div>
              </div>
            </div>
            
            {contacto.observaciones && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-bold uppercase mb-2">Observaciones</p>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {contacto.observaciones}
                </p>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
               <button className="text-legal-gold hover:underline text-sm font-medium">
                 Editar contacto (Próximamente)
               </button>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: EXPEDIENTES */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-legal-blue rounded-lg">
                  <Briefcase size={20} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Expedientes del Cliente</h3>
              </div>
              <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {expedientes?.length || 0}
              </span>
            </div>
            
            <div className="p-6 flex-1 bg-slate-50/30">
              {(!expedientes || expedientes.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                  <Briefcase size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium text-slate-500">Este contacto aún no tiene expedientes asociados.</p>
                  <Link 
                    href="/dashboard/expedientes/nuevo" 
                    className="mt-4 text-legal-blue hover:underline text-sm font-semibold"
                  >
                    Crear nuevo expediente
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expedientes.map(exp => (
                    <Link 
                      href={`/dashboard/expedientes/${exp.id}`} 
                      key={exp.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-legal-blue/50 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {exp.radicado || 'Sin radicado'}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border
                          ${exp.estado === 'activo' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            exp.estado === 'cerrado' ? 'bg-green-50 text-green-700 border-green-200' : 
                            'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {exp.estado}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-legal-blue transition-colors line-clamp-2">
                        {exp.nombre}
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                        {exp.area_juridica && (
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                            {exp.area_juridica}
                          </span>
                        )}
                        {exp.cuantia != null && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(exp.cuantia)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
