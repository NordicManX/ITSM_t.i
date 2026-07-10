// src/app/dashboard/equipamentos/page.tsx
import { getEquipments, getCompaniesList } from './actions'
import { EquipmentForm } from './EquipmentForm'
import { EquipmentActions } from './EquipmentActions'

export default async function EquipamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }> // 1. Tipamos como uma Promise
}) {
  // 2. Desempacotamos o valor da URL de forma assíncrona
  const resolvedParams = await searchParams
  const editId = resolvedParams?.edit

  const equipments = await getEquipments()
  const companies = await getCompaniesList()

  // 3. Buscamos o equipamento usando o ID extraído com segurança
  const equipmentToEdit = editId 
    ? equipments.find(e => e.id === editId)
    : undefined

  return (
    <div className="min-h-screen bg-gray-950 p-8 text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Gestão de Equipamentos</h1>
        <p className="mt-2 text-gray-400">Cadastre servidores e terminais vinculados aos seus clientes.</p>
      </div>

      <EquipmentForm companies={companies} equipmentToEdit={equipmentToEdit} />

      <div className="rounded-lg border border-gray-800 bg-gray-900 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-950/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Numeração</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Tipo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Empresa</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Descrição</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {equipments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nenhum equipamento cadastrado ainda.
                </td>
              </tr>
            ) : (
              equipments.map((equipment) => (
                <tr key={equipment.id} className="transition-colors hover:bg-gray-800/50">
                  <td className="whitespace-nowrap px-6 py-4 font-bold text-blue-400">
                    {equipment.identification_number}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      equipment.type === 'SERVER' ? 'bg-purple-900/50 text-purple-400' : 'bg-green-900/50 text-green-400'
                    }`}>
                      {equipment.type === 'SERVER' ? 'Servidor' : 'Terminal'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                    {equipment.companies?.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-400">
                    {equipment.description || '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <EquipmentActions id={equipment.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}