import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function EquipoPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Obtener firma_id y rol del usuario actual
  const { data: currentMember } = await supabase
    .from('miembros_firma')
    .select('firma_id, rol, firmas(nombre)')
    .eq('usuario_id', user.id)
    .single()

  if (!currentMember) {
    return <div>No se encontró tu membresía.</div>
  }

  // Obtener todos los miembros de la firma
  const { data: miembros } = await supabase
    .from('miembros_firma')
    .select('id, rol, estado, usuario_id, usuarios(nombre_completo, email, created_at)')
    .eq('firma_id', currentMember.firma_id)
    .order('created_at', { ascending: true })

  const esAdmin = currentMember.rol === 'propietario' || currentMember.rol === 'admin'

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-legal-ink">Equipo de Trabajo</h2>
          <p className="text-legal-navy/70 mt-1">
            Gestiona los miembros de <strong>{currentMember.firmas?.nombre}</strong>
          </p>
        </div>
        {esAdmin && (
          <Link 
            href="/dashboard/equipo/nuevo"
            className="bg-legal-gold hover:bg-yellow-600 text-white font-bold py-2.5 px-6 rounded-lg transition-transform hover:-translate-y-0.5 shadow-sm flex items-center gap-2"
          >
            <span>+</span> Añadir Miembro
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-panel border border-legal-line overflow-hidden mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-legal-line/50 text-xs uppercase text-gray-500 font-bold">
              <th className="p-4">Miembro</th>
              <th className="p-4">Rol</th>
              <th className="p-4 text-center">Estado</th>
              {esAdmin && <th className="p-4 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-legal-line/30">
            {miembros?.map((m: any) => (
              <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-legal-ink">{m.usuarios.nombre_completo || 'Sin nombre'}</div>
                  <div className="text-sm text-gray-500">{m.usuarios.email}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded capitalize border shadow-sm
                    ${m.rol === 'propietario' ? 'bg-legal-navy text-white border-legal-obsidian' :
                      m.rol === 'admin' ? 'bg-legal-blue text-white border-legal-blue' :
                      'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {m.rol}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold capitalize
                    ${m.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {m.estado}
                  </span>
                </td>
                {esAdmin && (
                  <td className="p-4 text-right">
                    {/* Botones de acción (ej. suspender, cambiar rol) irían aquí */}
                    <button className="text-legal-blue hover:text-legal-gold text-sm font-semibold opacity-50 cursor-not-allowed" title="Próximamente">
                      Editar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
