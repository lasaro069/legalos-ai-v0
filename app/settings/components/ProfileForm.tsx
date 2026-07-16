'use client'

import { useState } from 'react'
import { Card, CardHeader, Field, inputClass, Button } from "@/components/ui"
import { UserRound } from "lucide-react"
import { updateProfileAction } from '../actions'
import { LocationSelector } from '@/components/LocationSelector'

export function ProfileForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [nombre, setNombre] = useState(initialData.nombre_completo || '')
  const [celular, setCelular] = useState(initialData.celular || '')
  const [telefonoFijo, setTelefonoFijo] = useState(initialData.telefono_fijo || '')
  const [correoAlterno, setCorreoAlterno] = useState(initialData.correo_alterno || '')
  const [direccion, setDireccion] = useState(initialData.direccion || '')
  const [pais, setPais] = useState(initialData.pais || 'Colombia')
  const [departamento, setDepartamento] = useState(initialData.departamento || '')
  const [ciudad, setCiudad] = useState(initialData.ciudad || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await updateProfileAction({
      nombre_completo: nombre,
      celular,
      telefono_fijo: telefonoFijo,
      correo_alterno: correoAlterno,
      direccion,
      pais: pais.trim(),
      departamento: departamento.trim(),
      ciudad: ciudad.trim()
    })
    if (res?.error) setError(res.error)
    setLoading(false)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader title="Perfil del abogado" subtitle="Datos que aparecen en expedientes, reportes y comunicaciones." action={<UserRound className="h-4 w-4 text-legal-blue" />} />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {error && <div className="md:col-span-2 text-red-500 text-sm p-3 bg-red-50 rounded">{error}</div>}
          
          <Field label="Nombre profesional" hint="Visible en tareas, audiencias y comunicaciones.">
            <input className={inputClass} value={nombre} onChange={e => setNombre(e.target.value)} required />
          </Field>
          
          <Field label="Correo de acceso (Solo lectura)" hint="Correo usado para iniciar sesión.">
            <input className={`${inputClass} bg-gray-100`} value={initialData.email} readOnly />
          </Field>

          <Field label="Correo alterno" hint="Correo adicional de contacto.">
            <input className={inputClass} type="email" value={correoAlterno} onChange={e => setCorreoAlterno(e.target.value)} />
          </Field>
          
          <Field label="Celular">
            <input className={inputClass} value={celular} onChange={e => setCelular(e.target.value)} />
          </Field>
          
          <Field label="Teléfono fijo">
            <input className={inputClass} value={telefonoFijo} onChange={e => setTelefonoFijo(e.target.value)} />
          </Field>
          
          <div className="md:col-span-2">
            <Field label="Dirección">
              <input className={inputClass} value={direccion} onChange={e => setDireccion(e.target.value)} />
            </Field>
          </div>

          <LocationSelector 
            pais={pais} setPais={setPais}
            departamento={departamento} setDepartamento={setDepartamento}
            ciudad={ciudad} setCiudad={setCiudad}
            inputStyle={inputClass}
          />
          
          <div className="md:col-span-2 pt-4 flex justify-end">
            <Button type="submit" disabled={loading} variant="primary">
              {loading ? 'Guardando...' : 'Guardar Perfil'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
