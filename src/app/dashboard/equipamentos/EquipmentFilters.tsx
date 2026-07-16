'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Filter } from 'lucide-react'

type Company = { id: string; name: string }
type Sector = { id: string; name: string; company_id: string }

export function EquipmentFilters({ 
  companies, 
  sectors 
}: { 
  companies: Company[]
  sectors: Sector[] 
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCompany = searchParams.get('empresa') || ''
  const currentSector = searchParams.get('setor') || ''

  // Só exibe no dropdown os setores que pertencem à empresa selecionada no momento
  const availableSectors = currentCompany 
    ? sectors.filter(s => s.company_id === currentCompany)
    : []

  // Manipula a troca de Empresa
  const handleCompanyChange = (companyId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (companyId) {
      params.set('empresa', companyId)
    } else {
      params.delete('empresa')
    }
    
    // REGRA DE OURO: Se trocou a empresa, o setor antigo não faz mais sentido. Então deletamos o filtro de setor.
    params.delete('setor')
    
    router.push(pathname + '?' + params.toString())
  }

  // Manipula a troca de Setor
  const handleSectorChange = (sectorId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (sectorId) {
      params.set('setor', sectorId)
    } else {
      params.delete('setor')
    }
    
    router.push(pathname + '?' + params.toString())
  }

  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-gray-400">
        <Filter className="h-5 w-5 text-indigo-400" />
        <span className="text-sm font-semibold uppercase tracking-wider">Filtros:</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <select
          value={currentCompany}
          onChange={(e) => handleCompanyChange(e.target.value)}
          className="w-full sm:w-64 rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Todas as Empresas</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={currentSector}
          onChange={(e) => handleSectorChange(e.target.value)}
          disabled={!currentCompany} // Fica desativado se nenhuma empresa estiver selecionada
          className="w-full sm:w-64 rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">Todos os Setores</option>
          {availableSectors.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}