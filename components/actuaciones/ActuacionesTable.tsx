'use client'

import { useState } from 'react'

export default function ActuacionesTable({ actuaciones }: { actuaciones: any[] }) {
  if (!actuaciones || actuaciones.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl border border-legal-line text-center text-gray-500 shadow-panel">
        <div className="text-4xl mb-4 opacity-50">📄</div>
        <h3 className="text-lg font-semibold text-legal-ink mb-1">Aún no hay actuaciones</h3>
        <p className="text-sm">Registra la primera actuación para comenzar la línea de vida de este expediente.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-panel border border-legal-line overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-legal-line/50 text-xs uppercase text-gray-500 font-bold">
              <th className="p-4 w-32">Fecha</th>
              <th className="p-4 w-40">Tipo</th>
              <th className="p-4">Detalle de Actuación</th>
              <th className="p-4 w-48">Registrado por</th>
              <th className="p-4 w-24 text-center">Docs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-legal-line/30">
            {actuaciones.map((act) => (
              <tr key={act.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 align-top">
                  <div className="font-semibold text-legal-navy whitespace-nowrap">
                    {new Date(act.fecha_juridica).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </td>
                <td className="p-4 align-top">
                  <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded capitalize border border-gray-200 shadow-sm">
                    {act.tipo}
                  </span>
                </td>
                <td className="p-4 align-top">
                  <div className="font-bold text-legal-ink mb-1">{act.titulo}</div>
                  {act.descripcion && (
                    <div className="text-sm text-gray-600 line-clamp-2">{act.descripcion}</div>
                  )}
                </td>
                <td className="p-4 align-top text-sm text-gray-600">
                  {act.usuarios?.nombre_completo || 'Usuario'}
                </td>
                <td className="p-4 align-top text-center">
                  {act.documento_url ? (
                    <a 
                      href={act.documento_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-legal-blue hover:text-legal-gold flex flex-col items-center gap-1 transition-colors"
                      title="Ver documento adjunto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </a>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
