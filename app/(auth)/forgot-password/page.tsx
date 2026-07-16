import Link from 'next/link'
import { recoverPassword } from '../actions'

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { message?: string, success?: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/login"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver
      </Link>

      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={recoverPassword}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-legal-obsidian">Recuperar Contraseña</h1>
          <p className="text-sm text-legal-slate">Ingresa tu correo para recibir un enlace</p>
        </div>

        <label className="text-md" htmlFor="email">
          Correo Electrónico
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          type="email"
          placeholder="tu@correo.com"
          required
        />
        
        <button className="bg-legal-navy text-white rounded-md px-4 py-2 text-foreground mb-2 hover:bg-legal-royal transition-colors">
          Enviar Enlace
        </button>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-red-100 text-red-800 rounded-md text-center text-sm">
            {searchParams.message}
          </p>
        )}
        
        {searchParams?.success && (
          <p className="mt-4 p-4 bg-green-100 text-green-800 rounded-md text-center text-sm">
            {searchParams.success}
          </p>
        )}
      </form>
    </div>
  )
}
