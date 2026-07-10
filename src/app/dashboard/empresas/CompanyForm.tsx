// src/app/dashboard/empresas/CompanyForm.tsx
'use client'

import { useState } from 'react'
import { createCompany } from '@/app/dashboard/actions'

export function CompanyForm() {
  const [cnpj, setCnpj] = useState('')

  // Função para aplicar a máscara de CNPJ em tempo real
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Remove tudo o que não for número
    value = value.replace(/\D/g, '')

    // Limita a 14 números
    if (value.length > 14) {
      value = value.slice(0, 14)
    }

    // Aplica a formatação: 00.000.000/0000-00
    value = value.replace(/^(\d{2})(\d)/, '$1.$2')
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')

    setCnpj(value)
  }

  // Intercepta o envio do formulário para garantir que os dados corretos vão para a Action
  const handleSubmit = async (formData: FormData) => {
    // Opcional: Se quiser salvar o CNPJ limpo no banco (só números), pode tratar aqui.
    // Mas vamos manter com a máscara visual para facilitar a leitura.
    await createCompany(formData)
    setCnpj('') // Limpa o campo após cadastrar
    
    // Limpa o campo de nome também (resetando o formulário pai)
    const formElement = document.getElementById('company-form') as HTMLFormElement
    if (formElement) formElement.reset()
  }

  return (
    <div className="mb-10 rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-white">Nova Empresa</h2>
     <form id="company-form" action={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-300">
            Razão Social / Nome Fantasia
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Ex: Tech Solutions Ltda"
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="cnpj" className="mb-1 block text-sm font-medium text-gray-300">
            CNPJ (Opcional)
          </label>
          <input
            type="text"
            id="cnpj"
            name="cnpj"
            value={cnpj}
            onChange={handleCnpjChange}
            placeholder="00.000.000/0000-00"
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 md:w-auto"
        >
          Cadastrar
        </button>
      </form>
    </div>
  )
}