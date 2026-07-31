// src/app/dashboard/anotacoes/NoteCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building, Trash2, Pencil, Shield, Globe, StickyNote, Eye, EyeOff, Lock, Loader2, GripVertical } from 'lucide-react'
import { deleteNote, verifyUserPassword } from './actions'

export function NoteCard({ note, editId }: { note: any, editId?: string }) {
  // Agora ele verifica se a palavra "SENHA" existe dentro do nome da categoria
  const isPasswordCategory = note.category?.toUpperCase().includes('SENHA')

  const [isUnlocked, setIsUnlocked] = useState(!isPasswordCategory)
  const [isAskingPassword, setIsAskingPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // O ícone se adapta automaticamente ao texto da categoria
  const getCategoryIcon = (category: string) => {
    const cat = category?.toUpperCase() || ''
    if (cat.includes('SENHA')) return <Shield className="h-3.5 w-3.5 text-red-400" />
    if (cat.includes('REDE') || cat.includes('INFRA')) return <Globe className="h-3.5 w-3.5 text-blue-400" />
    return <StickyNote className="h-3.5 w-3.5 text-emerald-400" />
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const isValid = await verifyUserPassword(password)

    if (isValid) {
      setIsUnlocked(true)
      setIsAskingPassword(false)
      setPassword('')
    } else {
      setError('Senha incorreta.')
    }
    setLoading(false)
  }

  return (
    <div className={`relative flex flex-col rounded-lg border bg-gray-900 p-3 shadow-sm transition-all group ${editId === note.id ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-gray-800 hover:border-gray-700'
      }`}>

      {/* Ícone de Arrastar (Aparece no hover para o futuro Drag&Drop) */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 cursor-grab text-gray-600 opacity-0 transition-opacity hover:text-gray-400 group-hover:opacity-100">
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            {getCategoryIcon(note.category)}
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{note.category}</span>
          </div>
          <h3 className="mt-1 text-sm font-bold text-white leading-tight">{note.title}</h3>
        </div>

        <div className="flex items-center gap-0.5">
          {isPasswordCategory && isUnlocked && (
            <button onClick={() => setIsUnlocked(false)} title="Ocultar" className="rounded p-1 text-gray-500 hover:bg-gray-800 hover:text-gray-300">
              <EyeOff className="h-3.5 w-3.5" />
            </button>
          )}
          <Link href={`?edit=${note.id}`} className="rounded p-1 text-gray-500 hover:bg-indigo-900/30 hover:text-indigo-400">
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <form action={async () => { await deleteNote(note.id); }}>
            <button type="submit" className="rounded p-1 text-gray-500 hover:bg-red-900/30 hover:text-red-400">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {note.company_id ? (
        <div className="mb-2 flex items-center gap-1 text-[10px] text-indigo-300 bg-indigo-900/20 w-fit px-1.5 py-0.5 rounded border border-indigo-900/50">
          <Building className="h-3 w-3" />
          {note.companies?.name}
        </div>
      ) : (
        <div className="mb-2 flex items-center gap-1 text-[10px] text-gray-400 bg-gray-800 w-fit px-1.5 py-0.5 rounded">
          <Shield className="h-3 w-3" />
          Interno TI
        </div>
      )}

      {/* ÁREA DO CONTEÚDO MENOR */}
      <div className="flex-1 rounded bg-gray-950 p-2 border border-gray-800/50 relative overflow-hidden">
        {isUnlocked ? (
          <p className="whitespace-pre-wrap text-xs text-gray-300 font-mono leading-relaxed">{note.content}</p>
        ) : isAskingPassword ? (
          <form onSubmit={handleUnlock} className="flex flex-col gap-1.5">
            <div className="flex gap-1.5">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha..."
                autoFocus
                className="w-full rounded border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <button type="submit" disabled={loading} className="rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Ver'}
              </button>
            </div>
            {error && <span className="text-[10px] text-red-400">{error}</span>}
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Lock className="h-3 w-3" />
              <span className="text-xs font-mono tracking-widest">••••••••</span>
            </div>
            <button
              onClick={() => setIsAskingPassword(true)}
              className="flex items-center gap-1.5 rounded bg-gray-800 px-2 py-1 text-[10px] font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Eye className="h-3 w-3" />
              Ver
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-gray-500">
        <span>Por {note.profiles?.full_name?.split(' ')[0] || 'User'}</span>
        <span>{new Date(note.updated_at || note.created_at).toLocaleDateString('pt-BR')}</span>
      </div>
    </div>
  )
}