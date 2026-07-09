// src/app/dashboard/layout.tsx
import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* A nossa barra lateral fixa */}
      <Sidebar />
      
      {/* A área onde o conteúdo de cada página vai renderizar */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}