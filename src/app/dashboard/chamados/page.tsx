// src/app/dashboard/chamados/page.tsx
import { getTickets } from './actions'
import { getCompanies } from '../empresas/actions'
import { getEquipments } from '../equipamentos/actions'
import { TicketForm } from './TicketForm'
import { TicketCard } from './TicketCard'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'

export default async function ChamadosPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const resolvedParams = await searchParams
  const editId = resolvedParams?.edit

  const tickets = await getTickets()
  const companies = await getCompanies()
  const equipments = await getEquipments()

  // Encontra o chamado que está sendo editado
  const ticketToEdit = editId ? tickets.find(t => t.id === editId) : undefined

  const openTickets = tickets.filter(t => t.status === 'OPEN')
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS')
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED')

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-gray-100 md:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Quadro de Chamados</h1>
          <p className="mt-2 text-sm text-gray-400 md:text-base">Acompanhe e gerencie os atendimentos.</p>
        </div>
      </div>

      <TicketForm companies={companies} equipments={equipments} ticketToEdit={ticketToEdit} />

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:overflow-x-auto md:pb-4">
        
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

      </div>
    </div>
  )
}