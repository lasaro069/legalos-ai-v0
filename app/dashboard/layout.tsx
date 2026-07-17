import { createClient } from '@/utils/supabase/server'
import { logout } from '../(auth)/actions'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'

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
    .select('requiere_cambio_password, es_superadmin, nombre_completo')
    .eq('id', user?.id)
    .single()

  if (usuarioData?.requiere_cambio_password) {
    redirect('/update-password')
  }

  // Fetch firma details for the user
  const { data: firmaData } = await supabase
    .from('miembros_firma')
    .select('rol, firmas(nombre, id, ciudad, logo_url, eslogan)')
    .eq('usuario_id', user?.id)
    .single()

  if (!usuarioData?.es_superadmin && firmaData?.firmas && firmaData.firmas.ciudad === null) {
    redirect('/onboarding')
  }

  const firmaNombre = firmaData?.firmas?.nombre || 'Firma no encontrada'
  const firmaSlogan = firmaData?.firmas?.eslogan || 'Sistema operativo jurídico'
  const firmaLogoUrl = firmaData?.firmas?.logo_url
  const rol = firmaData?.rol || 'Miembro'
  
  const nombreCompleto = usuarioData?.nombre_completo || user?.email || 'Usuario'
  const usuarioIniciales = nombreCompleto
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  // Calculate alerts (Vencimientos Urgentes)
  const firmaId = firmaData?.firmas?.id
  let alertasCount = 0
  
  if (firmaId) {
    const isPrivileged = rol === 'propietario' || rol === 'admin'
    
    // Si no es admin, filtramos por sus expedientes
    let query = supabase
      .from('eventos_agenda')
      .select('fecha_inicio', { count: 'exact' })
      .eq('firma_id', firmaId)
      .neq('estado', 'realizada')
      .neq('estado', 'cancelada')
      
    if (!isPrivileged) {
      // get expedientes of this user
      const { data: userExpedientes } = await supabase
        .from('expedientes')
        .select('id')
        .eq('firma_id', firmaId)
        .eq('estado', 'activo')
        .or(`responsable_id.eq.${user?.id},auxiliar_id.eq.${user?.id}`)
        
      const expIds = userExpedientes?.map(e => e.id) || []
      if (expIds.length > 0) {
        query = query.or(`expediente_id.in.(${expIds.join(',')}),responsable_id.eq.${user?.id}`)
      } else {
        query = query.eq('responsable_id', user?.id)
      }
    }
    
    const { data: eventos, count } = await query
    
    if (eventos) {
      const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' })
      const hoyYMD = formatter.format(new Date())
      const hoyStrBog = new Date(`${hoyYMD}T00:00:00`)
      
      eventos.forEach(e => {
        const eventYMD = formatter.format(new Date(e.fecha_inicio))
        const fechaStrBog = new Date(`${eventYMD}T00:00:00`)
        const diffDias = Math.round((fechaStrBog.getTime() - hoyStrBog.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDias <= 3) {
          alertasCount++
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-legal-surface flex">
      <Sidebar 
        firmaNombre={firmaNombre}
        firmaSlogan={firmaSlogan}
        firmaLogoUrl={firmaLogoUrl}
        usuarioNombre={nombreCompleto}
        usuarioRol={rol}
        usuarioIniciales={usuarioIniciales}
        alertasCount={alertasCount}
        onLogout={logout}
      />
      <main className="flex-1 lg:pl-72 w-full transition-all">
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
