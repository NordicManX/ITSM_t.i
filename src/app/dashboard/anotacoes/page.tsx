// src/app/dashboard/anotacoes/page.tsx
import { getNotes } from './actions'
import { getCompanies } from '../empresas/actions'
import { NoteForm } from './NoteForm'
import { NoteCard } from './NoteCard'
import { StickyNote } from 'lucide-react'

export default async function AnotacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const resolvedParams = await searchParams
  const editId = resolvedParams?.edit

  const [notes, companies] = await Promise.all([
    getNotes(),
    getCompanies()
  ])

  const noteToEdit = editId ? notes.find(n => n.id === editId) : undefined

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-gray-100 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Cofre de Anotações</h1>
        <p className="mt-2 text-sm text-gray-400 md:text-base">Guarde senhas, IPs, credenciais e informações sensíveis de forma segura.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Formulário */}
        <div className="lg:col-span-1">
          <NoteForm noteToEdit={noteToEdit} companies={companies} />
        </div>

        {/* Lista de Anotações */}
        <div className="lg:col-span-2">
          {notes.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
              <StickyNote className="mb-3 h-8 w-8 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-300">Nenhuma anotação encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">Crie a sua primeira anotação utilizando o formulário ao lado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} editId={editId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}