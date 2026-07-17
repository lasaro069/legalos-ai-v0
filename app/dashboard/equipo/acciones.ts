'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function agregarMiembroDirecto(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  // Check admin rights
  const { data: currentMember } = await supabase
    .from('miembros_firma')
    .select('firma_id, rol')
    .eq('usuario_id', user.id)
    .single()

  if (!currentMember || (currentMember.rol !== 'propietario' && currentMember.rol !== 'admin')) {
    redirect('/dashboard/equipo?error=No tienes permisos para añadir miembros')
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nombre_completo = formData.get('nombre_completo') as string
  const rol = formData.get('rol') as string

  // Use Service Role to bypass email confirmation and create user directly
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      nombre_completo,
      is_invite: 'true' // Flag to prevent the trigger from creating a default firm
    }
  })

  if (createError || !newUserData.user) {
    console.error('Error creando usuario:', createError)
    redirect(`/dashboard/equipo/nuevo?error=${encodeURIComponent(createError?.message || 'Error desconocido')}`)
  }

  const newUserId = newUserData.user.id

  // Associate the new user with the current admin's firm
  // We use supabaseAdmin to bypass RLS since the current user might not have insert privileges via RLS
  const { error: insertError } = await supabaseAdmin
    .from('miembros_firma')
    .insert([
      {
        firma_id: currentMember.firma_id,
        usuario_id: newUserId,
        rol: rol,
        estado: 'activo'
      }
    ])

  if (insertError) {
    console.error('Error insertando miembro:', insertError)
    // If it fails, the user is created in Auth but not in the firm.
    // An edge case, but we log and inform.
    redirect(`/dashboard/equipo/nuevo?error=${encodeURIComponent('Usuario creado pero no asignado: ' + insertError.message)}`)
  }

  // Marcar que el usuario debe cambiar su contraseña
  await supabaseAdmin
    .from('usuarios')
    .update({ requiere_cambio_password: true })
    .eq('id', newUserId)

  revalidatePath('/dashboard/equipo')
  redirect('/dashboard/equipo')
}
