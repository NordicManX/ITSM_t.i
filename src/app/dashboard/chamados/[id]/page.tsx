// src/app/dashboard/chamados/[id]/page.tsx
import { getTicketById, getTicketComments, updateTicketStatus, getTicketItems, addTicketItem, deleteTicketItem } from '../actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Building, Monitor, Wrench, RefreshCw, Trash2 } from 'lucide-react'
import { CommentForm } from './CommentForm'
import { ImagePreview } from './ImagePreview'
import { EditableRow } from './EditableRow'
import { EquipmentBadge } from './EquipmentBadge'

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

  // Buscas paralelas para ficar mais rápido
  const [comments, items] = await Promise.all([
    getTicketComments(ticket.id),
    getTicketItems(ticket.id)
  ])

  // Cálculos financeiros automáticos
  const totalServices = items
    .filter(i => i.type === 'SERVICE')
    .reduce((sum, item) => sum + (item.quantity * item.unit_value), 0)

  const totalProducts = items
    .filter(i => i.type === 'PRODUCT')
    .reduce((sum, item) => sum + (item.quantity * item.unit_value), 0)

  const grandTotal = totalServices + totalProducts

  const statusColors: Record<string, string> = {
    OPEN: 'bg-red-900/50 text-red-400 border-red-800',
    IN_PROGRESS: 'bg-blue-900/50 text-blue-400 border-blue-800',
    RESOLVED: 'bg-green-900/50 text-green-400 border-green-800',
  }
  
  const statusNames: Record<string, string> = {
    OPEN: 'Aberto', IN_PROGRESS: 'Em Andamento', RESOLVED: 'Concluído'
  }

  // Server Action inline para atualizar o status sem precisar de API Route
  async function handleUpdateStatus(formData: FormData) {
    'use server'
    const newStatus = formData.get('status') as string
    if (newStatus) {
      await updateTicketStatus(ticket.id, newStatus)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-gray-100 md:p-8">
      <Link href="/dashboard/chamados" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Voltar para o Quadro
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* ================= COLUNA ESQUERDA: Detalhes e Serviços ================= */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* 1. Informações da OS */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[ticket.status]}`}>
                {statusNames[ticket.status]}
              </span>
              <span className="text-sm text-gray-500">
                Criado em {new Date(ticket.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white md:text-3xl">OS #{ticket.id.split('-')[0].toUpperCase()} - {ticket.title}</h1>
            
            <div className="mt-6 flex flex-col gap-4 border-t border-gray-800 pt-6 md:flex-row md:gap-8">
              <div className="flex items-center gap-3 text-gray-300 bg-gray-950/50 p-3 rounded-lg border border-gray-800/50 flex-1">
                <Building className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Empresa Cliente</p>
                  <span className="font-medium">{ticket.companies?.name}</span>
                </div>
              </div>
              {ticket.equipments && (
  <EquipmentBadge equipment={ticket.equipments} />
)}
            </div>

            <div className="mt-6 rounded-lg bg-gray-950 p-4 border border-gray-800">
              <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">Descrição do Problema</h3>
              <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          {/* 2. Serviços e Peças (MÓDULO ATUALIZADO) */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Wrench className="h-5 w-5 text-indigo-400" />
                Serviços & Peças
              </h2>
              <span className="text-xs font-medium text-gray-500 bg-gray-950 px-3 py-1 rounded-full border border-gray-800">
                Cálculo Automático
              </span>
            </div>
            
            {/* Tabela de Itens */}
            {items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-800 bg-gray-950/50 p-8 text-center">
                <p className="text-sm text-gray-500">Nenhum serviço ou peça lançado nesta OS.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-950">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-gray-900 text-xs uppercase text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3 text-center">Qtd</th>
                      <th className="px-4 py-3 text-right">Unitário</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
  {items.map((item) => (
    <EditableRow 
      key={item.id} 
      item={item} 
      ticketId={ticket.id} 
    />
  ))}
</tbody>
                </table>
              </div>
            )}

            {/* Totais Gerais */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-gray-800 pt-6">
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 flex flex-col justify-center">
                <span className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Mão de Obra</span>
                <span className="text-lg font-bold text-blue-400">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalServices)}
                </span>
              </div>
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 flex flex-col justify-center">
                <span className="text-xs text-gray-500 block uppercase tracking-wider mb-1">Peças / Materiais</span>
                <span className="text-lg font-bold text-amber-400">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalProducts)}
                </span>
              </div>
              <div className="bg-indigo-950/30 p-4 rounded-lg border border-indigo-900/50 flex flex-col justify-center">
                <span className="text-xs text-indigo-400 block uppercase font-semibold tracking-wider mb-1">Valor Total</span>
                <span className="text-2xl font-black text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(grandTotal)}
                </span>
              </div>
            </div>

            {/* Formulário de Inserção */}
            <div className="mt-6 border-t border-gray-800 pt-6">
              <h3 className="text-sm font-semibold text-white mb-4">Lançar Novo Item</h3>
              <form action={addTicketItem} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input type="hidden" name="ticket_id" value={ticket.id} />
                
                <div className="sm:col-span-4">
                  <input 
                    type="text" 
                    name="description" 
                    placeholder="Descrição (ex: SSD 480GB, Formatação...)" 
                    required
                    className="w-full rounded-md bg-gray-950 border border-gray-700 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <select 
                    name="type" 
                    className="w-full rounded-md bg-gray-950 border border-gray-700 px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="SERVICE">Serviço</option>
                    <option value="PRODUCT">Peça</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <input 
                    type="number" 
                    name="quantity" 
                    defaultValue={1}
                    min={1}
                    placeholder="Qtd" 
                    required
                    className="w-full rounded-md bg-gray-950 border border-gray-700 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <input 
                    type="number" 
                    name="unit_value" 
                    step="0.01" 
                    min="0"
                    placeholder="R$ Unitário" 
                    required
                    className="w-full rounded-md bg-gray-950 border border-gray-700 px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button 
                    type="submit"
                    className="w-full h-full min-h-[42px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    + Lançar
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* ================= COLUNA DIREITA: Status, Linha do Tempo e Comentários ================= */}
        <div className="flex flex-col gap-6">
          
          {/* 3. Bloco de Alterar Status */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <RefreshCw className="h-5 w-5 text-gray-400" />
              Situação da OS
            </h3>
            
            <form action={handleUpdateStatus} className="flex flex-col gap-3">
              <select 
                name="status" 
                defaultValue={ticket.status}
                disabled={ticket.status === 'RESOLVED'}
                className="w-full rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
              >
                <option value="OPEN">Aberto (Aguardando)</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="RESOLVED">Concluído</option>
              </select>
              
              <button 
                type="submit" 
                disabled={ticket.status === 'RESOLVED'}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {ticket.status === 'RESOLVED' ? 'OS Bloqueada' : 'Atualizar Situação'}
              </button>
            </form>
          </div>

          {/* 4. Histórico do Atendimento */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm flex-1 flex flex-col">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <Clock className="h-5 w-5 text-blue-400" />
              Histórico
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
                       <div className="rounded-lg bg-gray-800 p-3 text-sm text-gray-200 shadow-sm border border-gray-700">
                          <p className="whitespace-pre-wrap">{comment.content}</p>
                          
                          {/* Renderiza Anexos se existirem */}
                          {comment.file_url && (
                            <div className="mt-2">
                              {comment.file_type?.startsWith('image/') ? (
                                <ImagePreview src={comment.file_url} alt={comment.file_name || 'Evidência anexada'} />
                              ) : comment.file_type?.startsWith('video/') ? (
                                <video src={comment.file_url} controls className="mt-3 max-h-64 w-full rounded-md border border-gray-700 bg-gray-900 object-contain" />
                              ) : (
                                <a href={comment.file_url} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-md border border-gray-700 bg-gray-900 p-3 text-blue-400 hover:underline">
                                  📎 Ver arquivo anexado ({comment.file_name})
                                </a>
                              )}
                            </div>
                          )}
                        </div> 
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulário de Novo Comentário */}
            <div className="border-t border-gray-800 pt-4 mt-6">
              <CommentForm ticketId={ticket.id} />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}