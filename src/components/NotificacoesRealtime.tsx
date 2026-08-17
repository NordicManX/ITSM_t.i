// src/components/NotificacoesRealtime.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation' // <-- 1. Importação nova aqui

export function NotificacoesRealtime() {
  const router = useRouter() // <-- 2. Ativando o roteador do Next.js

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }

    const supabase = createClient()

    const channel = supabase
      .channel('novos-chamados')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tickets' },
        (payload) => {
          
          // 3. A MÁGICA DA ATUALIZAÇÃO VISUAL:
          // Isso faz o Next.js buscar os dados novos no banco e atualizar os cards sem dar "piscar" na tela!
          router.refresh() 

          const novoChamado = payload.new

          try {
            const audio = new Audio('/alerta.mp3')
            audio.play().catch((err) => console.log('Áudio bloqueado pelo navegador:', err)) 
          } catch (e) {}

          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🚨 Novo Chamado na Fila!', {
              body: `Serviço: ${novoChamado.title}\nVerifique o seu NordicDesk.`,
              icon: '/favicon.ico',
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

  return null 
}