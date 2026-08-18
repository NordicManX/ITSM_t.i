// src/components/NotificacoesRealtime.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

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

export function NotificacoesRealtime() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null;

    // --- 1. A FUNÇÃO QUE LIGA O REALTIME (VISUAL NA TELA) ---
    const ligarRealtime = () => {
      if (channel) return;
      
      channel = supabase
        .channel('novos-chamados')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'tickets' },
          (payload) => {
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        ligarRealtime()
      }
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        ligarRealtime()
      }
    })

    // --- 2. SERVIÇO DE NOTIFICAÇÃO PUSH (SEGUNDO PLANO / CELULAR) ---
    async function registrarServiceWorker() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn("⚠️ Este navegador não suporta Push Notifications.")
        return
      }

      try {
        console.log("📲 Registrando Service Worker...")
        const registration = await navigator.serviceWorker.register('/sw.js')
        await navigator.serviceWorker.ready

        const permission = await Notification.requestPermission()
        console.log("📢 Status da permissão de notificação:", permission)

        if (permission === 'granted') {
          let subscription = await registration.pushManager.getSubscription()
          
          if (!subscription) {
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            if (!vapidPublicKey) {
              console.error("❌ ERRO: NEXT_PUBLIC_VAPID_PUBLIC_KEY não está definida nas variáveis de ambiente!")
              return
            }

            console.log("🔑 Gerando nova inscrição Push...")
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            })
          }

          const subJson = subscription.toJSON()
          if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
            console.error("❌ ERRO: Dados da inscrição incompletos:", subJson)
            return
          }

          // Usamos UPSERT para atualizar se já existir ou inserir se for novo (evita erro 409/Unique constraint)
          console.log("💾 Salvando inscrição no Supabase...")
          const { error } = await supabase.from('push_subscriptions').upsert([
            {
              endpoint: subJson.endpoint,
              p256dh: subJson.keys.p256dh,
              auth: subJson.keys.auth
            }
          ], { onConflict: 'endpoint' })

          if (error) {
            console.error("❌ ERRO ao salvar no Supabase (Verifique as políticas RLS da tabela push_subscriptions):", error)
          } else {
            console.log("✅ SUCESSO! Aparelho registrado com sucesso na tabela push_subscriptions.")
          }
        } else {
          console.warn("⚠️ Permissão de notificação negada pelo usuário.")
        }
      } catch (error) {
        console.error("❌ ERRO CRÍTICO no Service Worker / Push:", error)
      }
    }

    registrarServiceWorker()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
      authListener.subscription.unsubscribe()
    }
  }, [router])

  return null 
}