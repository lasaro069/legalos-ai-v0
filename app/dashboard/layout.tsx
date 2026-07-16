import { createClient } from '@/utils/supabase/server'
import { logout } from '../(auth)/actions'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch firma details for the user
  const { data: firmaData } = await supabase
    .from('miembros_firma')
    .select('rol, firmas(nombre, id)')
    .eq('usuario_id', user?.id)
    .single()

  const firmaNombre = firmaData?.firmas?.nombre || 'Firma no encontrada'
  const rol = firmaData?.rol || 'Miembro'

  return (
    <div className="min-h-screen bg-legal-surface flex flex-col">
      <header className="bg-legal-ink text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-xl font-bold">LegalOS</h1>
            <p className="text-xs text-legal-line opacity-80">{firmaNombre} ({rol})</p>
          </div>
          <nav className="hidden md:flex gap-6 border-l border-legal-navy pl-6 ml-2">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Inicio</Link>
            <Link href="/dashboard/expedientes" className="text-gray-300 hover:text-white transition-colors">Expedientes</Link>
            <Link href="/dashboard/agenda" className="text-gray-300 hover:text-white transition-colors">Agenda</Link>
            <Link href="/dashboard/contactos" className="text-gray-300 hover:text-white transition-colors">Directorio</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden md:inline">{user?.email}</span>
          <form action={logout}>
            <button className="px-3 py-1.5 bg-legal-navy hover:bg-legal-obsidian rounded text-sm transition-colors border border-legal-line/20">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
