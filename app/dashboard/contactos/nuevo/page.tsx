import Link from 'next/link'
import ContactoForm from './ContactoForm'

export default function NuevoContactoPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
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
          <h2 className="text-2xl font-bold text-legal-ink">Crear Nuevo Contacto</h2>
          <p className="text-sm text-legal-navy/80">Registra un nuevo cliente, contraparte o contacto para tu firma.</p>
        </div>
        <Link href="/dashboard/contactos" className="text-legal-blue hover:underline text-sm font-semibold">
          Cancelar y volver
        </Link>
      </div>

      <ContactoForm />
    </div>
  )
}
