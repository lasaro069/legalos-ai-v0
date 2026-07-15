'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function crearExpediente(formData: FormData) {
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

  const responsableId = formData.get('responsable_id') as string

  const nuevoExpediente = {
    firma_id: firmaData.firma_id,
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    radicado: formData.get('radicado'),
    cliente: formData.get('cliente'),
    partes: formData.get('partes'),
    riesgo: formData.get('riesgo'),
    prioridad: formData.get('prioridad'),
    responsable_id: responsableId || null,
  }

  const { error } = await supabase
    .from('expedientes')
    .insert([nuevoExpediente])

  if (error) {
    throw new Error('Error al crear expediente: ' + error.message)
  }

  revalidatePath('/dashboard/expedientes')
  redirect('/dashboard/expedientes')
}
