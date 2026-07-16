'use client'

import Link from 'next/link'
import { guardarContacto } from '../acciones'
import { useState } from 'react'

export default function NuevoContactoPage() {
  const [tipoPersona, setTipoPersona] = useState('natural')

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/contactos" className="text-legal-navy hover:text-legal-gold">
          ← Volver al Directorio
        </Link>
        <h2 className="text-2xl font-bold text-legal-ink">Registrar Nuevo Contacto</h2>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-panel border border-legal-line">
        <form action={guardarContacto} className="flex flex-col gap-6">
          
          {/* TIPO DE PERSONA */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-legal-navy">Tipo de Persona *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tipo_persona" value="natural" checked={tipoPersona === 'natural'} onChange={() => setTipoPersona('natural')} className="accent-legal-gold w-4 h-4" />
                <span>Persona Natural</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="tipo_persona" value="juridica" checked={tipoPersona === 'juridica'} onChange={() => setTipoPersona('juridica')} className="accent-legal-gold w-4 h-4" />
                <span>Persona Jurídica (Empresa)</span>
              </label>
            </div>
          </div>

          <hr className="border-legal-line/30" />

          {/* DATOS PRINCIPALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="nombre" className="font-semibold text-sm text-legal-navy">
                {tipoPersona === 'natural' ? 'Nombre Completo *' : 'Razón Social *'}
              </label>
              <input type="text" id="nombre" name="nombre" required placeholder={tipoPersona === 'natural' ? 'Ej. Juan Pérez' : 'Ej. Empresa S.A.S.'} className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="tipo_identificacion" className="font-semibold text-sm text-legal-navy">Tipo de Documento</label>
              <select id="tipo_identificacion" name="tipo_identificacion" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold bg-white">
                <option value="cc">Cédula de Ciudadanía (CC)</option>
                <option value="nit">NIT</option>
                <option value="ce">Cédula de Extranjería (CE)</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="identificacion" className="font-semibold text-sm text-legal-navy">Número de Identificación</label>
              <input type="text" id="identificacion" name="identificacion" placeholder="Ej. 1020304050" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" />
            </div>
          </div>

          <hr className="border-legal-line/30" />

          {/* DATOS DE CONTACTO */}
          <h3 className="font-semibold text-lg text-legal-ink mt-2">Datos de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="correo" className="font-semibold text-sm text-legal-navy">Correo Electrónico</label>
              <input type="email" id="correo" name="correo" placeholder="ejemplo@correo.com" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="telefono" className="font-semibold text-sm text-legal-navy">Teléfono / Celular</label>
              <input type="tel" id="telefono" name="telefono" placeholder="Ej. 300 123 4567" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ciudad" className="font-semibold text-sm text-legal-navy">Ciudad</label>
              <input type="text" id="ciudad" name="ciudad" placeholder="Ej. Bogotá" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="direccion" className="font-semibold text-sm text-legal-navy">Dirección Física</label>
              <input type="text" id="direccion" name="direccion" placeholder="Ej. Calle 123 #45-67" className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="observaciones" className="font-semibold text-sm text-legal-navy">Observaciones Adicionales</label>
            <textarea id="observaciones" name="observaciones" rows={3} placeholder="Notas internas sobre este contacto..." className="border border-legal-line rounded p-2 focus:outline-none focus:border-legal-gold"></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-legal-line/30">
            <Link href="/dashboard/contactos" className="px-6 py-2 border border-legal-line text-legal-navy rounded font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2 bg-legal-gold text-white rounded font-medium hover:bg-yellow-600 shadow-sm transition-colors">
              Guardar Contacto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
