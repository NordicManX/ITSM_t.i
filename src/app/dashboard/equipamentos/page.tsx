// src/app/dashboard/equipamentos/page.tsx
import { getEquipments, getCompaniesList } from './actions'
import { EquipmentForm } from './EquipmentForm'
import { EquipmentActions } from './EquipmentActions'

export default async function EquipamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const resolvedParams = await searchParams
  const editId = resolvedParams?.edit

  const equipments = await getEquipments()
  const companies = await getCompaniesList()

  const equipmentToEdit = editId 
    ? equipments.find(e => e.id === editId)
    : undefined

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8 text-gray-100">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Gestão de Equipamentos</h1>
        <p className="mt-2 text-sm md:text-base text-gray-400">Cadastre servidores e terminais vinculados aos seus clientes.</p>
      </div>

      <EquipmentForm companies={companies} equipmentToEdit={equipmentToEdit} />

      {/* ÁREA DE LISTAGEM DOS DADOS */}
      {equipments.length === 0 ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center text-gray-500 shadow-sm">
          Nenhum equipamento cadastrado ainda.
        </div>
      ) : (
        <div className="w-full">
          {/* VISUALIZAÇÃO MOBILE: CARDS (Visível apenas em celulares, md:hidden esconde no PC) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {equipments.map((equipment) => (
              <div key={equipment.id} className="flex flex-col gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-sm">
                <div className="flex items-start justify-between border-b border-gray-800 pb-3">
                  <div className="overflow-hidden pr-2">
                    <span className="block text-xs font-semibold uppercase text-gray-500">Numeração</span>
                    <span className="font-bold text-blue-400 break-words">{equipment.identification_number}</span>
                  </div>
                  <div className="shrink-0">
                    <EquipmentActions id={equipment.id} />
                  </div>
                </div>
                
                <div>
                  <span className="block text-xs font-semibold uppercase text-gray-500">Empresa</span>
                  <span className="text-gray-300">{equipment.companies?.name}</span>
                </div>

                <div className="flex items-start justify-between pt-1">
                  <div>
                    <span className="block text-xs font-semibold uppercase text-gray-500 mb-1">Tipo</span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      equipment.type === 'SERVER' ? 'bg-purple-900/50 text-purple-400' : 'bg-green-900/50 text-green-400'
                    }`}>
                      {equipment.type === 'SERVER' ? 'Servidor' : 'Terminal'}
                    </span>
                  </div>
                  {equipment.description && (
                    <div className="text-right max-w-[50%]">
                      <span className="block text-xs font-semibold uppercase text-gray-500">Descrição</span>
                      <span className="block text-sm text-gray-400 truncate">{equipment.description}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* VISUALIZAÇÃO DESKTOP: TABELA (hidden esconde no celular, md:block mostra no PC) */}
          <div className="hidden w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 shadow-sm md:block">
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
                {equipments.map((equipment) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}