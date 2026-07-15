export default async function DashboardPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-legal-ink mb-6">Bandeja del Día</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta de Resumen */}
        <div className="bg-white p-6 rounded-xl shadow-panel border border-legal-line">
          <h3 className="font-semibold text-legal-navy mb-2">Expedientes Activos</h3>
          <p className="text-4xl font-bold text-legal-blue">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-panel border border-legal-line">
          <h3 className="font-semibold text-legal-navy mb-2">Términos Próximos</h3>
          <p className="text-4xl font-bold text-legal-gold">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-panel border border-legal-line">
          <h3 className="font-semibold text-legal-navy mb-2">Audiencias Pendientes</h3>
          <p className="text-4xl font-bold text-legal-cyan">0</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-panel border border-legal-line p-8 text-center text-legal-navy/60">
        <p>Tu entorno multi-tenant está funcionando correctamente.</p>
        <p className="text-sm mt-2">Siguiente paso: Módulo de Expedientes en construcción.</p>
      </div>
    </>
  )
}
