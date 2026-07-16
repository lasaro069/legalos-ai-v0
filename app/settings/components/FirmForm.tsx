'use client'

import { useState } from 'react'
import { Card, CardHeader, Field, inputClass, Button } from "@/components/ui"
import { Building2 } from "lucide-react"
import { updateFirmAction } from '../actions'
import { LocationSelector } from '@/components/LocationSelector'
import { createClient } from '@/utils/supabase/client'

export function FirmForm({ initialData, canEdit }: { initialData: any, canEdit: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [nombre, setNombre] = useState(initialData.nombre || '')
  const [eslogan, setEslogan] = useState(initialData.eslogan || '')
  const [email, setEmail] = useState(initialData.email || '')
  const [telefono, setTelefono] = useState(initialData.telefono || '')
  const [celular, setCelular] = useState(initialData.celular || '')
  const [direccion, setDireccion] = useState(initialData.direccion || '')
  const [pais, setPais] = useState(initialData.pais || 'Colombia')
  const [departamento, setDepartamento] = useState(initialData.departamento || '')
  const [ciudad, setCiudad] = useState(initialData.ciudad || '')
  const [zonaHoraria, setZonaHoraria] = useState(initialData.zona_horaria || 'America/Bogota')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canEdit) return
    setLoading(true)
    setError(null)
    
    let logoUrl = initialData.logo_url
    if (logoFile) {
      const ext = logoFile.name.split('.').pop()
      const fileName = `logo-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('firmas_logos')
        .upload(fileName, logoFile)
        
      if (uploadError) {
        setError('Error al subir el logo: ' + uploadError.message)
        setLoading(false)
        return
      }
      const { data: publicUrlData } = supabase.storage
        .from('firmas_logos')
        .getPublicUrl(fileName)
      logoUrl = publicUrlData.publicUrl
    }

    const res = await updateFirmAction(initialData.id, {
      nombre,
      eslogan,
      email,
      telefono,
      celular,
      direccion,
      pais: pais.trim(),
      departamento: departamento.trim(),
      ciudad: ciudad.trim(),
      zona_horaria: zonaHoraria
    })
    
    if (res?.error) setError(res.error)
    setLoading(false)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader title="Mi Firma" subtitle="Datos oficiales de tu despacho." action={<Building2 className="h-4 w-4 text-legal-blue" />} />
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {error && <div className="md:col-span-2 text-red-500 text-sm p-3 bg-red-50 rounded">{error}</div>}
          
          <div className="md:col-span-2 flex items-center gap-4 rounded-lg border border-legal-line bg-slate-50 p-4">
            {initialData.logo_url ? (
              <img src={initialData.logo_url} alt="Logo" className="h-14 w-14 object-cover rounded-lg bg-white border" />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-legal-blue text-lg font-bold text-white">
                {nombre.substring(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-bold text-slate-950">{nombre}</p>
              <p className="mt-1 text-sm text-slate-500">{eslogan || 'Sin eslogan'}</p>
            </div>
          </div>
          
          <Field label="Nombre del despacho">
            <input className={inputClass} value={nombre} onChange={e => setNombre(e.target.value)} disabled={!canEdit} required />
          </Field>
          
          <Field label="Eslogan">
            <input className={inputClass} value={eslogan} onChange={e => setEslogan(e.target.value)} disabled={!canEdit} />
          </Field>

          {canEdit && (
            <div className="md:col-span-2">
              <Field label="Actualizar Logo (Opcional)">
                <input type="file" accept="image/png, image/jpeg, image/jpg" className={inputClass} onChange={(e) => {
                  if (e.target.files && e.target.files[0]) setLogoFile(e.target.files[0])
                }} />
              </Field>
            </div>
          )}

          <Field label="Email de contacto">
            <input className={inputClass} type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={!canEdit} />
          </Field>
          
          <Field label="Celular">
            <input className={inputClass} value={celular} onChange={e => setCelular(e.target.value)} disabled={!canEdit} />
          </Field>
          
          <Field label="Teléfono Fijo">
            <input className={inputClass} value={telefono} onChange={e => setTelefono(e.target.value)} disabled={!canEdit} />
          </Field>
          
          <div className="md:col-span-2">
            <Field label="Dirección">
              <input className={inputClass} value={direccion} onChange={e => setDireccion(e.target.value)} disabled={!canEdit} />
            </Field>
          </div>

          <LocationSelector 
            pais={pais} setPais={canEdit ? setPais : () => {}}
            departamento={departamento} setDepartamento={canEdit ? setDepartamento : () => {}}
            ciudad={ciudad} setCiudad={canEdit ? setCiudad : () => {}}
            inputStyle={inputClass + (canEdit ? '' : ' bg-gray-50')}
          />
          
          <div className="md:col-span-2 mt-2">
            <Field label="Zona Horaria">
              <input className={inputClass} value={zonaHoraria} onChange={e => setZonaHoraria(e.target.value)} disabled={!canEdit} />
            </Field>
          </div>
          
          {canEdit && (
            <div className="md:col-span-2 pt-4 flex justify-end">
              <Button type="submit" disabled={loading} variant="primary">
                {loading ? 'Guardando...' : 'Guardar Firma'}
              </Button>
            </div>
          )}
        </div>
      </form>
    </Card>
  )
}
