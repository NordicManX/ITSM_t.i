// src/app/login/page.tsx
import { login } from '@/app/login/actions';
import Image from 'next/image'; // Importação do componente Image

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error: string }
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-xl">
        
        {/* Bloco da Logo e Título */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Image 
            src="/Logo.png" 
            alt="Logo Nordic Tech" 
            width={80} 
            height={80} 
            className="mb-4 object-contain brightness-0 invert"
          />
          <h1 className="text-3xl font-bold text-white">NordicDesk TI</h1>
          <p className="mt-2 text-sm text-gray-400">
            Acesse o painel de controle
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="email">
              E-mail corporativo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="voce@empresa.com.br"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {searchParams?.error && (
            <div className="rounded-md bg-red-900/50 p-3 text-sm text-red-400 border border-red-800">
              {searchParams.error}
            </div>
          )}

          <button
            formAction={login}
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  )
}