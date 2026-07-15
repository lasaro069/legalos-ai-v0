import { createClient } from '@/utils/supabase/server'
import { logout } from '../(auth)/actions'

export default async function DashboardPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch firma details for the user
  const { data: firmaData, error } = await supabase
    .from('miembros_firma')
    .select('rol, firmas(nombre, id)')
    .eq('usuario_id', user?.id)
    .single()

  if (error) {
    console.error('Error fetching firma:', error)
  }

  const firmaNombre = firmaData?.firmas?.nombre || 'Firma no encontrada'
  const rol = firmaData?.rol || 'Miembro'

  return (
    <div className="min-h-screen bg-legal-surface flex flex-col">
      <header className="bg-legal-ink text-white p-4 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">LegalOS</h1>
          <p className="text-xs text-legal-line opacity-80">{firmaNombre} ({rol})</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">{user?.email}</span>
          <form action={logout}>
            <button className="px-3 py-1.5 bg-legal-navy hover:bg-legal-obsidian rounded text-sm transition-colors border border-legal-line/20">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-legal-ink mb-6">Bandeja del Día</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta de Resumen */}
          <div className="bg-white p-6 rounded-xl shadow-panel border border-legal-line">
            <h3 className="font-semibold text-legal-navy mb-2">Expedientes Activos</h3>
            <p className="text-4xl font-bold text-legal-blue">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-panel border border-legal-line">
            <h3 className="font-semibold text-legal-navy mb-2">Términos Próximos</h3>
            <p className="text-4xl font-bold text-legal-gold">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-panel border border-legal-line">
            <h3 className="font-semibold text-legal-navy mb-2">Audiencias Pendientes</h3>
            <p className="text-4xl font-bold text-legal-cyan">0</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-panel border border-legal-line p-8 text-center text-legal-navy/60">
          <p>Tu entorno multi-tenant está funcionando correctamente.</p>
          <p className="text-sm mt-2">Próximo paso: Módulo de Expedientes.</p>
        </div>
      </main>
    </div>
  )
}
