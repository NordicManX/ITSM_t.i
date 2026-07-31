// src/app/dashboard/layout.tsx
import type { Metadata, Viewport } from "next"
import { Sidebar } from '@/components/Sidebar'

// Configurações do App (PWA)
export const metadata: Metadata = {
  title: "NordicDesk TI",
  description: "Painel de Gestão de TI e Cofre de Anotações",
}

// Configuração da cor da janela/barra de status
export const viewport: Viewport = {
  themeColor: "#030712", // Tom escuro para combinar com o bg-gray-950
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-900 md:flex-row">
      {/* A nossa barra lateral fixa (que agora vira header no mobile) */}
      <Sidebar />
      
      {/* A área onde o conteúdo de cada página vai renderizar */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}