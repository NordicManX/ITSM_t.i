"use client"

import { useState } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { updateTicketItem, deleteTicketItem } from '../actions'

interface TicketItem {
  id: string
  description: string
  type: 'PRODUCT' | 'SERVICE'
  quantity: number
  unit_value: number
}

interface EditableRowProps {
  item: TicketItem
  ticketId: string
}

export function EditableRow({ item, ticketId }: EditableRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(item.description)
  const [type, setType] = useState<"PRODUCT" | "SERVICE">(item.type)
  const [quantity, setQuantity] = useState(item.quantity)
  const [unitValue, setUnitValue] = useState(item.unit_value)
  const [isSaving, setIsSaving] = useState(false)

  // Função para salvar a alteração
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('item_id', item.id)
      formData.append('ticket_id', ticketId)
      formData.append('description', description)
      formData.append('type', type)
      formData.append('quantity', quantity.toString())
      formData.append('unit_value', unitValue.toString())

      await updateTicketItem(formData)
      setIsEditing(false)
    } catch (err) {
      alert('Erro ao atualizar o item.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reseta os estados para o valor original do item
    setDescription(item.description)
    setType(item.type)
    setQuantity(item.quantity)
    setUnitValue(item.unit_value)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <tr className="bg-gray-900/50">
        {/* Input Descrição */}
        <td className="px-4 py-2">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded bg-gray-950 border border-gray-700 px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </td>
        
        {/* Select Tipo */}
        <td className="px-4 py-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'PRODUCT' | 'SERVICE')}
            className="rounded bg-gray-950 border border-gray-700 px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="SERVICE">Serviço</option>
            <option value="PRODUCT">Peça</option>
          </select>
        </td>

        {/* Input Quantidade */}
        <td className="px-4 py-2 text-center">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-16 rounded bg-gray-950 border border-gray-700 px-2 py-1 text-sm text-center text-white focus:outline-none focus:border-blue-500"
          />
        </td>

        {/* Input Unitário */}
        <td className="px-4 py-2 text-right">
          <input
            type="number"
            step="0.01"
            min="0"
            value={unitValue}
            onChange={(e) => setUnitValue(parseFloat(e.target.value) || 0)}
            className="w-24 rounded bg-gray-950 border border-gray-700 px-2 py-1 text-sm text-right text-white focus:outline-none focus:border-blue-500"
          />
        </td>

        {/* Total Temporário Calculado */}
        <td className="px-4 py-2 text-right font-semibold text-white">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quantity * unitValue)}
        </td>

        {/* Ações de Salvar/Cancelar */}
        <td className="px-4 py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="text-green-400 hover:text-green-300 disabled:opacity-50 transition-colors p-1"
              title="Salvar"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="text-gray-400 hover:text-red-400 transition-colors p-1"
              title="Cancelar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  // Visualização normal (Leitura)
  return (
    <tr className="hover:bg-gray-900/50 transition-colors border-b border-gray-800">
      <td className="px-4 py-3 font-medium text-white">{item.description}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
          item.type === 'SERVICE' 
            ? 'bg-blue-950/40 text-blue-400 border-blue-900/50' 
            : 'bg-amber-950/40 text-amber-400 border-amber-900/50'
        }`}>
          {item.type === 'SERVICE' ? 'Serviço' : 'Peça'}
        </span>
      </td>
      <td className="px-4 py-3 text-center">{item.quantity}</td>
      <td className="px-4 py-3 text-right">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unit_value)}
      </td>
      <td className="px-4 py-3 text-right font-semibold text-white">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantity * item.unit_value)}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          {/* Botão de Editar */}
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-indigo-400 transition-colors p-1"
            title="Editar item"
          >
            <Pencil className="h-4 w-4" />
          </button>
          
          {/* Botão de Excluir */}
          <form action={async () => {
            if (confirm('Deseja realmente remover este item?')) {
              await deleteTicketItem(item.id, ticketId)
            }
          }}>
            <button type="submit" className="text-gray-500 hover:text-red-400 transition-colors p-1" title="Remover item">
              <Trash2 className="h-4 w-4" />
            </button>
          </form>
        </div>
      </td>
    </tr>
  )
}