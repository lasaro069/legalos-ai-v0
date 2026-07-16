import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function ContactosPage({
  searchParams,
}: {
  searchParams?: { query?: string }
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: miembros } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user.id)

  const firmaIds = miembros?.map(m => m.firma_id) || []

  // Búsqueda
  const query = searchParams?.query || ''
  let dbQuery = supabase
    .from('contactos')
    .select('*')
    .in('firma_id', firmaIds)
    .order('nombre', { ascending: true })

  if (query) {
    dbQuery = dbQuery.or(`nombre.ilike.%${query}%,identificacion.ilike.%${query}%`)
  }

  const { data: contactos } = await dbQuery

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-legal-ink">Directorio de Contactos</h2>
          <p className="text-sm text-legal-navy/70 mt-1">Clientes, contrapartes y personas vinculadas</p>
        </div>
        <Link 
          href="/dashboard/contactos/nuevo" 
          className="bg-legal-gold hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
        >
          <span>+</span> Nuevo Contacto
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-panel border border-legal-line">
        {/* Buscador (básico, sin JS) */}
        <form className="mb-6 flex gap-2">
          <input 
            type="text" 
            name="query" 
            defaultValue={query}
            placeholder="Buscar por nombre o identificación..." 
            className="flex-1 border border-legal-line rounded-lg p-2 focus:outline-none focus:border-legal-gold"
          />
          <button type="submit" className="bg-legal-navy text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
            Buscar
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-legal-line/50 text-legal-navy">
                <th className="pb-3 font-semibold text-sm">Nombre / Razón Social</th>
                <th className="pb-3 font-semibold text-sm">Identificación</th>
                <th className="pb-3 font-semibold text-sm">Contacto</th>
                <th className="pb-3 font-semibold text-sm">Tipo</th>
                <th className="pb-3 font-semibold text-sm text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactos?.map((c) => (
                <tr key={c.id} className="border-b border-legal-line/30 hover:bg-gray-50 transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-legal-ink">{c.nombre}</div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    <span className="uppercase text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded mr-1">
                      {c.tipo_identificacion}
                    </span>
                    {c.identificacion || '-'}
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {c.correo && <div>📧 {c.correo}</div>}
                    {c.telefono && <div>📱 {c.telefono}</div>}
                  </td>
                  <td className="py-4">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      c.tipo_persona === 'juridica' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {c.tipo_persona}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link href={`/dashboard/contactos/${c.id}`} className="text-legal-blue hover:underline text-sm font-semibold">
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              ))}
              {(!contactos || contactos.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No se encontraron contactos en el directorio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
