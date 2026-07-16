'use client'

import { useRef, useState } from 'react'
import { crearFirmaYAdmin } from '@/app/superadmin/actions'

export function CreateFirmaForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setNotification(null)
    
    try {
      await crearFirmaYAdmin(formData)
      setNotification({ type: 'success', message: 'Firma y administrador creados con éxito' })
      formRef.current?.reset()
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Error al crear la firma' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {notification && (
        <div className={`p-3 rounded text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notification.message}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre Inicial de la Firma</label>
        <input
          type="text"
          name="nombre_firma"
          required
          className="w-full px-3 py-2 mt-1 border rounded-md"
          placeholder="Ej. Abogados & Asociados"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Correo del Administrador</label>
        <input
          type="email"
          name="email"
          required
          className="w-full px-3 py-2 mt-1 border rounded-md"
          placeholder="admin@firma.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña Temporal</label>
        <input
          type="text"
          name="password"
          required
          className="w-full px-3 py-2 mt-1 border rounded-md"
          placeholder="Password123!"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear Firma y Usuario'}
      </button>
    </form>
  )
}
