// src/app/dashboard/equipamentos/page.tsx
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getEquipments } from './actions'
import { getCompanies } from '../empresas/actions'
import { EquipmentForm } from './EquipmentForm'
import { CompanyFilter } from './CompanyFilter'
import { EquipmentCard } from './EquipmentCard' // <-- Importando o cartão inteligente

export default async function EquipamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string, empresa?: string }>
}) {
  const resolvedParams = await searchParams
  const editId = resolvedParams?.edit
  const filterCompanyId = resolvedParams?.empresa

  const equipments = await getEquipments()
  const companies = await getCompanies()

  const equipmentToEdit = editId ? equipments.find(e => e.id === editId) : undefined

  // Filtra os equipamentos com base na seleção da URL
  const displayEquipments = filterCompanyId 
    ? equipments.filter(e => e.company_id === filterCompanyId)
    : equipments

  return (
    <div className="min-h-screen bg-gray-950 p-4 text-gray-100 md:p-8">
      {/* Botão de Voltar */}
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Voltar para o Início
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Equipamentos</h1>
        <p className="mt-2 text-sm text-gray-400">Gerencie o parque tecnológico de seus clientes.</p>
      </div>

      {/* Formulário de Criação/Edição */}
      <EquipmentForm companies={companies} equipmentToEdit={equipmentToEdit} />

      {/* Filtro por Empresa */}
      <CompanyFilter companies={companies} />

      {/* Lista de Equipamentos */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayEquipments.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-gray-800 p-12 text-center">
            <p className="text-gray-500">Nenhum equipamento encontrado para esta seleção.</p>
          </div>
        ) : (
          displayEquipments.map(equipment => (
            <EquipmentCard 
              key={equipment.id} 
              equipment={equipment} 
              filterCompanyId={filterCompanyId} 
            />
          ))
        )}
      </div>
    </div>
  )
}