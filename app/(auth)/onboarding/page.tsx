'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { completeOnboardingAction } from '../actions'
import { LocationSelector } from '@/components/LocationSelector'
import { COLOMBIA_DATA } from '@/lib/colombia-data'

export default function OnboardingPage() {
  // Propietario
  const [nombrePropietario, setNombrePropietario] = useState('')
  const [celularPropietario, setCelularPropietario] = useState('')
  const [telefonoFijoPropietario, setTelefonoFijoPropietario] = useState('')
  const [direccionPropietario, setDireccionPropietario] = useState('')
  const [ciudadPropietario, setCiudadPropietario] = useState('')
  const [departamentoPropietario, setDepartamentoPropietario] = useState('')
  const [paisPropietario, setPaisPropietario] = useState('Colombia')
  const [correoAlternoPropietario, setCorreoAlternoPropietario] = useState('')
  const [correoPrincipal, setCorreoPrincipal] = useState('')

  // Firma
  const [nombreFirma, setNombreFirma] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [esloganFirma, setEsloganFirma] = useState('')
  const [ciudadFirma, setCiudadFirma] = useState('')
  const [departamentoFirma, setDepartamentoFirma] = useState('')
  const [paisFirma, setPaisFirma] = useState('Colombia')
  const [zonaHorariaFirma, setZonaHorariaFirma] = useState('America/Bogota')
  const [direccionFirma, setDireccionFirma] = useState('')
  const [telefonoFirma, setTelefonoFirma] = useState('')
  const [celularFirma, setCelularFirma] = useState('')
  const [emailFirma, setEmailFirma] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setCorreoPrincipal(user.email)
      }
    }
    fetchUser()
  }, [supabase])

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let logoUrl = ''
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

    const result = await completeOnboardingAction({
      nombrePropietario,
      celularPropietario,
      telefonoFijoPropietario,
      direccionPropietario,
      ciudadPropietario: ciudadPropietario.trim(),
      departamentoPropietario: departamentoPropietario.trim(),
      paisPropietario: paisPropietario.trim(),
      correoAlternoPropietario,
      
      nombreFirma,
      logoFirma: logoUrl,
      esloganFirma,
      ciudadFirma: ciudadFirma.trim(),
      departamentoFirma: departamentoFirma.trim(),
      paisFirma: paisFirma.trim(),
      zonaHorariaFirma,
      direccionFirma,
      telefonoFirma,
      celularFirma,
      emailFirma
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const inputStyle = "w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12">
      <div className="w-full max-w-3xl p-8 space-y-6 bg-white rounded shadow">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Completar Registro de la Firma</h2>
          <p className="mt-2 text-gray-600">
            Por favor, completa los siguientes datos para configurar tu entorno de trabajo.
          </p>
        </div>
        
        <form className="space-y-8" onSubmit={handleComplete}>
          {error && <div className="text-red-500 text-sm p-4 bg-red-50 border border-red-200 rounded">{error}</div>}
          
          {/* SECCIÓN: INFORMACIÓN DEL PROPIETARIO */}
          <div>
            <h3 className="text-xl font-semibold text-legal-ink border-b pb-2 mb-4">1. Información del Propietario</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input type="text" required className={inputStyle} value={nombrePropietario} onChange={(e) => setNombrePropietario(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo Principal (Solo lectura)</label>
                <input type="email" readOnly className={`${inputStyle} bg-gray-100 cursor-not-allowed`} value={correoPrincipal} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Correo Alterno</label>
                <input type="email" className={inputStyle} value={correoAlternoPropietario} onChange={(e) => setCorreoAlternoPropietario(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Celular</label>
                <input type="text" className={inputStyle} value={celularPropietario} onChange={(e) => setCelularPropietario(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono Fijo</label>
                <input type="text" className={inputStyle} value={telefonoFijoPropietario} onChange={(e) => setTelefonoFijoPropietario(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input type="text" className={inputStyle} value={direccionPropietario} onChange={(e) => setDireccionPropietario(e.target.value)} />
              </div>
              
              {/* UBICACIÓN PROPIETARIO */}
              <LocationSelector 
                pais={paisPropietario} setPais={setPaisPropietario}
                departamento={departamentoPropietario} setDepartamento={setDepartamentoPropietario}
                ciudad={ciudadPropietario} setCiudad={setCiudadPropietario}
                inputStyle={inputStyle}
              />
            </div>
          </div>

          {/* SECCIÓN: INFORMACIÓN DE LA FIRMA */}
          <div>
            <h3 className="text-xl font-semibold text-legal-ink border-b pb-2 mb-4">2. Datos de la Firma</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Nombre de la Firma</label>
                <input type="text" required className={inputStyle} value={nombreFirma} onChange={(e) => setNombreFirma(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Logo de la Firma (Opcional)</label>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg" 
                  className={inputStyle} 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setLogoFile(e.target.files[0])
                    }
                  }} 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Eslogan de la Firma</label>
                <input type="text" className={inputStyle} value={esloganFirma} onChange={(e) => setEsloganFirma(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email de la Firma</label>
                <input type="email" className={inputStyle} value={emailFirma} onChange={(e) => setEmailFirma(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Celular</label>
                <input type="text" className={inputStyle} value={celularFirma} onChange={(e) => setCelularFirma(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono (Fijo)</label>
                <input type="text" className={inputStyle} value={telefonoFirma} onChange={(e) => setTelefonoFirma(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <input type="text" className={inputStyle} value={direccionFirma} onChange={(e) => setDireccionFirma(e.target.value)} />
              </div>

              {/* UBICACIÓN FIRMA */}
              <LocationSelector 
                pais={paisFirma} setPais={setPaisFirma}
                departamento={departamentoFirma} setDepartamento={setDepartamentoFirma}
                ciudad={ciudadFirma} setCiudad={setCiudadFirma}
                inputStyle={inputStyle}
              />

              <div className="md:col-span-2 mt-2">
                <label className="block text-sm font-medium text-gray-700">Zona Horaria</label>
                <input type="text" className={inputStyle} value={zonaHorariaFirma} onChange={(e) => setZonaHorariaFirma(e.target.value)} />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 text-white font-medium bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando e Iniciando Configuración...' : 'Finalizar Configuración'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
