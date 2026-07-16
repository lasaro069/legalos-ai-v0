'use client'

import { COLOMBIA_DATA } from '@/lib/colombia-data'

export function LocationSelector({
  pais, setPais,
  departamento, setDepartamento,
  ciudad, setCiudad,
  inputStyle
}: {
  pais: string, setPais: (v: string) => void,
  departamento: string, setDepartamento: (v: string) => void,
  ciudad: string, setCiudad: (v: string) => void,
  inputStyle: string
}) {
  const isColombia = pais.trim().toLowerCase() === 'colombia'
  const departamentos = Object.keys(COLOMBIA_DATA).sort()
  const ciudades = isColombia && COLOMBIA_DATA[departamento] ? [...COLOMBIA_DATA[departamento]].sort() : []

  const isCustomDep = isColombia && departamento !== '' && !departamentos.includes(departamento)
  const isCustomCiudad = isColombia && ciudad !== '' && departamentos.includes(departamento) && !ciudades.includes(ciudad)

  return (
    <>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">País</label>
        <input type="text" className={inputStyle} value={pais} onChange={(e) => {
          setPais(e.target.value)
          if (e.target.value.trim().toLowerCase() !== 'colombia') {
            setDepartamento('')
            setCiudad('')
          }
        }} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Departamento / Estado</label>
        {isColombia && !isCustomDep ? (
          <select 
            className={inputStyle} 
            value={departamento} 
            onChange={(e) => {
              if (e.target.value === 'Otro') {
                setDepartamento(' ') 
              } else {
                setDepartamento(e.target.value)
              }
              setCiudad('')
            }}
          >
            <option value="">Selecciona un departamento...</option>
            {departamentos.map(d => <option key={d} value={d}>{d}</option>)}
            <option value="Otro">Otro...</option>
          </select>
        ) : (
          <div className="flex flex-col">
             <input type="text" autoFocus placeholder="Escribe tu departamento" className={inputStyle} value={departamento.trimStart()} onChange={(e) => setDepartamento(e.target.value)} />
             {isColombia && (
               <button type="button" onClick={() => { setDepartamento(''); setCiudad(''); }} className="text-xs text-blue-600 mt-1 text-left">Volver a la lista</button>
             )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Ciudad</label>
        {isColombia && departamentos.includes(departamento) && !isCustomCiudad ? (
          <select 
            className={inputStyle} 
            value={ciudad} 
            onChange={(e) => {
              if (e.target.value === 'Otra') {
                setCiudad(' ')
              } else {
                setCiudad(e.target.value)
              }
            }}
          >
            <option value="">Selecciona una ciudad...</option>
            {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="Otra">Otra...</option>
          </select>
        ) : (
          <div className="flex flex-col">
            <input type="text" autoFocus={isCustomCiudad} placeholder="Escribe tu ciudad" className={inputStyle} value={ciudad.trimStart()} onChange={(e) => setCiudad(e.target.value)} />
            {isColombia && departamentos.includes(departamento) && (
               <button type="button" onClick={() => setCiudad('')} className="text-xs text-blue-600 mt-1 text-left">Volver a la lista</button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
