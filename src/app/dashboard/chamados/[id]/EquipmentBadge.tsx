'use client'

import { useState } from 'react'
import { Monitor, Server, Copy, Check, Network } from 'lucide-react'

export function EquipmentBadge({ equipment }: { equipment: any }) {
  const [copied, setCopied] = useState(false)

  const handleCopyAccess = () => {
    if (equipment.remote_access_id) {
      navigator.clipboard.writeText(equipment.remote_access_id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-300 bg-gray-950/50 p-3 rounded-lg border border-gray-800/50 flex-1 justify-between">
      <div className="flex items-center gap-3">
        {equipment.type === 'SERVER' ? (
          <Server className="h-5 w-5 text-purple-500" />
        ) : (
          <Monitor className="h-5 w-5 text-gray-500" />
        )}
        <div>
          <p className="text-xs text-gray-500">Equipamento</p>
          <span className="font-medium">
            {equipment.identification_number} ({equipment.type === 'SERVER' ? 'Servidor' : 'Terminal'})
          </span>
        </div>
      </div>

      {equipment.remote_access_id && (
        <div className="flex flex-col items-start sm:items-end gap-1 mt-2 sm:mt-0">
          <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Acesso Remoto</span>
          <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-700 px-2 py-1 rounded text-xs">
            <Network className="h-3 w-3 text-indigo-400" />
            <span className="font-semibold text-indigo-400 text-[11px]">{equipment.remote_access_type || 'ANYDESK'}</span>
            <span className="text-gray-600">|</span>
            <code className="text-white font-mono">{equipment.remote_access_id}</code>
            <button
              onClick={handleCopyAccess}
              className="ml-1 rounded-md p-1 text-gray-400 hover:bg-indigo-900/50 hover:text-indigo-300 transition-colors"
              title="Copiar acesso"
            >
              {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}