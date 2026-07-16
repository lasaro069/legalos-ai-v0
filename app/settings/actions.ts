'use server'

import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function updateProfileAction(data: {
  nombre_completo: string,
  celular: string,
  telefono_fijo: string,
  correo_alterno: string,
  direccion: string,
  ciudad: string,
  departamento: string,
  pais: string
}) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('usuarios')
    .update(data)
    .eq('id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/settings')
  return { success: true }
}

export async function updateFirmAction(firmaId: string, data: {
  nombre: string,
  eslogan: string,
  email: string,
  telefono: string,
  celular: string,
  direccion: string,
  ciudad: string,
  departamento: string,
  pais: string,
  zona_horaria: string,
  logo_url?: string
}) {
  const supabase = createServerClient()
  
  // Validate ownership
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: membership } = await supabase
    .from('miembros_firma')
    .select('rol')
    .eq('firma_id', firmaId)
    .eq('usuario_id', user.id)
    .single()

  if (!membership || membership.rol !== 'propietario') {
    return { error: 'No tienes permisos para editar la firma' }
  }

  const supabaseAdmin = getAdminSupabase()
  const { error } = await supabaseAdmin
    .from('firmas')
    .update(data)
    .eq('id', firmaId)

  if (error) return { error: error.message }
  
  revalidatePath('/settings')
  return { success: true }
}

export async function inviteTeamMemberAction(firmaId: string, email: string, rol: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: membership } = await supabase
    .from('miembros_firma')
    .select('rol')
    .eq('firma_id', firmaId)
    .eq('usuario_id', user.id)
    .single()

  if (!membership || membership.rol !== 'propietario') {
    return { error: 'Solo el propietario puede invitar miembros' }
  }

  const supabaseAdmin = getAdminSupabase()
  
  // Check if user already exists
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
  let invitedUserId = existingUsers.users.find(u => u.email === email)?.id

  if (!invitedUserId) {
    // Invite new user
    const { data: authData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { is_invite: true }
    })
    if (inviteError) return { error: 'Error al enviar invitación: ' + inviteError.message }
    invitedUserId = authData.user.id
  }

  // Insert or update in miembros_firma
  const { error: memberError } = await supabaseAdmin
    .from('miembros_firma')
    .upsert({
      firma_id: firmaId,
      usuario_id: invitedUserId,
      rol,
      estado: 'invitado'
    }, { onConflict: 'firma_id, usuario_id' })

  if (memberError) return { error: 'Error al vincular a la firma: ' + memberError.message }

  revalidatePath('/settings')
  return { success: true }
}

export async function deactivateMemberAction(firmaId: string, memberUserId: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: membership } = await supabase
    .from('miembros_firma')
    .select('rol')
    .eq('firma_id', firmaId)
    .eq('usuario_id', user.id)
    .single()

  if (!membership || membership.rol !== 'propietario') {
    return { error: 'Solo el propietario puede desactivar miembros' }
  }

  const supabaseAdmin = getAdminSupabase()
  const { error } = await supabaseAdmin
    .from('miembros_firma')
    .update({ estado: 'inactivo' })
    .eq('firma_id', firmaId)
    .eq('usuario_id', memberUserId)

  if (error) return { error: error.message }
  
  revalidatePath('/settings')
  return { success: true }
}
