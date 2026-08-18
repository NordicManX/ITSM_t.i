// src/app/dashboard/layout.tsx
import { Sidebar } from '@/components/Sidebar'
import { NotificacoesRealtime } from '@/components/NotificacoesRealtime'
import { Toaster } from 'react-hot-toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-900 md:flex-row">
      
      {/* Componente invisível que escuta os novos chamados no Supabase */}
      <NotificacoesRealtime />

      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1f2937', // bg-gray-800
            color: '#fff',
            border: '1px solid #374151', // border-gray-700
          }
        }} 
      />
      
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}