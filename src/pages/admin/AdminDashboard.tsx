import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from './AdminSidebar'
import { AdminClockCard } from './AdminClockCard'
import { AdminHistoryCard } from './AdminHistoryCard'

export function AdminDashboard() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-[#fdfbf7] min-h-screen">
        <header className="flex h-14 items-center gap-4 border-b px-4 bg-white/80 backdrop-blur-sm lg:hidden sticky top-0 z-10">
          <SidebarTrigger />
          <h1 className="font-semibold text-lg">Ponto Digital</h1>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-foreground hidden lg:block mb-8 tracking-tight">
              Ponto Digital
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdminClockCard />
              <AdminHistoryCard />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
