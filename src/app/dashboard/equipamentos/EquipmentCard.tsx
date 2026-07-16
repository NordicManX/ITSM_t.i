// src/app/dashboard/equipamentos/EquipmentCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Monitor, Server, Pencil, Trash2, AlertTriangle, Copy, Check, Network, ExternalLink } from 'lucide-react'
import { deleteEquipment } from './actions'

export function EquipmentCard({ equipment, filterCompanyId }: { equipment: any, filterCompanyId?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  // Tratativa para garantir que pegamos o nome do setor, não importa como o Supabase formatou o JSON de retorno
  const sectorName = equipment.sector?.name || equipment.sectors?.name

  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteEquipment(equipment.id)
    setIsModalOpen(false)
    setIsDeleting(false)
  }

  // Copiar ID para a área de transferência
  const handleCopyAccess = () => {
    if (equipment.remote_access_id) {
      navigator.clipboard.writeText(equipment.remote_access_id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // A Mágica da Conexão Direta
  const handleConnect = () => {
    const type = equipment.remote_access_type
    const id = equipment.remote_access_id

    if (!id) return

    if (type === 'ANYDESK') {
      window.open(`anydesk://${id}`, '_self')
    } 
    else if (type === 'TEAMVIEWER') {
      window.open(`teamviewer10://control?device=${id}`, '_self')
    } 
    else if (type === 'RDP') {
      const rdpContent = `full address:s:${id}\nprompt for credentials:i:1\n`
      const blob = new Blob([rdpContent], { type: 'application/x-rdp' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Conexao_${equipment.identification_number}.rdp`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } 
    else {
      handleCopyAccess()
      alert('O ID foi copiado. Abra seu software de VPN/Conexão manualmente.')
    }
  }

  return (
    <>
      <div className="flex flex-col justify-between rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm transition-all hover:border-gray-700">
        <div>
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-800">
              {equipment.type === 'SERVER' ? (
                <Server className="h-5 w-5 text-purple-400" />
              ) : (
                <Monitor className="h-5 w-5 text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-lg leading-none">{equipment.identification_number}</h3>
                
                {/* A ETIQUETA DO SETOR BEM VISÍVEL AQUI */}
                {sectorName && (
                  <span className="rounded-full bg-indigo-900/40 border border-indigo-700/50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 uppercase tracking-widest shadow-sm">
                    {sectorName}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-gray-500">
                {equipment.type === 'SERVER' ? 'Servidor' : 'Terminal'}
              </span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col gap-2">
            <div className="rounded bg-gray-950 p-3 border border-gray-800">
              <span className="block text-xs text-gray-500 mb-1">Empresa vinculada:</span>
              <span className="block text-sm font-medium text-gray-300 line-clamp-1">
                {equipment.companies?.name}
              </span>
            </div>

            {equipment.remote_access_id && (
              <div className="rounded bg-indigo-950/20 p-3 border border-indigo-900/30 flex items-center justify-between group">
                <div>
                  <span className="flex items-center gap-1 text-[10px] uppercase font-semibold text-indigo-400/70 mb-1">
                    <Network className="h-3 w-3" />
                    {equipment.remote_access_type || 'ANYDESK'}
                  </span>
                  <span className="block text-sm font-mono text-indigo-300">
                    {equipment.remote_access_id}
                  </span>
                </div>
                
                {/* Botões de Ação (Copiar e Conectar) */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyAccess}
                    className="rounded-md p-2 text-indigo-400/50 hover:bg-indigo-900/50 hover:text-indigo-300 transition-colors"
                    title="Copiar ID/IP"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={handleConnect}
                    className="flex items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-500 transition-colors shadow-sm"
                    title="Conectar Agora"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-5 flex items-center justify-between border-t border-gray-800 pt-4">
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