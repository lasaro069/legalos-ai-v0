import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { agregarMiembroDirecto } from '../acciones'

export default async function NuevoMiembroPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentMember } = await supabase
    .from('miembros_firma')
    .select('firma_id, rol')
    .eq('usuario_id', user.id)
    .single()

  if (!currentMember || (currentMember.rol !== 'propietario' && currentMember.rol !== 'admin')) {
    redirect('/dashboard/equipo')
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {searchParams?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{searchParams.error}</span>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-legal-ink">Añadir Miembro al Equipo</h2>
          <p className="text-sm text-legal-navy/80">Crea una cuenta directamente para un nuevo integrante.</p>
        </div>
        <Link href="/dashboard/equipo" className="text-legal-blue hover:underline text-sm font-semibold">
          Cancelar y volver
        </Link>
      </div>

      <form action={agregarMiembroDirecto} className="bg-white p-8 rounded-xl shadow-panel border border-legal-line flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label htmlFor="nombre_completo" className="font-semibold text-sm text-legal-navy">Nombre Completo *</label>
          <input type="text" id="nombre_completo" name="nombre_completo" required className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="Ej. Carlos Mendoza" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold text-sm text-legal-navy">Correo Electrónico *</label>
          <input type="email" id="email" name="email" required className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="carlos@firma.com" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold text-sm text-legal-navy">Asignar Contraseña Temporal *</label>
          <input type="text" id="password" name="password" required minLength={6} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="Min. 6 caracteres" />
          <p className="text-xs text-gray-500 mt-1">El usuario podrá iniciar sesión inmediatamente con esta clave.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="rol" className="font-semibold text-sm text-legal-navy">Rol en la Firma *</label>
          <select id="rol" name="rol" required className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white">
            <option value="abogado">Abogado (Puede crear/editar expedientes)</option>
            <option value="auxiliar">Auxiliar (Lectura/edición básica)</option>
            {currentMember.rol === 'propietario' && <option value="propietario">Propietario (Administrador total)</option>}
          </select>
        </div>

        <div className="flex justify-end pt-4 mt-2 border-t border-legal-line/50">
          <button type="submit" className="bg-legal-gold hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-transform hover:-translate-y-0.5">
            Registrar Miembro
          </button>
        </div>
      </form>
    </div>
  )
}
