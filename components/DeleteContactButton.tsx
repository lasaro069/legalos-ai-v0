'use client'

import { Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { eliminarContacto } from '@/app/dashboard/contactos/acciones'

export function DeleteContactButton({ id, expedientesCount }: { id: string, expedientesCount: number }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = () => {
    if (expedientesCount > 0) {
      setError(`No se puede eliminar porque tiene ${expedientesCount} expediente(s).`)
      return
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer.')) {
      startTransition(async () => {
        const res = await eliminarContacto(id)
        if (res && !res.success) {
          setError(res.message)
        }
      })
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
      >
        <Trash2 size={16} />
        {isPending ? 'Eliminando...' : 'Eliminar Contacto'}
      </button>
      {error && <p className="text-xs text-red-500 mt-2 max-w-xs text-center">{error}</p>}
    </div>
  )
}
