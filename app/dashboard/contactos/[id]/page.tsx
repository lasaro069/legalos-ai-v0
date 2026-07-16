import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ContactoDetallePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  // Obtener Contacto
  const { data: contacto } = await supabase
    .from('contactos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!contacto) return notFound()

  // Obtener Expedientes donde es Cliente
  const { data: expedientes } = await supabase
    .from('expedientes')
    .select('id, nombre, radicado, estado, riesgo')
    .eq('cliente_id', contacto.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/contactos" className="text-legal-navy hover:text-legal-gold">
          ← Volver
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: PERFIL */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-panel border border-legal-line p-6 flex flex-col gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-legal-navy text-white rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
                {contacto.nombre.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-legal-ink">{contacto.nombre}</h2>
              <p className="text-sm text-gray-500 uppercase mt-1 tracking-wider">
                {contacto.tipo_identificacion}: {contacto.identificacion || 'Sin ID'}
              </p>
              <div className="mt-2 flex justify-center">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  contacto.tipo_persona === 'juridica' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {contacto.tipo_persona}
                </span>
              </div>
            </div>

            <hr className="border-legal-line/50" />

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-semibold mb-1">Correo Electrónico</p>
                <p className="font-medium text-legal-ink">{contacto.correo || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold mb-1">Teléfono</p>
                <p className="font-medium text-legal-ink">{contacto.telefono || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold mb-1">Ubicación</p>
                <p className="font-medium text-legal-ink">
                  {contacto.direccion ? `${contacto.direccion}, ` : ''}{contacto.ciudad || '-'}
                </p>
              </div>
              {contacto.observaciones && (
                <div>
                  <p className="text-gray-500 font-semibold mb-1">Observaciones</p>
                  <p className="font-medium text-legal-ink p-3 bg-gray-50 rounded italic">
                    {contacto.observaciones}
                  </p>
                </div>
              )}
            </div>

            <button className="mt-4 w-full border-2 border-legal-gold text-legal-gold hover:bg-legal-gold hover:text-white transition-colors py-2 rounded-lg font-bold">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: EXPEDIENTES ASOCIADOS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-panel border border-legal-line flex flex-col h-full">
            <div className="p-6 border-b border-legal-line/50 bg-gray-50">
              <h3 className="text-lg font-bold text-legal-ink">Expedientes Asociados (Cliente principal)</h3>
              <p className="text-sm text-gray-500">Casos donde este contacto figura como el cliente representativo.</p>
            </div>
            
            <div className="p-6 flex-1">
              {(!expedientes || expedientes.length === 0) ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-4">📂</div>
                  <p className="text-gray-500 font-medium">Este contacto no tiene expedientes vinculados.</p>
                  <Link href="/dashboard/expedientes/nuevo" className="text-legal-blue hover:underline text-sm mt-2 inline-block">
                    Crear un expediente para {contacto.nombre}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {expedientes.map(exp => (
                    <Link key={exp.id} href={`/dashboard/expedientes/${exp.id}`} className="block border border-legal-line rounded-lg p-4 hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-mono text-legal-navy bg-blue-50 inline-block px-1.5 rounded mb-1">
                            {exp.radicado || 'Sin radicado'}
                          </p>
                          <h4 className="font-bold text-legal-ink group-hover:text-legal-blue transition-colors">
                            {exp.nombre}
                          </h4>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 uppercase rounded">
                            {exp.estado}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 uppercase rounded ${exp.riesgo === 'alto' ? 'bg-red-100 text-red-800' : exp.riesgo === 'medio' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                            {exp.riesgo}
                          </span>
                        </div>
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
