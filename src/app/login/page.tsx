'use client';

import { useActionState } from 'react'; // Ahora desde 'react'
import { authenticate, AuthState } from '@/app/lib/user-actions';

export default function LoginPage() {
  const initialState: AuthState = {};

  // isPending reemplaza la necesidad de useFormStatus para el botón simple
  const [state, formAction, isPending] = useActionState(
    authenticate,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>

        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full border p-2 rounded-md"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              required
              className="w-full border p-2 rounded-md"
            />
          </div>

          {state?.error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}