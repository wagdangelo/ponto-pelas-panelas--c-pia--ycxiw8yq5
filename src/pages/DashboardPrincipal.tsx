import { AdminClockCard } from '@/pages/admin/AdminClockCard'
import { AdminHistoryCard } from '@/pages/admin/AdminHistoryCard'

export default function DashboardPrincipal() {
  return (
    <div className="flex flex-col gap-6 h-full max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Ponto Digital</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe os registros e gerencie a equipe de forma eficiente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch flex-1">
        <div className="flex flex-col h-full min-h-[320px]">
          <AdminClockCard />
        </div>
        <div className="flex flex-col h-full min-h-[320px]">
          <AdminHistoryCard />
        </div>
      </div>
    </div>
  )
}
