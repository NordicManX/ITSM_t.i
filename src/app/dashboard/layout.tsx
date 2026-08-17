// src/app/dashboard/layout.tsx
import { Sidebar } from '@/components/Sidebar'
import { NotificacoesRealtime } from '@/components/NotificacoesRealtime'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-900 md:flex-row">
      
      {/* Componente invisível que escuta os novos chamados no Supabase */}
      <NotificacoesRealtime />
      
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}