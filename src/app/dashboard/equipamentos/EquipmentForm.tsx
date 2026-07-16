// src/app/dashboard/equipamentos/EquipmentForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createEquipment, updateEquipment } from './actions'

type Company = { id: string; name: string }
type Sector = { id: string; name: string; company_id: string }
type Equipment = {
  id: string
  company_id: string
  sector_id?: string
  type: string
  identification_number: string
  description: string | null
  remote_access_type?: string
  remote_access_id?: string
}

export function EquipmentForm({ 
  companies, 
  sectors,
  equipmentToEdit 
}: { 
  companies: Company[]
  sectors: Sector[]
  equipmentToEdit?: Equipment 
}) {
  const router = useRouter()
  const isEditing = !!equipmentToEdit

  // Estados controlados para forçar a atualização da tela
  const [companyId, setCompanyId] = useState('')
  const [sectorId, setSectorId] = useState('')
  const [type, setType] = useState('TERMINAL')
  const [identification, setIdentification] = useState('')
  const [description, setDescription] = useState('')
  const [remoteAccessType, setRemoteAccessType] = useState('ANYDESK')
  const [remoteAccessId, setRemoteAccessId] = useState('')

  // Sincroniza os dados do equipamento com os campos da tela
  useEffect(() => {
    if (equipmentToEdit) {
      setCompanyId(equipmentToEdit.company_id)
      setSectorId(equipmentToEdit.sector_id || '')
      setType(equipmentToEdit.type)
      setIdentification(equipmentToEdit.identification_number)
      setDescription(equipmentToEdit.description || '')
      setRemoteAccessType(equipmentToEdit.remote_access_type || 'ANYDESK')
      setRemoteAccessId(equipmentToEdit.remote_access_id || '')
    } else {
      setCompanyId('')
      setSectorId('')
      setType('TERMINAL')
      setIdentification('')
      setDescription('')
      setRemoteAccessType('ANYDESK')
      setRemoteAccessId('')
    }
  }, [equipmentToEdit])

  // Filtra os setores disponíveis baseados na empresa selecionada
  const availableSectors = sectors.filter(s => s.company_id === companyId)

  const handleSubmit = async (formData: FormData) => {
    if (isEditing) {
      await updateEquipment(equipmentToEdit.id, formData)
      router.push('/dashboard/equipamentos')
    } else {
      await createEquipment(formData)
      // Limpa os campos após cadastrar um novo
      setCompanyId('')
      setSectorId('')
      setIdentification('')
      setDescription('')
      setRemoteAccessType('ANYDESK')
      setRemoteAccessId('')
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
          <button onClick={handleCancelEdit} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Cancelar Edição
          </button>
        )}
      </div>
      
      {companies.length === 0 ? (
        <div className="rounded-md bg-yellow-900/50 p-4 text-yellow-500 border border-yellow-800">
          Você precisa cadastrar uma empresa antes de adicionar equipamentos.
        </div>
      ) : (
        <form action={handleSubmit} className="flex flex-col gap-5">
          
          {/* PRIMEIRA LINHA: Empresa, Setor, Tipo, Numeração */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label htmlFor="company_id" className="mb-1 block text-sm font-medium text-gray-300">Cliente (Empresa)</label>
              <select
                id="company_id"
                name="company_id"
                required
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value)
                  setSectorId('') // Reseta o setor ao trocar de cliente
                }}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione uma empresa...</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/5">
              <label htmlFor="sector_id" className="mb-1 block text-sm font-medium text-indigo-400">Setor / Grupo</label>
              <select
                id="sector_id"
                name="sector_id"
                value={sectorId}
                disabled={!companyId}
                onChange={(e) => setSectorId(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">Sem Setor</option>
                {availableSectors.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/5">
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

            <div className="w-full md:w-1/5">
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

          {/* SEGUNDA LINHA: Acesso Remoto */}
          <div className="flex flex-col gap-4 md:flex-row bg-gray-950/50 p-4 rounded-lg border border-gray-800/50">
            <div className="w-full md:w-1/3">
              <label htmlFor="remote_access_type" className="mb-1 block text-sm font-medium text-indigo-400">Tipo de Acesso Remoto</label>
              <select
                id="remote_access_type"
                name="remote_access_type"
                value={remoteAccessType}
                onChange={(e) => setRemoteAccessType(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ANYDESK">AnyDesk</option>
                <option value="RDP">Área de Trabalho Remota (RDP)</option>
                <option value="TEAMVIEWER">TeamViewer</option>
                <option value="OTHER">Outro / VPN</option>
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="remote_access_id" className="mb-1 block text-sm font-medium text-indigo-400">ID / Endereço de Conexão</label>
              <input
                type="text"
                id="remote_access_id"
                name="remote_access_id"
                value={remoteAccessId}
                onChange={(e) => setRemoteAccessId(e.target.value)}
                placeholder="Ex: 123 456 789 ou 192.168.1.50"
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* TERCEIRA LINHA: Descrição e Botão de Salvar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
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
              className={`w-full rounded-md px-6 py-2 font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 md:w-auto ${
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