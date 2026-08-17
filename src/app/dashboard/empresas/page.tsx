// src/app/dashboard/empresas/page.tsx
import { getCompanies } from '@/app/dashboard/actions'
import { CompanyForm } from './CompanyForm'
import { BotaoWhatsApp } from '@/components/BotaoWhatsApp' // <-- Importando o botão!

export default async function EmpresasPage() {
  const companies = await getCompanies()

  return (
    <div className="min-h-screen bg-gray-950 p-8 text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Gestão de Empresas</h1>
        <p className="mt-2 text-gray-400">Cadastre e gerencie seus clientes.</p>
      </div>

      {/* Renderizamos o nosso Client Component aqui */}
      <CompanyForm />

      {/* Tabela de Clientes */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-950/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Nome da Empresa
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                CNPJ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                Data de Cadastro
              </th>
              {/* NOVA COLUNA AQUI */}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-400">
                Portal do Cliente
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900">
            {companies.length === 0 ? (
              <tr>
                {/* Atualizado para colSpan 4 */}
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Nenhuma empresa cadastrada ainda.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id} className="transition-colors hover:bg-gray-800/50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-white">
                    {company.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                    {company.cnpj || '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-400">
                    {new Date(company.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  {/* CÉLULA COM O BOTÃO DO WHATSAPP */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <BotaoWhatsApp 
                      empresaId={company.id} 
                      nomeEmpresa={company.name} 
                      telefoneContato={company.phone || company.telefone} 
                    />
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