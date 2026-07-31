// src/app/dashboard/anotacoes/NoteForm.tsx
'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createNote, updateNote } from './actions'

// Recebemos os dados como "props" da página principal
export function NoteForm({ noteToEdit, companies }: { noteToEdit?: any, companies: any[] }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  // Essa função intercepta o botão de salvar/atualizar
  async function handleFormAction(formData: FormData) {
    if (noteToEdit) {
      await updateNote(formData)
      router.push('/dashboard/anotacoes') // Limpa o "?edit=" da URL na marra
    } else {
      await createNote(formData)
      formRef.current?.reset() // Esvazia os campos após criar uma nova
    }
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-white">
        {noteToEdit ? 'Editar Anotação' : 'Nova Anotação'}
      </h2>
      
      <form ref={formRef} action={handleFormAction} className="flex flex-col gap-4">
        {noteToEdit && <input type="hidden" name="id" value={noteToEdit.id} />}

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Título</label>
          <input 
            type="text" 
            name="title" 
            required 
            defaultValue={noteToEdit?.title || ''}
            placeholder="Ex: Credenciais Roteador Wi-Fi"
            className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Categoria</label>
          <select 
            name="category" 
            defaultValue={noteToEdit?.category || 'GERAL'}
            className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="GERAL">Geral</option>
            <option value="SENHAS">Senhas & Credenciais</option>
            <option value="REDE">Infraestrutura & Rede</option>
            <option value="SISTEMAS">Sistemas & Licenças</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Vincular a um Cliente (Opcional)</label>
          <select 
            name="company_id"
            defaultValue={noteToEdit?.company_id || ''} 
            className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Anotação Interna (Visível apenas para TI)</option>
            {companies?.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-400">Conteúdo</label>
          <textarea 
            name="content" 
            required 
            rows={6}
            defaultValue={noteToEdit?.content || ''}
            placeholder="IP: 192.168...&#10;User: admin&#10;Pass: ******"
            className="w-full resize-none rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          ></textarea>
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <button 
            type="submit" 
            className="flex-1 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            {noteToEdit ? 'Atualizar Informação' : 'Salvar Informação'}
          </button>
          
          {noteToEdit && (
            <Link 
              href="/dashboard/anotacoes"
              className="flex items-center justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
            >
              Cancelar
            </Link>
          )}
        </div>
      </form>
    </div>
  )
}