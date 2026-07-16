// src/app/dashboard/equipamentos/SectorModal.tsx
'use client'

import { useState } from 'react'
import { FolderPlus, Trash2, X, AlertTriangle } from 'lucide-react'
import { createSector, deleteSector } from './actions'

type Company = { id: string; name: string }
type Sector = { id: string; name: string; company_id: string }

export function SectorModal({ 
  companies, 
  sectors 
}: { 
  companies: Company[]
  sectors: Sector[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [newSectorName, setNewSectorName] = useState('')
  
  // Estados para o modal de exclusão customizado
  const [sectorToDelete, setSectorToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filtra os setores da empresa selecionada no modal
  const filteredSectors = sectors.filter(s => s.company_id === selectedCompanyId)

  const handleAddSector = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCompanyId || !newSectorName.trim()) return

    const formData = new FormData()
    formData.append('name', newSectorName)
    formData.append('company_id', selectedCompanyId)

    await createSector(formData)
    setNewSectorName('')
  }

  // Função que executa a exclusão de fato
  const confirmDelete = async () => {
    if (!sectorToDelete) return
    
    setIsDeleting(true)
    await deleteSector(sectorToDelete)
    setIsDeleting(false)
    setSectorToDelete(null) // Fecha o modal de confirmação
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
      >
        <FolderPlus className="h-4 w-4 text-indigo-400" /> Gerenciar Setores
      </button>
    )
  }

  return (
    <>
      {/* MODAL PRINCIPAL: GERENCIAR SETORES */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-indigo-400" /> Gerenciar Setores / Grupos
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 1. Selecionar a Empresa */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-300">Selecione o Cliente</label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="">Selecione uma empresa para ver/criar setores...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedCompanyId && (
            <div className="space-y-4">
              {/* 2. Formulário para adicionar novo Setor */}
              <form onSubmit={handleAddSector} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Vendas, Administrativo, TI..."
                  required
                  value={newSectorName}
                  onChange={(e) => setNewSectorName(e.target.value)}
                  className="flex-1 rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Adicionar
                </button>
              </form>

              {/* 3. Lista de setores cadastrados na empresa */}
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Setores Ativos</p>
                {filteredSectors.length === 0 ? (
                  <p className="text-sm text-gray-600 py-2">Nenhum setor cadastrado para este cliente.</p>
                ) : (
                  <div className="divide-y divide-gray-800 max-h-48 overflow-y-auto pr-1">
                    {filteredSectors.map(s => (
                      <div key={s.id} className="flex items-center justify-between py-2 text-sm text-gray-300">
                        <span>{s.name}</span>
                        <button
                          type="button"
                          onClick={() => setSectorToDelete(s.id)} // Abre o modal customizado
                          className="text-gray-500 hover:text-red-400 transition-colors p-1"
                          title="Excluir Setor"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUB-MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (z-[60] para ficar por cima do anterior) */}
      {sectorToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md transform rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl transition-all">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Excluir Setor</h3>
                <p className="text-sm text-gray-400">
                  Deseja realmente excluir este setor? Equipamentos vinculados a ele ficarão "Sem Setor".
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setSectorToDelete(null)} 
                disabled={isDeleting} 
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                disabled={isDeleting} 
                className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}