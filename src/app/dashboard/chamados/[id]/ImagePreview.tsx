// src/app/dashboard/chamados/[id]/ImagePreview.tsx
'use client'

import { useState } from 'react'
import { X, ZoomIn } from 'lucide-react'

export function ImagePreview({ src, alt }: { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Miniatura Clicável na Linha do Tempo (Tamanho Micro) */}
      <div 
        className="group relative mt-2 inline-block h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded border border-gray-700 bg-gray-900 shadow-sm"
        onClick={() => setIsOpen(true)}
      >
        <img 
          src={src} 
          alt={alt} 
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:opacity-40" 
        />
        {/* Ícone de lupa centralizado que aparece ao passar o mouse */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-sm">
            <ZoomIn className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Modal Fullscreen (Lightbox) mantido em tamanho grande */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-all"
          onClick={() => setIsOpen(false)}
        >
          <button 
            className="absolute right-6 top-6 rounded-full bg-gray-800/50 p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          
          <img 
            src={src} 
            alt={alt} 
            className="max-h-[90vh] max-w-[90vw] select-none rounded-lg object-contain shadow-2xl ring-1 ring-white/10" 
            onClick={(e) => e.stopPropagation()} // Evita que clicar na imagem feche o modal
          />
        </div>
      )}
    </>
  )
}