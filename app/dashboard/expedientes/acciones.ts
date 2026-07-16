'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function guardarExpediente(formData: FormData) {
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

  const nuevoExpediente = {
    firma_id: firmaData.firma_id,
    nombre: formData.get('nombre') as string,
    descripcion: formData.get('descripcion') as string,
    radicado: formData.get('radicado') as string,
    cliente_id: formData.get('cliente_id') ? formData.get('cliente_id') as string : null,
    partes: formData.get('partes') as string || null,
    estado: 'activo',
    riesgo: formData.get('riesgo') as string || 'bajo',
    responsable_id: formData.get('responsable_id') ? formData.get('responsable_id') as string : null
  }

  const { error } = await supabase
    .from('expedientes')
    .insert([nuevoExpediente])

  if (error) {
    console.error("SUPABASE ERROR: ", error);
    redirect(`/dashboard/expedientes/nuevo?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard/expedientes')
  redirect('/dashboard/expedientes')
}
