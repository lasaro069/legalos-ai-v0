import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { actualizarExpediente } from '../../acciones'
import { redirect, notFound } from 'next/navigation'

export default async function EditarExpedientePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { error?: string }
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  // Fetch expediente
  const { data: expediente, error } = await supabase
    .from('expedientes')
    .select('*')
    .eq('id', params.id)
    .single()
    
  if (error || !expediente) notFound()

  // Validar acceso (firma_id)
  const { data: firmaData } = await supabase
    .from('miembros_firma')
    .select('id, firma_id, rol')
    .eq('usuario_id', user.id)
    .single()
    
  if (!firmaData || firmaData.firma_id !== expediente.firma_id) {
    return <div>No tienes permiso para editar este expediente.</div>
  }
  
  const { data: abogados } = await supabase
    .from('miembros_firma')
    .select('id, usuarios(id, nombre_completo, email)')
    .eq('firma_id', firmaData.firma_id)

  const { data: contactos } = await supabase
    .from('contactos')
    .select('id, nombre, identificacion')
    .eq('firma_id', firmaData.firma_id)
    .order('nombre', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {searchParams?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error de base de datos: </strong>
          <span className="block sm:inline">{searchParams.error}</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-legal-ink">Editar Expediente</h2>
          <p className="text-sm text-legal-navy/80">Actualiza los detalles del caso.</p>
        </div>
        <Link href={`/dashboard/expedientes/${expediente.id}`} className="text-legal-blue hover:underline text-sm font-semibold">
          Cancelar y volver
        </Link>
      </div>

      <form action={actualizarExpediente} className="flex flex-col gap-8">
        <input type="hidden" name="id" value={expediente.id} />
        
        {/* SECCIÓN 1: DATOS BÁSICOS */}
        <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line flex flex-col gap-6">
          <h3 className="font-bold text-lg text-legal-ink border-b pb-2">Datos Básicos</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="nombre" className="font-semibold text-sm text-legal-navy">Nombre del Expediente *</label>
              <input type="text" id="nombre" name="nombre" defaultValue={expediente.nombre} required className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cliente_id" className="font-semibold text-sm text-legal-navy">Cliente Principal *</label>
              <select id="cliente_id" name="cliente_id" defaultValue={expediente.cliente_id || ''} required className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white">
                <option value="">-- Seleccione un cliente --</option>
                {contactos?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.nombre} {c.identificacion ? `(${c.identificacion})` : ''}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="partes" className="font-semibold text-sm text-legal-navy">Otras Partes Procesales</label>
              <input type="text" id="partes" name="partes" defaultValue={expediente.partes || ''} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="descripcion" className="font-semibold text-sm text-legal-navy">Descripción / Hechos Clave</label>
            <textarea id="descripcion" name="descripcion" defaultValue={expediente.descripcion || ''} rows={3} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50"></textarea>
          </div>
        </div>

        {/* SECCIÓN 2: DATOS JUDICIALES */}
        <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line flex flex-col gap-6">
          <h3 className="font-bold text-lg text-legal-ink border-b pb-2">Datos Judiciales / Legales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="radicado" className="font-semibold text-sm text-legal-navy">Número de Radicado</label>
              <input type="text" id="radicado" name="radicado" defaultValue={expediente.radicado || ''} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="autoridad" className="font-semibold text-sm text-legal-navy">Autoridad / Juzgado</label>
              <input type="text" id="autoridad" name="autoridad" defaultValue={expediente.autoridad || ''} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="area_juridica" className="font-semibold text-sm text-legal-navy">Área Jurídica</label>
              <select id="area_juridica" name="area_juridica" defaultValue={expediente.area_juridica || ''} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white">
                <option value="">-- Seleccione área --</option>
                <option value="Civil">Civil</option>
                <option value="Penal">Penal</option>
                <option value="Laboral">Laboral</option>
                <option value="Familia">Familia</option>
                <option value="Administrativo">Administrativo</option>
                <option value="Comercial">Comercial</option>
                <option value="Constitucional">Constitucional</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="tipo_proceso" className="font-semibold text-sm text-legal-navy">Tipo de Proceso</label>
              <input type="text" id="tipo_proceso" name="tipo_proceso" defaultValue={expediente.tipo_proceso || ''} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: GESTIÓN INTERNA */}
        <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line flex flex-col gap-6">
          <h3 className="font-bold text-lg text-legal-ink border-b pb-2">Gestión Interna</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="cuantia" className="font-semibold text-sm text-legal-navy">Cuantía (Honorarios / Valor) - COP</label>
              <input type="number" id="cuantia" name="cuantia" defaultValue={expediente.cuantia || ''} min="0" step="1000" className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="estado" className="font-semibold text-sm text-legal-navy">Estado</label>
              <select id="estado" name="estado" defaultValue={expediente.estado} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white">
                <option value="activo">Activo</option>
                <option value="archivado">Archivado</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="riesgo" className="font-semibold text-sm text-legal-navy">Nivel de Riesgo Procesal</label>
              <select id="riesgo" name="riesgo" defaultValue={expediente.riesgo} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white">
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
                <option value="critico">Crítico</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="responsable_id" className="font-semibold text-sm text-legal-navy">Abogado Responsable</label>
              <select id="responsable_id" name="responsable_id" defaultValue={expediente.responsable_id || firmaData.id} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white">
                {abogados?.map((ab: any) => (
                  <option key={ab.id} value={ab.id}>
                    {ab.usuarios.nombre_completo || ab.usuarios.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 sticky bottom-4 z-10">
          <button type="submit" className="bg-legal-gold hover:bg-yellow-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-transform hover:-translate-y-1">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  )
}
