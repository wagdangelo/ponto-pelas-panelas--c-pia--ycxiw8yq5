import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import EmployeeModal from '@/components/admin/EmployeeModal'

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('Todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedColaborador, setSelectedColaborador] = useState<any>(null)

  const { session } = useAuth()
  const { toast } = useToast()

  const fetchColaboradores = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('funcionarios').select('*').order('nome')
    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os colaboradores',
        variant: 'destructive',
      })
    } else {
      setColaboradores(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchColaboradores()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este colaborador?')) return

    try {
      const { data, error } = await supabase.functions.invoke('manageUsers', {
        body: { action: 'delete', payload: { id } },
      })
      if (error || data?.status === 'error') throw error || new Error(data?.message)

      toast({ title: 'Sucesso', description: 'Colaborador deletado com sucesso' })
      fetchColaboradores()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao deletar',
        variant: 'destructive',
      })
    }
  }

  const filtered = colaboradores.filter((c) => {
    const matchesSearch =
      (c.nome?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (c.email?.toLowerCase() || '').includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'Todos' || c.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-[#f08c69] rounded-3xl p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-serif mb-4">
            Talentos &<br />
            Cultura
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Gerencie os colaboradores da sua organização com eficiência e estilo.
          </p>
          <div className="flex gap-8">
            <div>
              <div className="text-4xl font-serif">
                {colaboradores.filter((c) => c.status === 'Ativo').length}
              </div>
              <div className="text-sm font-semibold tracking-wider opacity-80 mt-1">ATIVOS</div>
            </div>
            <div>
              <div className="text-4xl font-serif">3</div>
              <div className="text-sm font-semibold tracking-wider opacity-80 mt-1">
                DEPARTAMENTOS
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full bg-white border border-border shadow-sm focus-visible:ring-1"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {['Todos', 'Ativo', 'Inativo'].map((s) => (
            <Button
              key={s}
              variant={filterStatus === s ? 'default' : 'secondary'}
              onClick={() => setFilterStatus(s)}
              className="rounded-full shadow-sm"
            >
              {s}
            </Button>
          ))}
          <Button
            className="rounded-full bg-black hover:bg-black/90 text-white gap-2 ml-auto shadow-sm"
            onClick={() => {
              setSelectedColaborador(null)
              setIsModalOpen(true)
            }}
          >
            <Plus size={18} /> Adicionar Colaborador
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-primary h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden bg-[#faf9f6]"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/10 shadow-sm">
                    <AvatarImage src={c.foto_url || ''} />
                    <AvatarFallback className="text-xl bg-primary/5 text-primary font-medium">
                      {c.nome?.substring(0, 2).toUpperCase() || 'UN'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2 items-center">
                    <Badge
                      variant="outline"
                      className={
                        c.status === 'Ativo'
                          ? 'bg-[#e2f0d9] text-[#558b2f] border-none font-medium px-3'
                          : 'bg-muted text-muted-foreground border-none font-medium px-3'
                      }
                    >
                      {c.status || 'Ativo'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-black/5"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedColaborador(c)
                            setIsModalOpen(true)
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2 text-muted-foreground" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-serif text-xl font-medium truncate text-foreground">
                    {c.nome}
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                    {c.cargo || 'Não definido'}
                  </p>
                </div>

                <div className="space-y-2.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 opacity-70" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 opacity-70" />
                    <span>{c.telefone || 'Sem telefone'}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 opacity-70" />
                    <span className="truncate">{c.cidade ? `${c.cidade}` : 'Sem endereço'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <EmployeeModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          colaborador={selectedColaborador}
          onSuccess={fetchColaboradores}
        />
      )}
    </div>
  )
}
