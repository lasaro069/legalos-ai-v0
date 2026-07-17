'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function guardarEvento(formData: FormData) {
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

    const rawInicio = formData.get('fecha_inicio') as string;
    const fecha_inicio = rawInicio.length === 16 ? `${rawInicio}:00-05:00` : rawInicio;
    
    const rawFin = formData.get('fecha_fin') as string;
    const fecha_fin = rawFin ? (rawFin.length === 16 ? `${rawFin}:00-05:00` : rawFin) : null;

    const nuevoEvento = {
      firma_id: firmaData.firma_id,
      titulo: formData.get('titulo') as string,
      descripcion: formData.get('descripcion') as string || null,
      tipo: formData.get('tipo') as string,
      fecha_inicio,
      fecha_fin,
    expediente_id: formData.get('expediente_id') ? formData.get('expediente_id') as string : null,
    responsable_id: formData.get('responsable_id') ? formData.get('responsable_id') as string : null,
    creado_por: user.id,
    estado: 'pendiente'
  }

  const { error } = await supabase
    .from('eventos_agenda')
    .insert([nuevoEvento])

  if (error) {
    console.error("SUPABASE ERROR: ", error);
    redirect(`/dashboard/agenda/nuevo?error=${encodeURIComponent(error.message)}`)
  }

  // Revalidar y redirigir
  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard') // Para que la Bandeja del Día se actualice también
  redirect('/dashboard/agenda')
}

export async function cambiarEstadoEvento(id: string, nuevoEstado: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const { error } = await supabase
    .from('eventos_agenda')
    .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error("SUPABASE ERROR: ", error);
    throw new Error('No se pudo actualizar el estado del evento')
  }

  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard')
  redirect('/dashboard/agenda')
}

export async function aplazarEvento(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const id = formData.get('id') as string;
  let nueva_fecha = formData.get('nueva_fecha') as string;
  
  if (nueva_fecha.length === 16) {
    nueva_fecha = `${nueva_fecha}:00-05:00`;
  }

  const { error } = await supabase
    .from('eventos_agenda')
    .update({ 
      fecha_inicio: nueva_fecha,
      estado: 'pendiente', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)

  if (error) {
    console.error("SUPABASE ERROR: ", error);
    throw new Error('No se pudo aplazar el evento')
  }

  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard')
  redirect(`/dashboard/agenda/${id}`)
}
