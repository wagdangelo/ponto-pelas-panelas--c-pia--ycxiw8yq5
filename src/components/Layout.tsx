import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/pages/admin/AdminSidebar'
import { useAuth } from '@/hooks/use-auth'

export default function Layout() {
  const { session } = useAuth()

  if (!session) {
    return (
      <main className="flex flex-col min-h-screen">
        <Outlet />
      </main>
    )
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
        </header>
        <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 bg-muted/20">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
