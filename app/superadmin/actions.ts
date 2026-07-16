'use server'

import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from '@/utils/supabase/server'

// Usamos el rol de servicio para crear usuarios evitando las restricciones
function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function crearFirmaYAdmin(formData: FormData) {
  const supabaseServer = createServerClient()
  
  // Validar si el usuario actual es superadmin
  const { data: { user } } = await supabaseServer.auth.getUser()
  if (!user) {
    throw new Error('No autorizado')
  }

  const { data: usuarioData } = await supabaseServer
    .from('usuarios')
    .select('es_superadmin')
    .eq('id', user.id)
    .single()

  if (!usuarioData?.es_superadmin) {
    throw new Error('No autorizado. Solo superadmins pueden crear firmas.')
  }

  const emailAdmin = formData.get('email') as string
  const passwordTemporal = formData.get('password') as string
  const nombreFirma = formData.get('nombre_firma') as string

  const supabaseAdmin = getAdminSupabase()

  // 1. Crear usuario en Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: emailAdmin,
    password: passwordTemporal,
    email_confirm: true,
  })

  if (authError) {
    throw new Error('Error al crear usuario: ' + authError.message)
  }

  const newUserId = authData.user.id

  // 2. Esperar a que el trigger handle_new_user termine de crear el perfil en public.usuarios
  // En Supabase el trigger corre síncronamente, por lo que el registro ya debería existir.
  
  // 3. Marcar al nuevo usuario que requiere cambio de contraseña
  await supabaseAdmin
    .from('usuarios')
    .update({ requiere_cambio_password: true })
    .eq('id', newUserId)

  // 4. Crear la firma con un nombre inicial
  const { data: firmaData, error: firmaError } = await supabaseAdmin
    .from('firmas')
    .insert([{ nombre: nombreFirma }])
    .select()
    .single()

  if (firmaError) {
    throw new Error('Error al crear firma: ' + firmaError.message)
  }

  // 5. Asignar el nuevo usuario como propietario de la nueva firma
  const { error: miembroError } = await supabaseAdmin
    .from('miembros_firma')
    .insert([{ 
      firma_id: firmaData.id, 
      usuario_id: newUserId, 
      rol: 'propietario', 
      estado: 'activo' 
    }])

  if (miembroError) {
    throw new Error('Error al asignar usuario a firma: ' + miembroError.message)
  }

  revalidatePath('/superadmin')
  return { success: true }
}
