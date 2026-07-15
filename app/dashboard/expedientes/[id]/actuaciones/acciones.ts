'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function registrarActuacion(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const expedienteId = formData.get('expediente_id') as string
  const archivo = formData.get('archivo') as File

  let documento_url = null

  if (archivo && archivo.size > 0) {
    const fileExt = archivo.name.split('.').pop()
    const fileName = `${expedienteId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('documentos_actuaciones')
      .upload(fileName, archivo)

    if (uploadError) {
      throw new Error('Error al subir documento: ' + uploadError.message)
    }

    const { data: urlData } = supabase
      .storage
      .from('documentos_actuaciones')
      .getPublicUrl(fileName)
      
    documento_url = urlData.publicUrl
  }

  const nuevaActuacion = {
    expediente_id: expedienteId,
    tipo: formData.get('tipo'),
    titulo: formData.get('titulo'),
    descripcion: formData.get('descripcion'),
    fecha_juridica: formData.get('fecha_juridica'),
    creado_por: user.id,
    documento_url: documento_url
  }

  const { error } = await supabase
    .from('actuaciones')
    .insert([nuevaActuacion])

  if (error) {
    throw new Error('Error al registrar actuación: ' + error.message)
  }

  revalidatePath(`/dashboard/expedientes/${expedienteId}`)
  redirect(`/dashboard/expedientes/${expedienteId}`)
}
