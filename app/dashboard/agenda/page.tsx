import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import ListaVencimientos from '@/components/agenda/ListaVencimientos'

export default async function AgendaPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Obtener firmas del usuario
  const { data: miembros } = await supabase
    .from('miembros_firma')
    .select('firma_id')
    .eq('usuario_id', user.id)

  const firmaIds = miembros?.map(m => m.firma_id) || []

  // Obtener eventos pendientes
  const { data: eventos, error } = await supabase
    .from('eventos_agenda')
    .select('*, responsable:usuarios!eventos_agenda_responsable_id_fkey(nombre_completo), expedientes(nombre)')
    .in('firma_id', firmaIds)
    .neq('estado', 'cancelada')
    .order('fecha_inicio', { ascending: true })

  if (error) {
    console.error("Error obteniendo agenda:", error)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-legal-ink">Agenda y Vencimientos</h2>
          <p className="text-sm text-legal-navy/70 mt-1">Controla tus términos procesales y audiencias</p>
        </div>
        <Link 
          href="/dashboard/agenda/nuevo" 
          className="bg-legal-gold hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors text-sm flex items-center gap-2"
        >
          <span>+</span> Nuevo Término
        </Link>
      </div>

      <div className="bg-legal-navy text-white p-6 rounded-xl shadow-panel">
        <h3 className="text-xl font-bold mb-2">Próximos Vencimientos</h3>
        <p className="text-white/70 text-sm">Organizados por nivel de urgencia</p>
      </div>

      <ListaVencimientos eventos={eventos || []} />
    </div>
  )
}
