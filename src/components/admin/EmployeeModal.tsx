import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Upload } from 'lucide-react'

const formatCPF = (v: string) => {
  v = v.replace(/\D/g, '')
  if (v.length <= 11) {
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return v
}

const formatPhone = (v: string) => {
  v = v.replace(/\D/g, '')
  if (v.length <= 11) {
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
    v = v.replace(/(\d{5})(\d)/, '$1-$2')
  }
  return v
}

const formatMoney = (v: string) => {
  v = v.replace(/\D/g, '')
  return (Number(v) / 100).toFixed(2)
}

const defaultHorarios = {
  segunda: { entrada: '09:00', saida: '18:00' },
  terca: { entrada: '09:00', saida: '18:00' },
  quarta: { entrada: '09:00', saida: '18:00' },
  quinta: { entrada: '09:00', saida: '18:00' },
  sexta: { entrada: '09:00', saida: '18:00' },
  sabado: { entrada: '', saida: '' },
  domingo: { entrada: '', saida: '' },
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  colaborador?: any
  onSuccess: () => void
}

export default function EmployeeModal({ open, onOpenChange, colaborador, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('pessoal')
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    cpf: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    email: '',
    password: '',
    cargo: '',
    role: 'Colaborador',
    data_admissao: '',
    salario_base: '',
    tipo_contrato: 'CLT',
    status: 'Ativo',
    horarios: defaultHorarios,
  })

  useEffect(() => {
    if (colaborador) {
      setFormData({
        ...formData,
        ...colaborador,
        password: '',
        salario_base: colaborador.salario_base ? String(colaborador.salario_base) : '',
        horarios: colaborador.horarios || defaultHorarios,
      })
    } else {
      setFormData({
        nome: '',
        data_nascimento: '',
        cpf: '',
        telefone: '',
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        email: '',
        password: '',
        cargo: '',
        role: 'Colaborador',
        data_admissao: '',
        salario_base: '',
        tipo_contrato: 'CLT',
        status: 'Ativo',
        horarios: defaultHorarios,
      })
    }
  }, [colaborador, open])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    let val = value
    if (name === 'cpf') val = formatCPF(value)
    if (name === 'telefone') val = formatPhone(value)
    if (name === 'salario_base') val = formatMoney(value)
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleCEPBlur = async () => {
    const cep = formData.cep.replace(/\D/g, '')
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await res.json()
        if (data.erro) {
          toast({ title: 'Aviso', description: 'CEP não encontrado', variant: 'destructive' })
        } else {
          setFormData((prev) => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
          }))
        }
      } catch (err) {
        toast({ title: 'Aviso', description: 'Erro ao buscar CEP', variant: 'destructive' })
      }
    }
  }

  const handleHorarioChange = (dia: string, campo: 'entrada' | 'saida', valor: string) => {
    setFormData((prev) => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          ...(prev.horarios as any)[dia],
          [campo]: valor,
        },
      },
    }))
  }

  const handleSubmit = async () => {
    if (!formData.nome || formData.nome.length < 3)
      return toast({ title: 'Erro', description: 'Nome inválido', variant: 'destructive' })
    if (!formData.cpf)
      return toast({ title: 'Erro', description: 'CPF obrigatório', variant: 'destructive' })
    if (!formData.email)
      return toast({ title: 'Erro', description: 'Email obrigatório', variant: 'destructive' })
    if (!colaborador && (!formData.password || formData.password.length < 6))
      return toast({
        title: 'Erro',
        description: 'A senha deve ter no mínimo 6 caracteres',
        variant: 'destructive',
      })

    setLoading(true)
    try {
      const payload = {
        ...formData,
        salario_base: formData.salario_base ? Number(formData.salario_base) : null,
      }
      if (colaborador) (payload as any).id = colaborador.id

      const { data, error } = await supabase.functions.invoke('manageUsers', {
        body: { action: colaborador ? 'update' : 'create', payload },
      })

      if (error || data?.status === 'error') throw error || new Error(data?.message)

      toast({
        title: 'Sucesso',
        description: `Colaborador ${colaborador ? 'atualizado' : 'cadastrado'} com sucesso`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      const msg = err.message || 'Erro ao salvar colaborador. Tente novamente'
      toast({
        title: 'Erro',
        description: msg.includes('duplicate key') ? 'Email ou CPF já cadastrado' : msg,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{colaborador ? 'Editar' : 'Adicionar'} Colaborador</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pessoal">Pessoal</TabsTrigger>
            <TabsTrigger value="profissional">Profissional</TabsTrigger>
            <TabsTrigger value="horarios">Horários</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="pessoal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo *</Label>
                  <Input name="nome" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Data de Nascimento *</Label>
                  <Input
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>CPF *</Label>
                  <Input
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    maxLength={14}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone *</Label>
                  <Input
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    maxLength={15}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>CEP *</Label>
                  <Input
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    onBlur={handleCEPBlur}
                    maxLength={9}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rua *</Label>
                  <Input name="rua" value={formData.rua} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Número *</Label>
                  <Input name="numero" value={formData.numero} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Complemento</Label>
                  <Input name="complemento" value={formData.complemento} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>Bairro *</Label>
                  <Input name="bairro" value={formData.bairro} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Cidade *</Label>
                  <Input name="cidade" value={formData.cidade} onChange={handleChange} required />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profissional" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Senha {colaborador ? '(Deixe em branco para não alterar)' : '*'}</Label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo *</Label>
                  <Input name="cargo" value={formData.cargo} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Regra (Nível de Acesso) *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) => setFormData((p) => ({ ...p, role: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Gerente">Gerente</SelectItem>
                      <SelectItem value="Colaborador">Colaborador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data de Admissão *</Label>
                  <Input
                    type="date"
                    name="data_admissao"
                    value={formData.data_admissao}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salário-Base (R$) *</Label>
                  <Input
                    name="salario_base"
                    value={formData.salario_base}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Contrato *</Label>
                  <Select
                    value={formData.tipo_contrato}
                    onValueChange={(v) => setFormData((p) => ({ ...p, tipo_contrato: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLT">CLT</SelectItem>
                      <SelectItem value="PJ">PJ</SelectItem>
                      <SelectItem value="Estágio">Estágio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData((p) => ({ ...p, status: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Férias">Férias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="horarios" className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Dia da Semana</th>
                      <th className="px-4 py-3 font-medium">Entrada</th>
                      <th className="px-4 py-3 font-medium">Saída</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(formData.horarios).map(([dia, hrs]) => (
                      <tr key={dia} className="border-t">
                        <td className="px-4 py-3 capitalize">{dia}</td>
                        <td className="px-4 py-3">
                          <Input
                            type="time"
                            value={(hrs as any).entrada}
                            onChange={(e) => handleHorarioChange(dia, 'entrada', e.target.value)}
                            className="w-32"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="time"
                            value={(hrs as any).saida}
                            onChange={(e) => handleHorarioChange(dia, 'saida', e.target.value)}
                            className="w-32"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="documentos" className="space-y-4">
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Documentos: Contrato de Trabalho, Manual de Conduta, Descrição de Cargos,
                  Documentos Pessoais
                </p>
                <Button disabled variant="outline" className="gap-2">
                  <Upload size={16} /> Upload (Em breve)
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
