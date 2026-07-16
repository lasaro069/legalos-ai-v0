'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function guardarContacto(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data: miembros } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user.id)
    .limit(1)
    .single()

  if (!miembros) throw new Error('No hay firma asociada')

  const nuevoContacto = {
    firma_id: miembros.firma_id,
    tipo_persona: formData.get('tipo_persona'),
    nombre: formData.get('nombre'),
    tipo_identificacion: formData.get('tipo_identificacion'),
    identificacion: formData.get('identificacion'),
    correo: formData.get('correo'),
    telefono: formData.get('telefono'),
    direccion: formData.get('direccion'),
    ciudad: formData.get('ciudad'),
    observaciones: formData.get('observaciones'),
    creado_por: user.id
  }

  const { data, error } = await supabase
    .from('contactos')
    .insert([nuevoContacto])
    .select('id')
    .single()

  if (error) {
    throw new Error('Error guardando contacto: ' + error.message)
  }

  revalidatePath('/dashboard/contactos')
  redirect(`/dashboard/contactos/${data.id}`)
}
