// src/app/dashboard/equipamentos/EquipmentForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createEquipment, updateEquipment } from './actions'

type Company = { id: string; name: string }
type Equipment = {
  id: string
  company_id: string
  type: string
  identification_number: string
  description: string | null
}

export function EquipmentForm({ 
  companies, 
  equipmentToEdit 
}: { 
  companies: Company[]
  equipmentToEdit?: Equipment 
}) {
  const router = useRouter()
  const isEditing = !!equipmentToEdit

  // Estados controlados para forçar a atualização da tela
  const [companyId, setCompanyId] = useState('')
  const [type, setType] = useState('TERMINAL')
  const [identification, setIdentification] = useState('')
  const [description, setDescription] = useState('')

  // Sincroniza os dados do equipamento com os campos da tela
  useEffect(() => {
    if (equipmentToEdit) {
      setCompanyId(equipmentToEdit.company_id)
      setType(equipmentToEdit.type)
      setIdentification(equipmentToEdit.identification_number)
      setDescription(equipmentToEdit.description || '')
    } else {
      setCompanyId('')
      setType('TERMINAL')
      setIdentification('')
      setDescription('')
    }
  }, [equipmentToEdit])

  const handleSubmit = async (formData: FormData) => {
    if (isEditing) {
      await updateEquipment(equipmentToEdit.id, formData)
      router.push('/dashboard/equipamentos')
    } else {
      await createEquipment(formData)
      // Limpa os campos após cadastrar um novo
      setCompanyId('')
      setIdentification('')
      setDescription('')
    }
  }

  const handleCancelEdit = () => {
    router.push('/dashboard/equipamentos')
  }

  return (
    <div className="mb-10 rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {isEditing ? 'Editar Equipamento' : 'Novo Equipamento'}
        </h2>
        {isEditing && (
          <button onClick={handleCancelEdit} className="text-sm font-medium text-gray-400 hover:text-white">
            Cancelar Edição
          </button>
        )}
      </div>
      
      {companies.length === 0 ? (
        <div className="rounded-md bg-yellow-900/50 p-4 text-yellow-500 border border-yellow-800">
          Você precisa cadastrar uma empresa antes de adicionar equipamentos.
        </div>
      ) : (
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="company_id" className="mb-1 block text-sm font-medium text-gray-300">Cliente (Empresa)</label>
              <select
                id="company_id"
                name="company_id"
                required
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione uma empresa...</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="w-1/4">
              <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-300">Tipo</label>
              <select
                id="type"
                name="type"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="TERMINAL">Terminal</option>
                <option value="SERVER">Servidor</option>
              </select>
            </div>

            <div className="w-1/4">
              <label htmlFor="identification_number" className="mb-1 block text-sm font-medium text-gray-300">Numeração / ID</label>
              <input
                type="text"
                id="identification_number"
                name="identification_number"
                required
                value={identification}
                onChange={(e) => setIdentification(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-300">Descrição (Opcional)</label>
              <input
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className={`rounded-md px-6 py-2 font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                isEditing ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {isEditing ? 'Atualizar Equipamento' : 'Adicionar Equipamento'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}