'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createClient()

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=' + encodeURIComponent(error.message))
  }

  const { data: usuarioData } = await supabase
    .from('usuarios')
    .select('es_superadmin')
    .eq('id', data.user.id)
    .single()

  if (usuarioData?.es_superadmin) {
    return redirect('/superadmin')
  }

  return redirect('/dashboard')
}



export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}

export async function updatePasswordAction(password: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuario no autenticado' }

  const { error: updateError } = await supabase.auth.updateUser({ password })
  if (updateError) return { error: updateError.message }

  const supabaseAdmin = getAdminSupabase()
  const { error: dbError } = await supabaseAdmin
    .from('usuarios')
    .update({ requiere_cambio_password: false })
    .eq('id', user.id)

  if (dbError) return { error: 'Error al actualizar estado: ' + dbError.message }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function completeOnboardingAction(data: {
  nombrePropietario: string,
  celularPropietario: string,
  telefonoFijoPropietario: string,
  direccionPropietario: string,
  ciudadPropietario: string,
  departamentoPropietario: string,
  paisPropietario: string,
  correoAlternoPropietario: string,
  
  nombreFirma: string,
  logoFirma: string,
  esloganFirma: string,
  ciudadFirma: string,
  departamentoFirma: string,
  paisFirma: string,
  zonaHorariaFirma: string,
  direccionFirma: string,
  telefonoFirma: string,
  celularFirma: string,
  emailFirma: string
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Usuario no autenticado' }

  const { error: userError } = await supabase
    .from('usuarios')
    .update({ 
      nombre_completo: data.nombrePropietario,
      celular: data.celularPropietario,
      telefono_fijo: data.telefonoFijoPropietario,
      direccion: data.direccionPropietario,
      ciudad: data.ciudadPropietario,
      departamento: data.departamentoPropietario,
      pais: data.paisPropietario,
      correo_alterno: data.correoAlternoPropietario
    })
    .eq('id', user.id)

  if (userError) return { error: 'Error al actualizar perfil: ' + userError.message }

  const { data: miembroData, error: miembroError } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user.id)
    .eq('estado', 'activo')
    .single()

  if (miembroError || !miembroData) return { error: 'Error al obtener la información de tu firma.' }

  const supabaseAdmin = getAdminSupabase()
  const { error: firmaError } = await supabaseAdmin
    .from('firmas')
    .update({
      nombre: data.nombreFirma,
      logo_url: data.logoFirma,
      eslogan: data.esloganFirma,
      ciudad: data.ciudadFirma,
      departamento: data.departamentoFirma,
      pais: data.paisFirma,
      zona_horaria: data.zonaHorariaFirma,
      direccion: data.direccionFirma,
      telefono: data.telefonoFirma,
      celular: data.celularFirma,
      email: data.emailFirma
    })
    .eq('id', miembroData.firma_id)

  if (firmaError) return { error: 'Error al actualizar datos de la firma: ' + firmaError.message }

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function recoverPassword(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = createClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`,
  })

  if (error) {
    return redirect('/forgot-password?message=' + encodeURIComponent(error.message))
  }

  return redirect('/forgot-password?success=' + encodeURIComponent('Revisa tu correo electrónico para obtener el enlace de recuperación.'))
}
