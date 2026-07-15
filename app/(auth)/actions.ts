'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?message=' + encodeURIComponent(error.message))
  }

  return redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nombre_completo = formData.get('nombre_completo') as string
  const nombre_firma = formData.get('nombre_firma') as string

  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre_completo,
        nombre_firma,
      },
    },
  })

  if (error) {
    return redirect('/register?message=' + encodeURIComponent(error.message))
  }

  // Si no hay confirmación de email (lo cual es por defecto en desarrollo local), redireccionar directamente a login o dashboard
  return redirect('/login?message=Usuario creado. Por favor inicia sesión.')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}
