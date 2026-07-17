import { createClient } from '@/utils/supabase/server'
import { logout } from '../(auth)/actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: usuarioData } = await supabase
    .from('usuarios')
    .select('requiere_cambio_password, es_superadmin')
    .eq('id', user?.id)
    .single()

  if (usuarioData?.requiere_cambio_password) {
    redirect('/update-password')
  }

  // Fetch firma details for the user
  const { data: firmaData } = await supabase
    .from('miembros_firma')
    .select('rol, firmas(nombre, id, ciudad)')
    .eq('usuario_id', user?.id)
    .single()

  if (!usuarioData?.es_superadmin && firmaData?.firmas && firmaData.firmas.ciudad === null) {
    redirect('/onboarding')
  }

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
            <Link href="/dashboard/equipo" className="text-gray-300 hover:text-white transition-colors">Equipo</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/settings" className="p-2 text-gray-300 hover:text-white hover:bg-legal-navy rounded-full transition-colors" title="Ajustes de la firma">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </Link>
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
