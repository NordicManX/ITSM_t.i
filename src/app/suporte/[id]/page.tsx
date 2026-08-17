// src/app/suporte/[id]/page.tsx
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { FormularioCliente } from './Formulario'

export default async function PortalDoCliente({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. DESEMPACOTANDO O PARÂMETRO DA URL
  const { id } = await params

  const supabase = await createClient()

  // 2. Busca os dados da empresa usando o ID resolvido
  const { data: empresa } = await supabase
    .from('companies') 
    .select('*')
    .eq('id', id)
    .single()

  // Se colocar um ID falso na URL, mostra página 404
  if (!empresa) {
    notFound()
  }

  // 3. Busca o seu catálogo de serviços ativos
  const { data: categorias } = await supabase
    .from('categorias')
    .select('*')
    .eq('ativo', true)
    .order('nome')

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Cabeçalho Personalizado */}
        <div className="p-6 border-b border-gray-800 bg-gray-950/50 text-center">
          <h1 className="text-xl font-bold text-white">Suporte Técnico</h1>
          <p className="text-sm font-medium text-blue-400 mt-1">
            {empresa.nome || empresa.name || "Cliente Parceiro"}
          </p>
        </div>

        {/* O Formulário Interativo */}
        <div className="p-6">
          <FormularioCliente 
            empresaId={id}
            empresaNome={empresa.nome || empresa.name} 
            categorias={categorias || []} 
          />
        </div>

      </div>
    </div>
  )
}