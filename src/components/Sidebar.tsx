// src/components/Sidebar.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { logout } from '@/app/actions'
import {
  LayoutDashboard, Building2, Server, Ticket, LogOut, Menu, X, StickyNote
} from 'lucide-react'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // EFEITO MÁGICO: Toda vez que a rota (URL) mudar, fecha o menu automaticamente
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Função manual para fechar o menu ao clicar no X ou no fundo escuro
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Header Mobile (Visível apenas em telas pequenas) */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-950 px-4 md:hidden">
        <h2 className="text-xl font-bold text-white">NordicDesk TI</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <Menu className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>

      {/* Overlay escuro para mobile (Fecha o menu ao clicar fora dele) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Principal (Off-canvas no mobile, fixa no desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-800 bg-gray-950 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabeçalho da Sidebar */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4 md:justify-center">
          <h2 className="text-xl font-bold text-white">NordicDesk TI</h2>
          <button
            onClick={closeSidebar}
            className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white md:hidden"
          >
            <X className="h-6 w-6" strokeWidth={2} />
          </button>
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 space-y-2 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <LayoutDashboard className="h-5 w-5 text-blue-500" strokeWidth={2} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/empresas"
            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <Building2 className="h-5 w-5 text-blue-500" strokeWidth={2} />
            Empresas
          </Link>

          <Link
            href="/dashboard/equipamentos"
            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <Server className="h-5 w-5 text-blue-500" strokeWidth={2} />
            Equipamentos
          </Link>

          <Link
            href="/dashboard/chamados"
            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <Ticket className="h-5 w-5 text-blue-500" strokeWidth={2} />
            Chamados
          </Link>

          <Link
            href="/dashboard/anotacoes"
            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <StickyNote className="h-5 w-5 text-blue-500" strokeWidth={2} />
            Anotações
          </Link>
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="border-t border-gray-800 p-4">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-md bg-red-900/20 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/40 hover:text-red-300"
            >
              <LogOut className="h-5 w-5" strokeWidth={2} />
              Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}