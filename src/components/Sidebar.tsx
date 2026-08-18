// src/components/Sidebar.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { logout } from '@/app/actions'
import { createClient } from '@/utils/supabase/client'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, Building2, Server, Ticket, LogOut, Menu, X, StickyNote, Layers, Bell
} from 'lucide-react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [loadingPush, setLoadingPush] = useState(false)
  const pathname = usePathname()

  // EFEITO MÁGICO: Toda vez que a rota (URL) mudar, fecha o menu automaticamente no mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const closeSidebar = () => setIsOpen(false)

  // Função para ativar as notificações Push direto do botão
  async function ativarNotificacoesPush() {
    setLoadingPush(true)
    const supabase = createClient()

    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        toast.error('Este navegador não suporta notificações em segundo plano.')
        setLoadingPush(false)
        return
      }

      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      const permission = await Notification.requestPermission()
      
      if (permission !== 'granted') {
        toast.error('Permissão de notificação negada nas configurações do navegador.')
        setLoadingPush(false)
        return
      }

      let subscription = await registration.pushManager.getSubscription()
      
      if (!subscription) {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) {
          toast.error('Chave VAPID pública não configurada.')
          setLoadingPush(false)
          return
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        })
      }

      const subJson = subscription.toJSON()

      const { error } = await supabase.from('push_subscriptions').upsert([
        {
          endpoint: subJson.endpoint,
          p256dh: subJson.keys?.p256dh,
          auth: subJson.keys?.auth,
        }
      ], { onConflict: 'endpoint' })

      if (error) {
        console.error('Erro ao salvar no Supabase:', error)
        toast.error('Erro ao registrar aparelho no banco.')
      } else {
        toast.success('🔔 Notificações ativadas com sucesso neste aparelho!')
      }
    } catch (err) {
      console.error('Erro ao ativar push:', err)
      toast.error('Falha ao ativar notificações.')
    } finally {
      setLoadingPush(false)
    }
  }

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

      {/* Overlay escuro para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Principal */}
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

          <Link
            href="/dashboard/categorias"
            className="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <Layers className="h-5 w-5 text-blue-500" strokeWidth={2} />
            Catálogo de Serviços
          </Link>
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="space-y-2 border-t border-gray-800 p-4">
          {/* Botão para ativar notificações explicitamente */}
          <button
            onClick={ativarNotificacoesPush}
            disabled={loadingPush}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-600/40 hover:text-blue-300 disabled:opacity-50"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            {loadingPush ? 'Ativando...' : 'Ativar Notificações'}
          </button>

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