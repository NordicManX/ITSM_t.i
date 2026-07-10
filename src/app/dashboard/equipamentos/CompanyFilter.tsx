// src/app/dashboard/equipamentos/CompanyFilter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

export function CompanyFilter({ companies }: { companies: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Pega o ID da empresa que está na URL (se houver)
  const currentCompany = searchParams.get('empresa') || ''

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set('empresa', value) // Adiciona o filtro na URL
    } else {
      params.delete('empresa') // Remove o filtro se escolher "Todas"
    }
    
    // Atualiza a página com a nova URL sem recarregar tudo
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-sm w-full md:w-fit">
      <Filter className="h-5 w-5 text-gray-500" />
      <label htmlFor="company-filter" className="text-sm font-medium text-gray-300 whitespace-nowrap">
        Filtrar por Empresa:
      </label>
      <select
        id="company-filter"
        value={currentCompany}
        onChange={handleChange}
        className="rounded-md border border-gray-700 bg-gray-800 px-4 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
      >
        <option value="">Mostrar Todas as Empresas</option>
        {companies.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}