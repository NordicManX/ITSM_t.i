// src/app/dashboard/page.tsx
import Link from 'next/link'
import { getCompanies } from './empresas/actions'
import { getEquipments } from './equipamentos/actions'
import { getTickets } from './chamados/actions'
import { createClient } from '@/utils/supabase/server'
import { Building2, Monitor, AlertCircle, Clock, Activity, AlertTriangle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // 1. Pega quem está logado
  const { data: { user } } = await supabase.auth.getUser()

  let userName = 'Usuário'

  if (user) {
    // 2. Busca o full_name diretamente da tabela profiles
    const { data: profile } = await supabase
      .from('profiles') 
      .select('full_name')
      .eq('id', user.id)
      .single()

    // 3. Define o nome: usa o do banco se achar, senão tenta do Auth, senão corta o e-mail
    userName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'
  }

  // 4. Lógica de fuso horário do Brasil
  const hourString = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "numeric",
  })
  const currentHour = parseInt(hourString, 10)

  let greeting = 'Boa noite'
  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Bom dia'
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Boa tarde'
  }

  // 5. A busca abaixo agora é "segura por padrão" graças ao RLS do Supabase.
  const [companies, equipments, tickets] = await Promise.all([
    getCompanies(),
    getEquipments(),
    getTickets()
  ])

  // Cálculos baseados nos dados filtrados pelo RLS
  const openTickets = tickets.filter(t => t.status === 'OPEN')
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS')
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED')
  
  const urgentTickets = tickets.filter(t => t.priority === 'URGENT' && t.status !== 'RESOLVED')

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-gray-100 md:p-8">
      
      {/* CABEÇALHO COM BOAS VINDAS PERSONALIZADAS */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          {greeting}, <span className="text-indigo-400">{userName}</span>!
        </h1>
        <p className="mt-2 text-sm text-gray-400 md:text-base">
          Acompanhe as métricas e a situação do seu NordicDesk.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        <Link href="/dashboard/empresas" className="group flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm transition-all hover:border-indigo-500/50 hover:bg-gray-800 cursor-pointer">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-900/30 transition-colors group-hover:bg-indigo-900/50">
            <Building2 className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Total de Empresas</p>
            <h3 className="text-2xl font-bold text-white">{companies.length}</h3>
          </div>
        </Link>

        <Link href="/dashboard/equipamentos" className="group flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm transition-all hover:border-purple-500/50 hover:bg-gray-800 cursor-pointer">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-900/30 transition-colors group-hover:bg-purple-900/50">
            <Monitor className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Equipamentos</p>
            <h3 className="text-2xl font-bold text-white">{equipments.length}</h3>
          </div>
        </Link>

        <Link href="/dashboard/chamados" className="group flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm transition-all hover:border-red-500/50 hover:bg-gray-800 cursor-pointer">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-900/30 transition-colors group-hover:bg-red-900/50">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Aguardando (Abertos)</p>
            <h3 className="text-2xl font-bold text-white">{openTickets.length}</h3>
          </div>
        </Link>

        <Link href="/dashboard/chamados" className="group flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm transition-all hover:border-blue-500/50 hover:bg-gray-800 cursor-pointer">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-900/30 transition-colors group-hover:bg-blue-900/50">
            <Clock className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Em Andamento</p>
            <h3 className="text-2xl font-bold text-white">{inProgressTickets.length}</h3>
          </div>
        </Link>

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Fila de Urgências
              </h3>
              <Link href="/dashboard/chamados" className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline">
                Ver quadro NordicDesk &rarr;
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {urgentTickets.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-800 py-12">
                  <p className="text-sm text-gray-500">Nenhum chamado urgente no momento. Tudo tranquilo!</p>
                </div>
              ) : (
                urgentTickets.map(ticket => (
                  <Link key={ticket.id} href={`/dashboard/chamados/${ticket.id}`} className="group flex flex-col justify-between gap-4 rounded-lg border border-gray-800 bg-gray-950 p-4 transition-colors hover:border-red-900 hover:bg-gray-900 md:flex-row md:items-center">
                    <div>
                      <h4 className="font-semibold text-red-400 group-hover:underline">{ticket.title}</h4>
                      <p className="mt-1 text-xs text-gray-400">{ticket.companies?.name}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center rounded-full border border-red-800/50 bg-red-900/30 px-3 py-1 text-xs font-medium text-red-400">
                      {ticket.status === 'OPEN' ? 'Aberto' : 'Em Atendimento'}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <Activity className="h-5 w-5 text-green-400" />
              Status de Resolução
            </h3>
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <span className="block text-4xl font-black text-green-500">{resolvedTickets.length}</span>
                <span className="mt-2 block text-sm text-gray-400">Chamados Concluídos</span>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-800 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Taxa de sucesso</span>
                <span className="font-medium text-white">
                  {tickets.length > 0 ? Math.round((resolvedTickets.length / tickets.length) * 100) : 0}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-800">
                <div 
                  className="h-full bg-green-500 transition-all duration-500" 
                  style={{ width: `${tickets.length > 0 ? (resolvedTickets.length / tickets.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}