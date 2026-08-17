// src/app/dashboard/categorias/page.tsx
import { 
  getCategories, 
  addCategory, 
  deleteCategory, 
  toggleCategoryStatus 
} from './actions'
import { Plus, Trash2, Power, PowerOff } from 'lucide-react'

export default async function CategoriasPage() {
  const categorias = await getCategories()

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Catálogo de Serviços</h1>
        <p className="mt-2 text-sm text-gray-400">
          Gerencie os serviços que aparecerão no portal público para seus clientes.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        
        {/* FORMULÁRIO DE CADASTRO */}
        <div className="md:col-span-1">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Novo Serviço</h2>
            <form action={addCategory} className="space-y-4">
              <div>
                <label htmlFor="nome" className="mb-1 block text-sm font-medium text-gray-400">Nome do Serviço</label>
                <input 
                  type="text" 
                  id="nome" 
                  name="nome" 
                  required
                  placeholder="Ex: Instalação de Impressora"
                  className="w-full rounded-md border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="descricao" className="mb-1 block text-sm font-medium text-gray-400">Descrição (Opcional)</label>
                <textarea 
                  id="descricao" 
                  name="descricao" 
                  rows={3}
                  placeholder="Detalhes para ajudar o cliente a entender este serviço..."
                  className="w-full resize-none rounded-md border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button 
                type="submit" 
                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                <Plus size={18} />
                Adicionar ao Catálogo
              </button>
            </form>
          </div>
        </div>

        {/* LISTAGEM DOS SERVIÇOS */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="border-b border-gray-800 bg-gray-950/50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Serviço</th>
                  <th className="px-6 py-4 font-semibold text-center">Visível pro Cliente?</th>
                  <th className="px-6 py-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      Nenhum serviço cadastrado ainda.
                    </td>
                  </tr>
                ) : (
                  categorias.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{cat.nome}</div>
                        {cat.descricao && <div className="mt-1 text-xs text-gray-500">{cat.descricao}</div>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <form action={toggleCategoryStatus.bind(null, cat.id, cat.ativo)}>
                          <button 
                            type="submit" 
                            title={cat.ativo ? "Desativar" : "Ativar"}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                              cat.ativo 
                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                                : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                            }`}
                          >
                            {cat.ativo ? <Power size={14} /> : <PowerOff size={14} />}
                            {cat.ativo ? 'Sim' : 'Não'}
                          </button>
                        </form>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <form action={async () => {
                          'use server'
                          await deleteCategory(cat.id)
                        }}>
                          <button 
                            type="submit" 
                            className="text-gray-500 hover:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}