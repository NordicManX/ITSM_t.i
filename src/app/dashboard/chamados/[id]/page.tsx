// src/app/dashboard/chamados/[id]/page.tsx
import { getTicketById, getTicketComments } from '../actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Building, Monitor } from 'lucide-react'
import { CommentForm } from './CommentForm'

export default async function DetalhesChamadoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const ticket = await getTicketById(resolvedParams.id)

  if (!ticket) {
    notFound() // Mostra página de erro 404 se não achar o chamado
  }

  const comments = await getTicketComments(ticket.id)

  const statusColors: Record<string, string> = {
    OPEN: 'bg-red-900/50 text-red-400 border-red-800',
    IN_PROGRESS: 'bg-blue-900/50 text-blue-400 border-blue-800',
    RESOLVED: 'bg-green-900/50 text-green-400 border-green-800',
  }
  const statusNames: Record<string, string> = {
    OPEN: 'Aberto', IN_PROGRESS: 'Em Andamento', RESOLVED: 'Concluído'
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-gray-100 md:p-8">
      <Link href="/dashboard/chamados" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Voltar para o Quadro
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* COLUNA ESQUERDA: Detalhes do Chamado */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[ticket.status]}`}>
                {statusNames[ticket.status]}
              </span>
              <span className="text-sm text-gray-500">
                Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white md:text-3xl">{ticket.title}</h1>
            
            <div className="mt-6 flex flex-col gap-4 border-t border-gray-800 pt-6 md:flex-row md:gap-8">
              <div className="flex items-center gap-2 text-gray-300">
                <Building className="h-5 w-5 text-gray-500" />
                <span className="font-medium">{ticket.companies?.name}</span>
              </div>
              {ticket.equipments && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Monitor className="h-5 w-5 text-gray-500" />
                  <span>{ticket.equipments.identification_number} ({ticket.equipments.type === 'SERVER' ? 'Servidor' : 'Terminal'})</span>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-lg bg-gray-950 p-4 border border-gray-800">
              <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">Descrição Original</h3>
              <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{ticket.description}</p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: Linha do Tempo e Comentários */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm h-full flex flex-col">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <Clock className="h-5 w-5 text-blue-400" />
              Histórico do Atendimento
            </h3>

            {/* Lista de Comentários */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {comments.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-8">Nenhum registro no histórico ainda.</p>
              ) : (
                <div className="relative border-l border-gray-800 ml-3 pl-5 space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="relative">
                      {/* Bolinha da timeline */}
                      <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-gray-900 bg-blue-500" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 mb-1">
                          {new Date(comment.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="rounded-lg bg-gray-800 p-3 text-sm text-gray-200">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulário de Novo Comentário */}
            <div className="border-t border-gray-800 pt-2 mt-4">
              <CommentForm ticketId={ticket.id} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}