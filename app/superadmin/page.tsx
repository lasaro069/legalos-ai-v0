import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { crearFirmaYAdmin } from './actions'
import { logout } from '../(auth)/actions'
import { CreateFirmaForm } from '@/components/CreateFirmaForm'

export default async function SuperadminDashboard() {
  const supabase = createClient()

  // Validate superadmin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: usuarioData } = await supabase
    .from('usuarios')
    .select('es_superadmin')
    .eq('id', user.id)
    .single()

  if (!usuarioData?.es_superadmin) {
    return redirect('/dashboard')
  }

  // Fetch all firmas
  const { data: firmas } = await supabase
    .from('firmas')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded shadow">
          <div>
            <h1 className="text-2xl font-bold">Panel de Superadministrador</h1>
            <p className="text-gray-600">Gestión global de firmas del sistema LegalOS AI</p>
          </div>
          <form action={logout}>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors">
              Cerrar Sesión
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Formulario Crear Firma */}
          <div className="col-span-1 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Crear Nueva Firma</h2>
            <CreateFirmaForm />
          </div>

          {/* Lista de Firmas */}
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Firmas Registradas ({firmas?.length || 0})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad/País</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {firmas?.map((firma) => (
                    <tr key={firma.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{firma.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {firma.ciudad ? `${firma.ciudad}, ${firma.pais}` : 'Pendiente Onboarding'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(firma.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {(!firmas || firmas.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No hay firmas registradas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
