// src/components/BotaoWhatsApp.tsx
'use client'

import { MessageCircle } from 'lucide-react'

type Props = {
  empresaId: string
  nomeEmpresa: string
  telefoneContato?: string 
}

export function BotaoWhatsApp({ empresaId, nomeEmpresa, telefoneContato }: Props) {
  
  const abrirWhatsApp = () => {
    const baseUrl = window.location.origin
    const linkPortal = `${baseUrl}/suporte/${empresaId}`
    
    // Limpamos os espaços extras do nome da empresa para o negrito funcionar
    const nomeLimpo = nomeEmpresa.trim()
    
    // Removemos os emojis problemáticos para garantir a formatação da URL
    const mensagem = `Olá, pessoal da *${nomeLimpo}*!\n\nPara agilizar nosso atendimento, criamos um portal de suporte exclusivo da NordicDesk para vocês.\n\nSempre que precisarem do T.I., basta acessar o link abaixo e abrir um chamado direto com a gente:\n\n${linkPortal}\n\n*Dica:* Salvem este link nos favoritos do navegador!`
    
    const numeroLimpo = telefoneContato ? telefoneContato.replace(/\D/g, '') : ''
    
    const zapUrl = numeroLimpo 
      ? `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`
      : `https://wa.me/?text=${encodeURIComponent(mensagem)}`

    window.open(zapUrl, '_blank')
  }

  return (
    <button 
      onClick={abrirWhatsApp}
      title="Enviar portal pelo WhatsApp"
      className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#1DA851]"
    >
      <MessageCircle size={16} />
      Enviar Portal
    </button>
  )
}