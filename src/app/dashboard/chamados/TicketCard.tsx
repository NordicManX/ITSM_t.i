// src/app/dashboard/chamados/TicketCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateTicketStatus, deleteTicket } from './actions'
import { CheckCircle2, Trash2, ArrowRight, AlertTriangle, Pencil } from 'lucide-react'

const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-800 text-gray-300',
  MEDIUM: 'bg-blue-900/50 text-blue-400',
  HIGH: 'bg-orange-900/50 text-orange-400',
  URGENT: 'bg-red-900/50 text-red-400 border border-red-800',
}

const priorityNames: Record<string, string> = {
  LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta', URGENT: 'Urgente'
}

export function TicketCard({ ticket }: { ticket: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteTicket(ticket.id)
    setIsModalOpen(false)
    setIsDeleting(false)
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm transition-all hover:border-gray-500">
        <div className="flex items-start justify-between">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColors[ticket.priority]}`}>
            {priorityNames[ticket.priority]}
          </span>
          <div className="flex items-center gap-3">
            {/* NOVO: Botão de Editar */}
            <Link 
              href={`/dashboard/chamados?edit=${ticket.id}`} 
              title="Editar Chamado" 
              className="text-gray-500 transition-colors hover:text-blue-400"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            {/* Botão de Excluir */}
            <button 
              onClick={() => setIsModalOpen(true)} 
              title="Excluir Chamado" 
              className="text-gray-500 transition-colors hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white">{ticket.title}</h4>
          <p className="mt-1 text-xs text-gray-400 line-clamp-2">{ticket.description}</p>
        </div>

        <div className="border-t border-gray-700 pt-3">
          <span className="block text-xs font-medium text-gray-300">{ticket.companies?.name}</span>
          {ticket.equipments && (
            <span className="block text-xs text-gray-500">Eqp: {ticket.equipments.identification_number}</span>
          )}
        </div>

        <div className="mt-2 flex gap-2">
          {ticket.status === 'OPEN' && (
            <button onClick={() => updateTicketStatus(ticket.id, 'IN_PROGRESS')} className="flex w-full items-center justify-center gap-1 rounded bg-blue-600/20 py-1.5 text-xs font-semibold text-blue-400 transition-colors hover:bg-blue-600/40">
              Iniciar Atendimento <ArrowRight className="h-3 w-3" />
            </button>
          )}
          {ticket.status === 'IN_PROGRESS' && (
            <button onClick={() => updateTicketStatus(ticket.id, 'RESOLVED')} className="flex w-full items-center justify-center gap-1 rounded bg-green-600/20 py-1.5 text-xs font-semibold text-green-400 transition-colors hover:bg-green-600/40">
              Concluir <CheckCircle2 className="h-3 w-3" />
            </button>
          )}
          {ticket.status === 'RESOLVED' && (
            <button onClick={() => updateTicketStatus(ticket.id, 'IN_PROGRESS')} className="flex w-full items-center justify-center gap-1 rounded bg-gray-700 py-1.5 text-xs font-semibold text-gray-400 transition-colors hover:bg-gray-600">
              Reabrir Chamado
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md transform rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl transition-all">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Excluir Chamado</h3>
                <p className="text-sm text-gray-400">Esta ação não pode ser desfeita. O chamado será removido permanentemente do Kanban.</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} disabled={isDeleting} className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white">
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={isDeleting} className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50">
                {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}