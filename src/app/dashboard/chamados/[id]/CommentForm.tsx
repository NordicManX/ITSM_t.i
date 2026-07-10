// src/app/dashboard/chamados/[id]/CommentForm.tsx
'use client'

import { useRef, useState } from 'react'
import { addTicketComment } from '../actions'
import { Send } from 'lucide-react'

export function CommentForm({ ticketId }: { ticketId: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    await addTicketComment(ticketId, formData)
    formRef.current?.reset() // Limpa o campo após enviar
    setIsSubmitting(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-6 flex flex-col gap-3">
      <label htmlFor="content" className="text-sm font-medium text-gray-300">
        Adicionar nova atualização ao histórico
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          id="content"
          name="content"
          required
          placeholder="Ex: Realizada troca do cabo de rede..."
          className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : <><Send className="h-4 w-4" /> Enviar</>}
        </button>
      </div>
    </form>
  )
}