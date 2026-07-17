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
    estado: formData.get('estado') as string || 'activo',
    riesgo: formData.get('riesgo') as string || 'bajo',
    responsable_id: formData.get('responsable_id') ? formData.get('responsable_id') as string : null,
    autoridad: formData.get('autoridad') as string || null,
    area_juridica: formData.get('area_juridica') as string || null,
    tipo_proceso: formData.get('tipo_proceso') as string || null,
    cuantia: formData.get('cuantia') ? Number(formData.get('cuantia')) : null,
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

export async function guardarActuacion(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const expediente_id = formData.get('expediente_id') as string;
  const archivo = formData.get('documento') as File | null;
  let documento_url = null;

  if (archivo && archivo.size > 0) {
    const ext = archivo.name.split('.').pop();
    const fileName = `${expediente_id}/${Date.now()}.${ext}`; // Organizado en carpeta por expediente
    const { error: uploadError } = await supabase.storage
      .from('documentos_actuaciones')
      .upload(fileName, archivo);
      
    if (uploadError) {
      console.error("Upload error", uploadError);
      redirect(`/dashboard/expedientes/${expediente_id}/actuaciones/nuevo?error=${encodeURIComponent('Error subiendo archivo: ' + uploadError.message)}`)
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('documentos_actuaciones')
      .getPublicUrl(fileName);
      
    documento_url = publicUrl;
  }

  const nuevaActuacion = {
    expediente_id,
    tipo: formData.get('tipo') as string,
    titulo: formData.get('titulo') as string,
    descripcion: formData.get('descripcion') as string || null,
    fecha_juridica: formData.get('fecha_juridica') as string,
    creado_por: user.id,
    documento_url
  }

  const { error } = await supabase
    .from('actuaciones')
    .insert([nuevaActuacion])

  if (error) {
    console.error("SUPABASE ERROR: ", error);
    redirect(`/dashboard/expedientes/${expediente_id}/actuaciones/nuevo?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(`/dashboard/expedientes/${expediente_id}`)
  redirect(`/dashboard/expedientes/${expediente_id}`)
}

export async function actualizarExpediente(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const id = formData.get('id') as string;

  const expedienteActualizado = {
    nombre: formData.get('nombre') as string,
    descripcion: formData.get('descripcion') as string,
    radicado: formData.get('radicado') as string,
    cliente_id: formData.get('cliente_id') ? formData.get('cliente_id') as string : null,
    partes: formData.get('partes') as string || null,
    estado: formData.get('estado') as string || 'activo',
    riesgo: formData.get('riesgo') as string || 'bajo',
    responsable_id: formData.get('responsable_id') ? formData.get('responsable_id') as string : null,
    autoridad: formData.get('autoridad') as string || null,
    area_juridica: formData.get('area_juridica') as string || null,
    tipo_proceso: formData.get('tipo_proceso') as string || null,
    cuantia: formData.get('cuantia') ? Number(formData.get('cuantia')) : null,
  }

  const { error } = await supabase
    .from('expedientes')
    .update(expedienteActualizado)
    .eq('id', id)

  if (error) {
    console.error("SUPABASE ERROR: ", error);
    redirect(`/dashboard/expedientes/${id}/editar?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard/expedientes')
  revalidatePath(`/dashboard/expedientes/${id}`)
  redirect(`/dashboard/expedientes/${id}`)
}

export async function actualizarActuacion(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Usuario no autenticado')

  const expediente_id = formData.get('expediente_id') as string;
  const actuacion_id = formData.get('actuacion_id') as string;
  const archivo = formData.get('documento') as File | null;
  
  let documento_url: string | null = null;

  if (archivo && archivo.size > 0) {
    const ext = archivo.name.split('.').pop();
    const fileName = `${expediente_id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('documentos_actuaciones')
      .upload(fileName, archivo);
      
    if (uploadError) {
      console.error("Upload error", uploadError);
      redirect(`/dashboard/expedientes/${expediente_id}/actuaciones/${actuacion_id}/editar?error=${encodeURIComponent('Error subiendo nuevo archivo: ' + uploadError.message)}`)
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('documentos_actuaciones')
      .getPublicUrl(fileName);
      
    documento_url = publicUrl;
  }

  const actuacionActualizada: any = {
    tipo: formData.get('tipo') as string,
    titulo: formData.get('titulo') as string,
    descripcion: formData.get('descripcion') as string || null,
    fecha_juridica: formData.get('fecha_juridica') as string,
    updated_at: new Date().toISOString()
  }

  // Solo actualizar el documento si se subió uno nuevo
  if (documento_url) {
    actuacionActualizada.documento_url = documento_url;
  }

  const { error } = await supabase
    .from('actuaciones')
    .update(actuacionActualizada)
    .eq('id', actuacion_id)

  if (error) {
    console.error("SUPABASE ERROR: ", error);
    redirect(`/dashboard/expedientes/${expediente_id}/actuaciones/${actuacion_id}/editar?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(`/dashboard/expedientes/${expediente_id}`)
  redirect(`/dashboard/expedientes/${expediente_id}`)
}
