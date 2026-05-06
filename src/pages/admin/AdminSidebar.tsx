import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Briefcase,
  CheckSquare,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Star,
  Gift,
  LogOut,
  Fingerprint,
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
import { useAuth } from '@/hooks/use-auth'

export function AdminSidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <Sidebar className="border-r shadow-sm">
      <SidebarHeader className="p-4 flex items-center justify-center border-b">
        <div className="flex items-center gap-3 font-bold text-lg text-primary w-full px-2">
          <img
            src="https://img.usecurling.com/i?q=pan&color=orange&shape=fill"
            alt="Pelas Panelas"
            className="w-8 h-8 rounded-md"
          />
          <span className="truncate">Pelas Panelas</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-2">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/dashboard-principal'}
                  tooltip="Principal"
                >
                  <Link to="/dashboard-principal">
                    <LayoutDashboard />
                    <span>Principal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/desempenho'}
                  tooltip="Desempenho"
                >
                  <Link to="/desempenho">
                    <BarChart3 />
                    <span>Desempenho</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Cadastros
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/colaboradores'}
                  tooltip="Colaboradores"
                >
                  <Link to="/colaboradores">
                    <Users />
                    <span>Colaboradores</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/cargos-funcoes'}
                  tooltip="Cargos e Funções"
                >
                  <Link to="/cargos-funcoes">
                    <Briefcase />
                    <span>Cargos e Funções</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/tarefas'}
                  tooltip="Tarefas"
                >
                  <Link to="/tarefas">
                    <CheckSquare />
                    <span>Tarefas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Operacional
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/espelho-ponto'}
                  tooltip="Registros de Ponto"
                >
                  <Link to="/espelho-ponto">
                    <Clock />
                    <span>Registros de Ponto</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/ferias'}
                  tooltip="Registro de Férias"
                >
                  <Link to="/ferias">
                    <Calendar />
                    <span>Registro de Férias</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/folha-pagamento'}
                  tooltip="Folha de Pagamento"
                >
                  <Link to="/folha-pagamento">
                    <DollarSign />
                    <span>Folha de Pagamento</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Histórico
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/relatorios'}
                  tooltip="Relatórios"
                >
                  <Link to="/relatorios">
                    <FileText />
                    <span>Relatórios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/avaliacoes'}
                  tooltip="Avaliações"
                >
                  <Link to="/avaliacoes">
                    <Star />
                    <span>Avaliações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/bonificacoes'}
                  tooltip="Bonificações"
                >
                  <Link to="/bonificacoes">
                    <Gift />
                    <span>Bonificações</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t bg-muted/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === '/ponto'}
              tooltip="Acessar Ponto"
              className="font-semibold text-primary hover:text-primary"
            >
              <Link to="/ponto">
                <Fingerprint />
                <span>Acessar Ponto</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sair"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
              onClick={handleSignOut}
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
