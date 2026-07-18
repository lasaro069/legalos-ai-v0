import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../(auth)/actions'
import { CreateFirmaForm } from '@/components/CreateFirmaForm'
import { Building2, Users, Briefcase, FileText, Bot, Phone } from 'lucide-react'

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

  // Fetch all firmas metrics from RPC
  const { data: firmasMetrics, error } = await supabase.rpc('get_firmas_metrics')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded shadow">
          <div>
            <h1 className="text-2xl font-bold">Panel de Superadministrador</h1>
            <p className="text-gray-600">Métricas y gestión global del sistema LegalOS AI</p>
          </div>
          <form action={logout}>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors">
              Cerrar Sesión
            </button>
          </form>
        </header>

        <div className="flex justify-end">
          <details className="group relative">
            <summary className="list-none cursor-pointer px-4 py-2 bg-legal-blue text-white hover:bg-blue-700 rounded text-sm font-semibold transition-colors shadow-sm inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Crear Nueva Firma
            </summary>
            <div className="absolute right-0 top-full mt-2 w-96 bg-white p-6 rounded shadow-xl border border-gray-100 z-50">
              <h2 className="text-xl font-semibold mb-4">Nueva Firma</h2>
              <CreateFirmaForm />
            </div>
          </details>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold">Desempeño de Firmas Registradas ({firmasMetrics?.length || 0})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Firma</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"><div className="flex items-center justify-center gap-2"><Users className="h-4 w-4"/> Usuarios</div></th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"><div className="flex items-center justify-center gap-2"><Phone className="h-4 w-4"/> Contactos</div></th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"><div className="flex items-center justify-center gap-2"><Briefcase className="h-4 w-4"/> Casos</div></th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"><div className="flex items-center justify-center gap-2"><FileText className="h-4 w-4"/> Docs / Caso</div></th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"><div className="flex items-center justify-center gap-2"><Bot className="h-4 w-4"/> Tokens IA</div></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {firmasMetrics?.map((firma: any) => (
                  <tr key={firma.firma_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-legal-navy">{firma.nombre_firma}</p>
                      <p className="text-xs text-gray-500 mt-1">{firma.ciudad || 'Pendiente Onboarding'} • Ingresó: {new Date(firma.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                        {firma.usuarios_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm">
                        {firma.clientes_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold text-sm">
                        {firma.expedientes_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-sm font-bold text-gray-700">{firma.documentos_count} <span className="text-xs font-normal text-gray-500">total</span></p>
                      <p className="text-xs text-gray-500 mt-1">{firma.promedio_documentos_por_caso} prom.</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-medium text-gray-400 border border-gray-200 rounded px-2 py-1 bg-gray-50">
                        Próximamente
                      </span>
                    </td>
                  </tr>
                ))}
                {(!firmasMetrics || firmasMetrics.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No hay datos de firmas registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
