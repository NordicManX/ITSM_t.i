// src/components/Sidebar.tsx
import Link from 'next/link'
import { logout } from '@/app/actions' // Importando nossa Server Action

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-800 bg-gray-950">
      {/* Cabeçalho da Sidebar */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">NordicDesk TI</h2>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 space-y-2 p-4">
        <Link 
          href="/dashboard" 
          className="block rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        >
          Painel de Controle
        </Link>
        <Link 
          href="/dashboard/empresas" 
          className="block rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        >
          Empresas
        </Link>
        <Link 
          href="/dashboard/equipamentos" 
          className="block rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        >
          Equipamentos
        </Link>
        <Link 
          href="/dashboard/chamados" 
          className="block rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        >
          Chamados
        </Link>
      </nav>

      {/* Rodapé da Sidebar (Logout Funcional) */}
      <div className="border-t border-gray-800 p-4">
        {/* Usamos um form com a action apontando para nossa função */}
        <form action={logout}>
          <button 
            type="submit"
            className="w-full rounded-md bg-red-900/20 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/40 hover:text-red-300"
          >
            Sair do Sistema
          </button>
        </form>
      </div>
    </aside>
  )
}