import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import ExpedientesKanban from '@/components/expedientes/ExpedientesKanban'

export default async function ExpedientesPage() {
  const supabase = createClient()
  
  const { data: expedientes, error } = await supabase
    .from('expedientes')
    .select('*, contactos(nombre)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-legal-ink">Expedientes</h2>
          <p className="text-sm text-legal-navy/70 mt-1">Gestión de casos y procesos jurídicos</p>
        </div>
        <Link 
          href="/dashboard/expedientes/nuevo" 
          className="bg-legal-gold hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
        >
          <span>+</span> Nuevo Expediente
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
          <strong>Error cargando expedientes:</strong> {error.message}
        </div>
      )}

      <ExpedientesKanban expedientes={expedientes || []} />
    </div>
  )
}
