import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ContactoForm from '../../nuevo/ContactoForm'

export default async function EditarContactoPage({ params, searchParams }: { params: { id: string }, searchParams?: { error?: string } }) {
  const supabase = createClient()
  
  const { data: contacto, error } = await supabase
    .from('contactos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !contacto) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {searchParams?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error al actualizar: </strong>
          <span className="block sm:inline">{searchParams.error}</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-legal-ink">Editar Contacto</h2>
          <p className="text-sm text-legal-navy/80">Actualiza la información de {contacto.nombre}</p>
        </div>
        <Link href={`/dashboard/contactos/${contacto.id}`} className="text-legal-blue hover:underline text-sm font-semibold">
          Cancelar y volver
        </Link>
      </div>

      <ContactoForm initialData={contacto} />
    </div>
  )
}
