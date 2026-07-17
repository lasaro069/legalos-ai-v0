'use client'

import { useState } from 'react'
import { guardarContacto } from '../acciones'

export default function ContactoForm() {
  const [tipoPersona, setTipoPersona] = useState('natural')
  const [tipoId, setTipoId] = useState('cc')

  const handleTipoPersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setTipoPersona(val)
    if (val === 'juridica') {
      setTipoId('nit')
    }
  }

  return (
    <form action={guardarContacto} className="flex flex-col gap-8">
      
      {/* SECCIÓN 1: DATOS BÁSICOS */}
      <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line flex flex-col gap-6">
        <h3 className="font-bold text-lg text-legal-ink border-b pb-2">Datos Básicos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="tipo_persona" className="font-semibold text-sm text-legal-navy">Tipo de Persona *</label>
            <select 
              id="tipo_persona" 
              name="tipo_persona" 
              value={tipoPersona}
              onChange={handleTipoPersonaChange}
              required 
              className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white"
            >
              <option value="natural">Persona Natural</option>
              <option value="juridica">Persona Jurídica (Empresa)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="nombre" className="font-semibold text-sm text-legal-navy">
              {tipoPersona === 'juridica' ? 'Razón Social *' : 'Nombre Completo *'}
            </label>
            <input type="text" id="nombre" name="nombre" required className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder={tipoPersona === 'juridica' ? 'Ej. Empresa XYZ S.A.S.' : 'Ej. Juan Pérez'} />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tipo_identificacion" className="font-semibold text-sm text-legal-navy">Tipo de Identificación *</label>
            <select 
              id="tipo_identificacion" 
              name="tipo_identificacion" 
              value={tipoId}
              onChange={(e) => setTipoId(e.target.value)}
              required 
              className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50 bg-white"
            >
              <option value="cc">Cédula de Ciudadanía (CC)</option>
              <option value="nit">NIT</option>
              <option value="ce">Cédula de Extranjería (CE)</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="identificacion" className="font-semibold text-sm text-legal-navy">Número de Identificación</label>
            <input type="text" id="identificacion" name="identificacion" className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="Ej. 1020304050" />
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: DATOS DE CONTACTO */}
      <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line flex flex-col gap-6">
        <h3 className="font-bold text-lg text-legal-ink border-b pb-2">Información de Contacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="correo" className="font-semibold text-sm text-legal-navy">Correo Electrónico</label>
            <input type="email" id="correo" name="correo" className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="Ej. correo@ejemplo.com" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="telefono" className="font-semibold text-sm text-legal-navy">Teléfono / Celular</label>
            <input type="text" id="telefono" name="telefono" className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="Ej. +57 300 123 4567" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="direccion" className="font-semibold text-sm text-legal-navy">Dirección</label>
            <input type="text" id="direccion" name="direccion" className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="Ej. Calle 123 #45-67" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="ciudad" className="font-semibold text-sm text-legal-navy">Ciudad</label>
            <input type="text" id="ciudad" name="ciudad" className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="Ej. Bogotá" />
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: OTROS DETALLES */}
      <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line flex flex-col gap-6">
        <h3 className="font-bold text-lg text-legal-ink border-b pb-2">Otros Detalles</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="observaciones" className="font-semibold text-sm text-legal-navy">Observaciones / Notas Internas</label>
            <textarea id="observaciones" name="observaciones" rows={3} className="border border-legal-line rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-legal-gold/50" placeholder="Información adicional relevante..."></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2 sticky bottom-4 z-10">
        <button type="submit" className="bg-legal-gold hover:bg-yellow-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-transform hover:-translate-y-1">
          Guardar Contacto
        </button>
      </div>
    </form>
  )
}
