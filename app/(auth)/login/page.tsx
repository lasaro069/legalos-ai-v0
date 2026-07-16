import { login } from '../actions'
import Link from 'next/link'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-legal-surface p-4">
      <div className="w-full max-w-md bg-legal-paper shadow-soft rounded-2xl p-8 border border-legal-line">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-legal-ink mb-2">Bienvenido</h1>
          <p className="text-legal-navy/70">Inicia sesión en LegalOS para acceder a tu firma.</p>
        </div>

        <form action={login} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-legal-ink mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-legal-line rounded-lg focus:ring-2 focus:ring-legal-blue focus:border-legal-blue bg-white text-legal-ink outline-none transition-all"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-legal-ink mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-legal-line rounded-lg focus:ring-2 focus:ring-legal-blue focus:border-legal-blue bg-white text-legal-ink outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {searchParams?.message && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {searchParams.message}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-legal-blue hover:bg-legal-royal text-white font-medium rounded-lg shadow-sm transition-colors focus:ring-4 focus:ring-legal-blue/30"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-legal-navy/80">
          ¿Olvidaste tu contraseña?{' '}
          <Link href="/forgot-password" className="text-legal-blue font-semibold hover:underline">
            Recuperar Contraseña
          </Link>
        </div>
      </div>
    </div>
  )
}
