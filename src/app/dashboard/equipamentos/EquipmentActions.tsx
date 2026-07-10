// src/app/dashboard/equipamentos/EquipmentActions.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteEquipment } from './actions'
import { Pencil, Trash2, AlertTriangle } from 'lucide-react'

export function EquipmentActions({ id }: { id: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteEquipment(id)
    setIsModalOpen(false)
    setIsDeleting(false)
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Link 
          href={`/dashboard/equipamentos?edit=${id}`} 
          title="Editar equipamento"
          className="rounded-md p-2 text-gray-400 transition-all duration-200 hover:bg-blue-900/40 hover:text-blue-400"
        >
          <Pencil className="h-[18px] w-[18px]" strokeWidth={2} />
        </Link>
        <button 
          onClick={() => setIsModalOpen(true)}
          title="Excluir equipamento"
          className="rounded-md p-2 text-gray-400 transition-all duration-200 hover:bg-red-900/40 hover:text-red-400"
        >
          <Trash2 className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </div>

      {/* Modal Premium de Confirmação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md transform rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl transition-all">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Excluir Equipamento</h3>
                <p className="text-sm text-gray-400">Esta ação não pode ser desfeita.</p>
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