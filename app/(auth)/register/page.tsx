import { signup } from '../actions'
import Link from 'next/link'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-legal-surface p-4">
      <div className="w-full max-w-lg bg-legal-paper shadow-soft rounded-2xl p-8 border border-legal-line">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-legal-ink mb-2">Crea tu Firma</h1>
          <p className="text-legal-navy/70">Regístrate en LegalOS y comienza a gestionar tus expedientes de forma segura.</p>
        </div>

        <form action={signup} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-legal-ink mb-1" htmlFor="nombre_completo">
                Nombre Completo
              </label>
              <input
                id="nombre_completo"
                name="nombre_completo"
                type="text"
                required
                className="w-full px-4 py-2 border border-legal-line rounded-lg focus:ring-2 focus:ring-legal-blue focus:border-legal-blue bg-white text-legal-ink outline-none transition-all"
                placeholder="Dr. Juan Pérez"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-legal-ink mb-1" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-legal-line rounded-lg focus:ring-2 focus:ring-legal-blue focus:border-legal-blue bg-white text-legal-ink outline-none transition-all"
                placeholder="juan@firma.com"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-legal-ink mb-1" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-legal-line rounded-lg focus:ring-2 focus:ring-legal-blue focus:border-legal-blue bg-white text-legal-ink outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-legal-ink mb-1" htmlFor="nombre_firma">
                Nombre de tu Firma
              </label>
              <input
                id="nombre_firma"
                name="nombre_firma"
                type="text"
                required
                className="w-full px-4 py-2 border border-legal-line rounded-lg focus:ring-2 focus:ring-legal-blue focus:border-legal-blue bg-white text-legal-ink outline-none transition-all"
                placeholder="Pérez & Asociados"
              />
              <p className="text-xs text-legal-navy/60 mt-1">Este será el espacio aislado donde trabajarás con tu equipo.</p>
            </div>
          </div>

          {searchParams?.message && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {searchParams.message}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-legal-blue hover:bg-legal-royal text-white font-medium rounded-lg shadow-sm transition-colors focus:ring-4 focus:ring-legal-blue/30 mt-4"
          >
            Registrarse y Crear Firma
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-legal-navy/80">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-legal-blue font-semibold hover:underline">
            Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
