// src/app/suporte/[id]/Formulario.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle2, Loader2, Send } from 'lucide-react'

type Categoria = {
  id: string
  nome: string
  descricao: string
}

export function FormularioCliente({ 
  empresaId, 
  empresaNome, 
  categorias 
}: { 
  empresaId: string
  empresaNome: string
  categorias: Categoria[] 
}) {
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const nomeSolicitante = formData.get('solicitante') as string
    const servico = formData.get('servico') as string
    const descricao = formData.get('descricao') as string

    const corpoDoChamado = `Solicitante: ${nomeSolicitante}\n\nDetalhes: ${descricao || 'Nenhum detalhe adicional informado.'}`

    const { error } = await supabase.from('tickets').insert([
      {
        title: servico,
        status: 'OPEN', 
        priority: 'NORMAL',
        company_id: empresaId, 
        description: corpoDoChamado
      }
    ])

    setLoading(false)

    if (!error) {
      setSucesso(true)
      console.log('✅ Chamado salvo no banco! O Supabase cuidará da notificação.')
    } else {
      alert("Ocorreu um erro ao enviar. Tente novamente.")
      console.error("ERRO DO SUPABASE:", error) 
    }
  }

  if (sucesso) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Chamado Aberto!</h2>
        <p className="text-gray-400 text-sm">
          A equipe de T.I. já foi notificada e entrará em contato em breve.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 text-sm text-blue-500 hover:underline"
        >
          Abrir outro chamado
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Seu Nome</label>
        <input 
          type="text" 
          name="solicitante" 
          required
          placeholder="Quem está solicitando?"
          className="w-full rounded-md border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Do que você precisa?</label>
        <select 
          name="servico" 
          required
          className="w-full rounded-md border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">Selecione um serviço...</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.nome}>{cat.nome}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Detalhes (Opcional)</label>
        <textarea 
          name="descricao" 
          rows={3}
          placeholder="Explique um pouco mais sobre o problema..."
          className="w-full resize-none rounded-md border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? 'Enviando...' : 'Abrir Chamado'}
      </button>
    </form>
  )
}