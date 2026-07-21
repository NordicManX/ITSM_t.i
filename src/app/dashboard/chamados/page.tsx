// src/app/dashboard/chamados/page.tsx
import Link from 'next/link'
import { getTickets } from './actions'
import { getCompanies } from '../empresas/actions'
import { getEquipments } from '../equipamentos/actions'
import { TicketForm } from './TicketForm'
import { TicketCard } from './TicketCard'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'

export default async function ChamadosPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; tab?: string }>
}) {
  const resolvedParams = await searchParams
  const editId = resolvedParams?.edit
  const activeTab = resolvedParams?.tab || 'ativos' // 'ativos' é a aba padrão

  const tickets = await getTickets()
  const companies = await getCompanies()
  const equipments = await getEquipments()

  // Encontra o chamado que está sendo editado
  const ticketToEdit = editId ? tickets.find(t => t.id === editId) : undefined

  // Separação por status
  const openTickets = tickets.filter(t => t.status === 'OPEN')
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS')
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED')

  // Contadores para as abas
  const countAtivos = openTickets.length + inProgressTickets.length
  const countConcluidos = resolvedTickets.length

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-gray-100 md:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Quadro de Chamados</h1>
          <p className="mt-2 text-sm text-gray-400 md:text-base">Acompanhe e gerencie os atendimentos.</p>
        </div>
      </div>

      {/* Formulário de Criação / Edição mantido intacto */}
      <TicketForm companies={companies} equipments={equipments} ticketToEdit={ticketToEdit} />

      {/* ================= ABAS DE NAVEGAÇÃO ================= */}
      <div className="mb-6 mt-4 border-b border-gray-800">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          <Link
            href="?tab=ativos"
            className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'ativos'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-500 hover:border-gray-700 hover:text-gray-300'
            }`}
          >
            Ativos
            <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              activeTab === 'ativos' ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-800 text-gray-400'
            }`}>
              {countAtivos}
            </span>
          </Link>

          <Link
            href="?tab=concluidos"
            className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'concluidos'
                ? 'border-green-500 text-green-400'
                : 'border-transparent text-gray-500 hover:border-gray-700 hover:text-gray-300'
            }`}
          >
            Histórico (Concluídos)
            <span className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              activeTab === 'concluidos' ? 'bg-green-900/50 text-green-300' : 'bg-gray-800 text-gray-400'
            }`}>
              {countConcluidos}
            </span>
          </Link>

          <Link
            href="?tab=todos"
            className={`whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
              activeTab === 'todos'
                ? 'border-gray-300 text-gray-200'
                : 'border-transparent text-gray-500 hover:border-gray-700 hover:text-gray-300'
            }`}
          >
            Todos
          </Link>
        </nav>
      </div>
      {/* ================= FIM DAS ABAS ================= */}

      {/* QUADRO DE COLUNAS (Kaban Dinâmico) */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:overflow-x-auto md:pb-4">
        
        {/* COLUNA: Abertos (Aparece em "ativos" ou "todos") */}
        {(activeTab === 'ativos' || activeTab === 'todos') && (
          <div className="flex-1 rounded-xl bg-gray-900 p-4 md:min-w-[320px]">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <h3 className="font-semibold text-white">Abertos ({openTickets.length})</h3>
            </div>
            <div className="flex flex-col gap-3">
              {openTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
              {openTickets.length === 0 && <p className="text-center text-sm text-gray-500">Nenhum chamado aberto.</p>}
            </div>
          </div>
        )}

        {/* COLUNA: Em Andamento (Aparece em "ativos" ou "todos") */}
        {(activeTab === 'ativos' || activeTab === 'todos') && (
          <div className="flex-1 rounded-xl bg-gray-900 p-4 md:min-w-[320px]">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold text-white">Em Andamento ({inProgressTickets.length})</h3>
            </div>
            <div className="flex flex-col gap-3">
              {inProgressTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
              {inProgressTickets.length === 0 && <p className="text-center text-sm text-gray-500">Nenhum em andamento.</p>}
            </div>
          </div>
        )}

        {/* COLUNA: Concluídos (Aparece em "concluidos" ou "todos") */}
        {(activeTab === 'concluidos' || activeTab === 'todos') && (
          <div className="flex-1 rounded-xl bg-gray-900 p-4 md:min-w-[320px]">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <h3 className="font-semibold text-white">Concluídos ({resolvedTickets.length})</h3>
            </div>
            <div className="flex flex-col gap-3">
              {resolvedTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
              {resolvedTickets.length === 0 && <p className="text-center text-sm text-gray-500">Nenhum concluído.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}