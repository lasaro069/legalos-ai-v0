'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function guardarEvento(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  // Obtener primera firma del usuario para el MVP
  const { data: miembros } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user.id)
    .limit(1)
    .single()

  if (!miembros) throw new Error('Usuario no pertenece a ninguna firma')

  const expedienteId = formData.get('expediente_id') as string

  const nuevoEvento = {
    firma_id: miembros.firma_id,
    expediente_id: expedienteId || null,
    titulo: formData.get('titulo'),
    descripcion: formData.get('descripcion'),
    fecha_inicio: formData.get('fecha_inicio'),
    tipo: formData.get('tipo'),
    responsable_id: user.id, // Por ahora el mismo usuario
    creado_por: user.id
  }

  const { error } = await supabase
    .from('eventos_agenda')
    .insert([nuevoEvento])

  if (error) {
    throw new Error('Error al registrar evento: ' + error.message)
  }

  revalidatePath('/dashboard/agenda')
  if (expedienteId) {
    revalidatePath(`/dashboard/expedientes/${expedienteId}`)
  }
  
  redirect('/dashboard/agenda')
}
