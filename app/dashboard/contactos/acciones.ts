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

export async function actualizarContacto(id: string, formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const datosActualizados = {
    tipo_persona: formData.get('tipo_persona') as string,
    nombre: formData.get('nombre') as string,
    tipo_identificacion: formData.get('tipo_identificacion') as string,
    identificacion: formData.get('identificacion') as string || null,
    correo: formData.get('correo') as string || null,
    telefono: formData.get('telefono') as string || null,
    direccion: formData.get('direccion') as string || null,
    ciudad: formData.get('ciudad') as string || null,
    observaciones: formData.get('observaciones') as string || null,
  }

  const { error } = await supabase
    .from('contactos')
    .update(datosActualizados)
    .eq('id', id)

  if (error) {
    console.error("SUPABASE ERROR: ", error);
    redirect(`/dashboard/contactos/${id}/editar?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard/contactos')
  revalidatePath(`/dashboard/contactos/${id}`)
  redirect(`/dashboard/contactos/${id}`)
}

export async function eliminarContacto(id: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  // Validar si tiene expedientes activos
  const { data: expedientes, error: expError } = await supabase
    .from('expedientes')
    .select('id')
    .eq('cliente_id', id)

  if (expError) throw new Error('Error al validar expedientes del contacto')
  
  if (expedientes && expedientes.length > 0) {
    return { 
      success: false, 
      message: `No se puede eliminar el contacto porque tiene ${expedientes.length} expediente(s) asociado(s). Reasigna los expedientes primero.` 
    }
  }

  const { error } = await supabase
    .from('contactos')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/dashboard/contactos')
  redirect('/dashboard/contactos')
}
