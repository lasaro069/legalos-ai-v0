'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function guardarContacto(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  // Obtener firma_id
  const { data: firmaData } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user.id)
    .single()
    
  if (!firmaData?.firma_id) throw new Error('Firma no encontrada')

  const nuevoContacto = {
    firma_id: firmaData.firma_id,
    tipo_persona: formData.get('tipo_persona') as string,
    nombre: formData.get('nombre') as string,
    tipo_identificacion: formData.get('tipo_identificacion') as string,
    identificacion: formData.get('identificacion') as string || null,
    correo: formData.get('correo') as string || null,
    telefono: formData.get('telefono') as string || null,
    direccion: formData.get('direccion') as string || null,
    ciudad: formData.get('ciudad') as string || null,
    observaciones: formData.get('observaciones') as string || null,
    creado_por: user.id
  }

  const { error } = await supabase
    .from('contactos')
    .insert([nuevoContacto])

  if (error) {
    console.error("SUPABASE ERROR: ", error);
    redirect(`/dashboard/contactos/nuevo?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard/contactos')
  redirect('/dashboard/contactos')
}
