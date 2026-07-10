// src/app/dashboard/chamados/TicketForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createTicket, updateTicket } from './actions'

type Company = { id: string; name: string }
type Equipment = { id: string; company_id: string; identification_number: string; type: string }

export function TicketForm({ companies, equipments, ticketToEdit }: { companies: Company[], equipments: Equipment[], ticketToEdit?: any }) {
  const router = useRouter()
  const isEditing = !!ticketToEdit
  
  // Se estiver editando, o form já abre aberto
  const [isOpen, setIsOpen] = useState(isEditing)
  const [error, setError] = useState<string | null>(null)

  // Estados dos campos
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('')
  const [description, setDescription] = useState('')

  // Sincroniza os dados se o ticketToEdit mudar
  useEffect(() => {
    if (ticketToEdit) {
      setIsOpen(true)
      setTitle(ticketToEdit.title)
      setPriority(ticketToEdit.priority)
      setSelectedCompanyId(ticketToEdit.company_id)
      setSelectedEquipmentId(ticketToEdit.equipment_id || '')
      setDescription(ticketToEdit.description)
    } else {
      setTitle('')
      setPriority('MEDIUM')
      setSelectedCompanyId('')
      setSelectedEquipmentId('')
      setDescription('')
    }
  }, [ticketToEdit])

  const filteredEquipments = equipments.filter(eq => eq.company_id === selectedCompanyId)

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    
    let result;
    if (isEditing) {
      result = await updateTicket(ticketToEdit.id, formData)
    } else {
      result = await createTicket(formData)
    }
    
    if (result?.error) {
      setError(result.error)
      return
    }

    if (isEditing) {
      router.push('/dashboard/chamados') // Limpa a URL
    } else {
      setIsOpen(false)
      setSelectedCompanyId('')
      setSelectedEquipmentId('')
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    if (isEditing) router.push('/dashboard/chamados')
  }

  if (!isOpen && !isEditing) {
    return (
      <button 
        onClick={() => { setIsOpen(true); setError(null); }}
        className="mb-8 rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
      >
        + Abrir Novo Chamado
      </button>
    )
  }

  return (
    <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          {isEditing ? 'Editar Chamado' : 'Novo Chamado'}
        </h2>
        <button onClick={handleCancel} className="text-sm text-gray-400 hover:text-white">
          Cancelar
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-900/30 p-3 text-sm text-red-400 border border-red-800/50">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-300">Título / Resumo do Problema</label>
            <input
              type="text" id="title" name="title" required value={title} onChange={e => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="w-full md:w-1/4">
            <label htmlFor="priority" className="mb-1 block text-sm font-medium text-gray-300">Prioridade</label>
            <select
              id="priority" name="priority" required value={priority} onChange={e => setPriority(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label htmlFor="company_id" className="mb-1 block text-sm font-medium text-gray-300">Empresa</label>
            <select
              id="company_id" name="company_id" required value={selectedCompanyId} onChange={(e) => { setSelectedCompanyId(e.target.value); setSelectedEquipmentId(''); }}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">Selecione a empresa...</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="equipment_id" className="mb-1 block text-sm font-medium text-gray-300">Equipamento (Opcional)</label>
            <select
              id="equipment_id" name="equipment_id" disabled={!selectedCompanyId} value={selectedEquipmentId} onChange={e => setSelectedEquipmentId(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
            >
              <option value="">Nenhum equipamento específico...</option>
              {filteredEquipments.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.identification_number} - {eq.type === 'SERVER' ? 'Servidor' : 'Terminal'}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-300">Descrição Detalhada</label>
          <textarea
            id="description" name="description" required rows={3} value={description} onChange={e => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button type="submit" className={`w-full rounded-md px-6 py-2 font-semibold text-white transition-colors hover:opacity-90 md:w-auto ${isEditing ? 'bg-orange-600' : 'bg-blue-600'}`}>
            {isEditing ? 'Atualizar Chamado' : 'Salvar Chamado'}
          </button>
        </div>
      </form>
    </div>
  )
}