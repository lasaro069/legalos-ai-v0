import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Building2, User, Phone, Mail, ChevronRight, Plus } from 'lucide-react'

export default async function ContactosPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 1. Identificar la firma del usuario actual
  const { data: miembros } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user.id)

  const firmaIds = miembros?.map(m => m.firma_id) || []
  if (firmaIds.length === 0) return <div>No perteneces a ninguna firma.</div>

  // 2. Traer Contactos
  const { data: contactos, error } = await supabase
    .from('contactos')
    .select('*')
    .in('firma_id', firmaIds)
    .order('nombre', { ascending: true })

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Directorio</h2>
          <p className="text-sm text-slate-500 mt-1">Gestión de clientes y contactos de la firma.</p>
        </div>
        <Link 
          href="/dashboard/contactos/nuevo" 
          className="bg-legal-blue hover:bg-legal-navy text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
        >
          <Plus size={18} /> Nuevo Contacto
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
          <strong>Error cargando contactos:</strong> {error.message}
        </div>
      )}

      {(!contactos || contactos.length === 0) ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <User size={48} className="text-legal-blue opacity-50" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Tu directorio está vacío</h3>
          <p className="text-slate-500 max-w-md mb-6">Comienza a agregar los clientes y contrapartes de tu firma para poder asociarlos rápidamente a tus expedientes.</p>
          <Link 
            href="/dashboard/contactos/nuevo" 
            className="bg-white text-legal-blue border border-legal-blue hover:bg-blue-50 font-bold py-2 px-6 rounded-lg shadow-sm transition-colors"
          >
            Agregar mi primer contacto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {contactos.map((contacto) => (
            <Link 
              key={contacto.id} 
              href={`/dashboard/contactos/${contacto.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-legal-blue/50 transition-all group flex flex-col h-full"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl shrink-0 ${contacto.tipo_persona === 'juridica' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-legal-blue'}`}>
                  {contacto.tipo_persona === 'juridica' ? <Building2 size={24} /> : <User size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-slate-800 truncate group-hover:text-legal-blue transition-colors" title={contacto.nombre}>
                    {contacto.nombre}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                      {contacto.tipo_identificacion}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{contacto.identificacion || 'Sin ID'}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span className="truncate">{contacto.telefono || 'Sin teléfono'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="truncate">{contacto.correo || 'Sin correo'}</span>
                </div>
              </div>
              
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                <ChevronRight size={20} className="text-legal-blue" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
