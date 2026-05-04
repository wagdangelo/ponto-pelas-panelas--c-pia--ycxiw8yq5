import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Briefcase,
  Calendar,
  FileText,
  LogOut,
  Clock,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { InviteModal } from './InviteModal'

export function AdminSidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <>
      <Sidebar className="border-r shadow-sm">
        <SidebarHeader className="p-4">
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="w-full flex items-center justify-center gap-2 shadow-sm font-semibold rounded-xl"
          >
            <UserPlus size={18} />
            Convidar
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs">Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard" className="rounded-lg">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs">Gestão</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Colaboradores" className="rounded-lg">
                    <Users />
                    <span>Colaboradores</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Recrutamento" className="rounded-lg">
                    <Briefcase />
                    <span>Recrutamento</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs">Operacional</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Ponto" className="rounded-lg">
                    <Clock />
                    <span>Ponto</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Férias" className="rounded-lg">
                    <Calendar />
                    <span>Férias</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs">Histórico</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Avaliações" className="rounded-lg">
                    <FileText />
                    <span>Avaliações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t bg-muted/20">
          <div className="mb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Acesso:</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px]">
              Admin
            </span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 font-medium rounded-lg"
            onClick={handleSignOut}
          >
            <LogOut size={18} className="mr-2" />
            Sair
          </Button>
        </SidebarFooter>
      </Sidebar>
      <InviteModal open={isInviteOpen} onOpenChange={setIsInviteOpen} />
    </>
  )
}
