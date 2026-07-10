// src/app/dashboard/chamados/[id]/CommentForm.tsx
'use client'

import { useRef, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { addTicketComment } from '../actions'
import { Send, Paperclip, X } from 'lucide-react'

export function CommentForm({ ticketId }: { ticketId: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    
    if (file) {
      // Bloqueia vídeos maiores que 5MB para não travar a Vercel
      if (file.type.startsWith('video/') && file.size > 5 * 1024 * 1024) {
        setError('Vídeos devem ter no máximo 5MB. Para vídeos maiores, use um link do YouTube.')
        e.target.value = ''
        setSelectedFile(null)
        return
      }
      setSelectedFile(file)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      let finalFile = selectedFile

      // Se for imagem, comprime brutalmente mantendo a qualidade!
      if (finalFile && finalFile.type.startsWith('image/')) {
        const options = {
          maxSizeMB: 1, // Tamanho máximo de 1MB
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        }
        finalFile = await imageCompression(finalFile, options)
      }

      // Substitui o arquivo no FormData pelo arquivo comprimido
      if (finalFile) {
        formData.set('file', finalFile)
      } else {
        formData.delete('file')
      }

      await addTicketComment(ticketId, formData)
      
      // Limpa os estados
      formRef.current?.reset()
      setSelectedFile(null)
    } catch (err) {
      console.error(err)
      setError('Ocorreu um erro ao processar o arquivo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-6 flex flex-col gap-3">
      <label htmlFor="content" className="text-sm font-medium text-gray-300">
        Adicionar nova atualização ao histórico
      </label>
      
      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex flex-col gap-2">
        <textarea
          id="content"
          name="content"
          required
          rows={2}
          placeholder="Descreva a atualização ou a evidência em anexo..."
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Input de arquivo invisível e botão estático para acionar ele */}
            <input
              type="file"
              id="file"
              accept="image/*,video/mp4"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file"
              className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
            >
              <Paperclip className="h-4 w-4" /> Anexar
            </label>
            
            {/* Mostra o nome do arquivo selecionado */}
            {selectedFile && (
              <span className="flex items-center gap-2 text-xs text-blue-400">
                {selectedFile.name.substring(0, 20)}...
                <button type="button" onClick={() => setSelectedFile(null)} className="text-gray-500 hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Enviando...' : <><Send className="h-4 w-4" /> Enviar</>}
          </button>
        </div>
      </div>
    </form>
  )
}