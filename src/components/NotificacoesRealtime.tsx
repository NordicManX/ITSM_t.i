// src/components/NotificacoesRealtime.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function NotificacoesRealtime() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    // Variável para guardar o túnel de conexão
    let channel: ReturnType<typeof supabase.channel> | null = null;

    // --- 1. A FUNÇÃO QUE LIGA O REALTIME (SÓ RODA SE TIVER CRACHÁ) ---
    const ligarRealtime = () => {
      if (channel) return; // Evita conectar duas vezes
      
      console.log("🔌 Crachá validado! Conectando túnel seguro do Realtime...")
      
      channel = supabase
        .channel('novos-chamados')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'tickets' },
          (payload) => {
            console.log("🔥 TICKET NOVO RECEBIDO COM SEGURANÇA:", payload)
            const novoChamado = payload.new
            
            router.refresh() 
            
            toast(`Novo chamado: ${novoChamado.title || 'Verifique a lista'}`, {
              icon: '🚨',
              duration: 6000,
            })

            try {
              const audio = new Audio('/alerta.mp3')
              audio.play().catch(() => {}) 
            } catch (e) {}
          }
        )
        .subscribe()
    }

    // --- 2. ESPERA A VALIDAÇÃO DO LOGIN ---
    // Checa se o usuário já está logado ao carregar a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        ligarRealtime()
      } else {
        console.log("⏳ Aguardando autenticação para conectar...")
      }
    })

    // Fica de plantão: se o login ocorrer depois, ele liga o túnel
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        ligarRealtime()
      }
    })

    // --- 3. SERVIÇO DE NOTIFICAÇÃO NO CELULAR/WINDOWS ---
    async function registrarServiceWorker() {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          const permission = await Notification.requestPermission()
          
          if (permission === 'granted') {
            let subscription = await registration.pushManager.getSubscription()
            
            if (!subscription) {
              const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
              if (!vapidPublicKey) return

              subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
              })

              const subJson = subscription.toJSON()
              await supabase.from('push_subscriptions').insert([{
                endpoint: subJson.endpoint,
                p256dh: subJson.keys?.p256dh,
                auth: subJson.keys?.auth
              }])
            }
          }
        } catch (error) {
          console.error("Erro no Service Worker:", error)
        }
      }
    }

    registrarServiceWorker()

    // --- 4. LIMPEZA AO SAIR ---
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
      authListener.subscription.unsubscribe()
    }
  }, [router])

  return null 
}