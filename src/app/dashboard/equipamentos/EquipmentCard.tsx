// src/app/dashboard/equipamentos/EquipmentCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Monitor, Server, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { deleteEquipment } from './actions'

export function EquipmentCard({ equipment, filterCompanyId }: { equipment: any, filterCompanyId?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteEquipment(equipment.id)
    setIsModalOpen(false)
    setIsDeleting(false)
  }

  return (
    <>
      <div className="flex flex-col justify-between rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm transition-all hover:border-gray-700">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800">
              {equipment.type === 'SERVER' ? (
                <Server className="h-5 w-5 text-purple-400" />
              ) : (
                <Monitor className="h-5 w-5 text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-white">{equipment.identification_number}</h3>
              <span className="text-xs font-medium text-gray-500">
                {equipment.type === 'SERVER' ? 'Servidor' : 'Terminal'}
              </span>
            </div>
          </div>
          
          <div className="mt-4 rounded bg-gray-950 p-3 border border-gray-800">
            <span className="block text-xs text-gray-500 mb-1">Empresa vinculada:</span>
            <span className="block text-sm font-medium text-gray-300 line-clamp-1">
              {equipment.companies?.name}
            </span>
          </div>
        </div>
        
        <div className="mt-5 flex items-center justify-between border-t border-gray-800 pt-4">
          {/* Botão que agora abre o modal com segurança */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" /> Excluir
          </button>

          <Link 
            href={`/dashboard/equipamentos?edit=${equipment.id}${filterCompanyId ? `&empresa=${filterCompanyId}` : ''}`} 
            className="flex items-center gap-1.5 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            <Pencil className="h-4 w-4" /> Editar
          </Link>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md transform rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl transition-all">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Excluir Equipamento</h3>
                <p className="text-sm text-gray-400">
                  Esta ação não pode ser desfeita. O equipamento <span className="text-white font-semibold">"{equipment.identification_number}"</span> será removido permanentemente.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={isDeleting} 
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete} 
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