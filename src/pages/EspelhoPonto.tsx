import { useState, useEffect, useMemo, useCallback } from 'react'
import { format, endOfMonth, parseISO, differenceInMinutes } from 'date-fns'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  Calendar,
  CheckSquare,
  Clock,
  Download,
  Info,
  CheckCircle2,
  ExternalLink,
  ListTodo,
  Plus,
  FileEdit,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

function formatMinutes(mins: number) {
  if (isNaN(mins)) return '00:00'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function getStatusColor(status: string) {
  const normalized = status.toLowerCase()
  if (normalized === 'completo' || normalized === 'concluída' || normalized === 'concluida') {
    return 'text-emerald-500 dark:text-emerald-400'
  }
  if (normalized === 'pendente') return 'text-rose-500 dark:text-rose-400'
  if (normalized === 'em progresso' || normalized === 'em_progresso')
    return 'text-yellow-500 dark:text-yellow-400'
  if (normalized === 'incompleto' || normalized === 'falta')
    return 'text-orange-500 dark:text-orange-400'
  return 'text-muted-foreground'
}

function formatStatusDisplay(status: string) {
  if (status === 'concluida') return 'Concluída'
  if (status === 'em_progresso') return 'Em Progresso'
  return 'Pendente'
}

function formatPrazoDisplay(tipo: string, prazo: string) {
  if (tipo === 'tarefa_principal') {
    try {
      return format(parseISO(prazo), 'dd/MM/yyyy')
    } catch {
      return prazo
    }
  }
  return prazo
}

const initialFormState = {
  tipo: 'informativo',
  titulo: '',
  descricao: '',
  data: format(new Date(), 'yyyy-MM-dd'),
  funcionario_id: '',
  status: 'pendente',
  prazo: 'unica',
}

const initialAdjForm = {
  punch_date: format(new Date(), 'yyyy-MM-dd'),
  punch_time_in: '',
  punch_lunch_out: '',
  punch_lunch_in: '',
  punch_time_out: '',
  justification: '',
}

export default function EspelhoPonto() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [selectedFunc, setSelectedFunc] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'))

  const [pontos, setPontos] = useState<any[]>([])
  const [avisos, setAvisos] = useState<any[]>([])
  const [adjustments, setAdjustments] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNovoAvisoModal, setShowNovoAvisoModal] = useState(false)
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false)

  const [form, setForm] = useState(initialFormState)
  const [adjForm, setAdjForm] = useState(initialAdjForm)

  const isAdmin = profile && ['Admin', 'Gerente', 'admin', 'gerente'].includes(profile.role)

  useEffect(() => {
    if (!session?.user) return

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (error) throw error

        setProfile(data)

        if (['Admin', 'Gerente', 'admin', 'gerente'].includes(data.role)) {
          const { data: funcs, error: funcsError } = await supabase
            .from('funcionarios')
            .select('id, nome, cargo')
            .order('nome')
          if (funcsError) throw funcsError
          setFuncionarios(funcs || [])
          setSelectedFunc(data.id)
        } else {
          setSelectedFunc(session.user.id)
        }
      } catch (err: any) {
        setError('Erro ao carregar perfil: ' + err.message)
        setLoading(false)
      }
    }

    loadProfile()
  }, [session])

  const loadData = useCallback(async () => {
    if (!selectedFunc || !selectedMonth) return
    setLoading(true)
    setError(null)
    try {
      const start = `${selectedMonth}-01`
      const endD = endOfMonth(parseISO(start))
      const end = format(endD, 'yyyy-MM-dd')

      const [pontosRes, avisosRes, adjRes] = await Promise.all([
        supabase
          .from('pontos')
          .select('*')
          .eq('funcionario_id' as any, selectedFunc)
          .gte('data', start)
          .lte('data', end)
          .order('data_hora', { ascending: true }),
        supabase
          .from('avisos')
          .select('*')
          .eq('funcionario_id' as any, selectedFunc)
          .order('data', { ascending: false })
          .order('criado_em', { ascending: false }),
        supabase
          .from('punch_adjustments')
          .select('*')
          .eq('user_id', selectedFunc)
          .gte('punch_date', start)
          .lte('punch_date', end)
          .order('created_at', { ascending: false }),
      ])

      if (pontosRes.error) throw pontosRes.error
      if (avisosRes.error) throw avisosRes.error
      if (adjRes.error) throw adjRes.error

      setPontos(pontosRes.data || [])
      setAvisos(avisosRes.data || [])
      setAdjustments(adjRes.data || [])
    } catch (err: any) {
      setError('Erro ao carregar dados: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [selectedFunc, selectedMonth])

  useEffect(() => {
    loadData()
  }, [loadData])

  const loadAvisosOnly = async () => {
    if (!selectedFunc) return
    try {
      const { data, error } = await supabase
        .from('avisos')
        .select('*')
        .eq('funcionario_id' as any, selectedFunc)
        .order('data', { ascending: false })
        .order('criado_em', { ascending: false })
      if (error) throw error
      setAvisos(data || [])
    } catch (err: any) {
      console.error('Erro ao atualizar avisos:', err)
    }
  }

  const dailyCalculations = useMemo(() => {
    const groups: Record<string, any[]> = {}
    pontos.forEach((p) => {
      if (!p.data) return
      if (!groups[p.data]) groups[p.data] = []
      groups[p.data].push(p)
    })

    const rows: any[] = []
    let totalMinutesMonth = 0

    Object.keys(groups)
      .sort()
      .forEach((data) => {
        const dayPontos = groups[data]
        const entrada = dayPontos.find((p) => p.tipo_ponto === 'Entrada')
        const saidaAlmoco = dayPontos.find(
          (p) => p.tipo_ponto === 'Saída Almoço' || p.tipo_ponto === 'Saida Almoço',
        )
        const retornoAlmoco = dayPontos.find((p) => p.tipo_ponto === 'Retorno Almoço')
        const saida = dayPontos.find((p) => p.tipo_ponto === 'Saída' || p.tipo_ponto === 'Saida')

        if (entrada && saidaAlmoco && retornoAlmoco && saida) {
          const m1 = differenceInMinutes(
            parseISO(saidaAlmoco.data_hora),
            parseISO(entrada.data_hora),
          )
          const m2 = differenceInMinutes(
            parseISO(saida.data_hora),
            parseISO(retornoAlmoco.data_hora),
          )

          const totalMins = m1 + m2
          totalMinutesMonth += totalMins

          rows.push({
            data,
            entrada: entrada.horario || format(parseISO(entrada.data_hora), 'HH:mm'),
            saidaAlmoco: saidaAlmoco.horario || format(parseISO(saidaAlmoco.data_hora), 'HH:mm'),
            retornoAlmoco:
              retornoAlmoco.horario || format(parseISO(retornoAlmoco.data_hora), 'HH:mm'),
            saida: saida.horario || format(parseISO(saida.data_hora), 'HH:mm'),
            totalMins,
            status: 'Completo',
            completo: true,
          })
        } else {
          rows.push({
            data,
            completo: false,
          })
        }
      })

    return { rows, totalMinutesMonth }
  }, [pontos])

  const toggleAvisoStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'concluida' ? 'pendente' : 'concluida'
    setAvisos((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)))
    try {
      const { error } = await supabase.from('avisos').update({ status: newStatus }).eq('id', id)
      if (error) throw error
    } catch (err: any) {
      toast({ title: 'Erro', description: 'Falha ao atualizar status.', variant: 'destructive' })
      loadAvisosOnly()
    }
  }

  const handleExportPDF = () => {
    window.print()
  }

  const handleTipoChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      tipo: val,
      prazo:
        val === 'tarefa_dia'
          ? '12:00'
          : val === 'tarefa_principal'
            ? format(new Date(), 'yyyy-MM-dd')
            : 'unica',
    }))
  }

  const isFormValid = () => {
    if (!form.tipo || !form.titulo || !form.descricao || !form.funcionario_id) return false
    if (form.titulo.length > 50 || form.descricao.length > 500) return false
    if (form.tipo === 'informativo' && (!form.data || !form.prazo)) return false
    if (form.tipo === 'tarefa_dia' && (!form.prazo || !form.status)) return false
    if (form.tipo === 'tarefa_principal' && (!form.data || !form.prazo || !form.status))
      return false
    return true
  }

  const handleSaveAviso = async () => {
    if (!isFormValid()) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios corretamente.',
        variant: 'destructive',
      })
      return
    }

    let payloadData = form.data
    let payloadPrazo = form.prazo

    if (form.tipo === 'tarefa_dia') {
      payloadData = format(new Date(), 'yyyy-MM-dd')
    }

    try {
      const { error } = await supabase.from('avisos').insert([
        {
          tipo: form.tipo,
          titulo: form.titulo,
          descricao: form.descricao,
          data: payloadData,
          funcionario_id: form.funcionario_id,
          status: form.status,
          prazo: payloadPrazo,
          criado_por: session?.user?.id,
        },
      ])

      if (error) throw error

      toast({ title: 'Sucesso', description: 'Aviso criado com sucesso.' })
      setShowNovoAvisoModal(false)
      setForm(initialFormState)
      loadAvisosOnly()
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message || 'Erro ao criar aviso',
        variant: 'destructive',
      })
    }
  }

  const isAdjFormValid = () => {
    if (!adjForm.punch_date || !adjForm.justification) return false
    if (adjForm.justification.length < 10) return false
    if (adjForm.justification.length > 500) return false
    if (
      !adjForm.punch_time_in &&
      !adjForm.punch_lunch_out &&
      !adjForm.punch_lunch_in &&
      !adjForm.punch_time_out
    )
      return false
    return true
  }

  const handleSaveAdjustment = async () => {
    if (!isAdjFormValid()) {
      toast({
        title: 'Erro',
        description:
          'Preencha ao menos um horário e uma justificativa válida (mín. 10 caracteres).',
        variant: 'destructive',
      })
      return
    }

    try {
      const payload = {
        funcionario_id: session?.user?.id,
        punch_date: adjForm.punch_date,
        punch_time_in: adjForm.punch_time_in || null,
        punch_lunch_out: adjForm.punch_lunch_out || null,
        punch_lunch_in: adjForm.punch_lunch_in || null,
        punch_time_out: adjForm.punch_time_out || null,
        justification: adjForm.justification,
      }

      const { data, error } = await supabase
        .from('punch_adjustments')
        .insert([payload])
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Sucesso',
        description: `Solicitação enviada com sucesso. NSR: ${data.nsr}`,
      })
      setShowAdjustmentModal(false)
      setAdjForm(initialAdjForm)
      loadData()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const handleApproveReject = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('punch_adjustments')
        .update({
          status: newStatus,
          approved_by: session?.user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) throw error
      toast({
        title: 'Sucesso',
        description: `Solicitação ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'}.`,
      })
      loadData()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const mural = avisos.filter((a) => a.tipo === 'informativo')
  const tarefasDia = avisos.filter((a) => a.tipo === 'tarefa_dia')
  const principaisTarefas = avisos.filter((a) => a.tipo === 'tarefa_principal')

  const cardClasses =
    'bg-card/40 backdrop-blur-sm border-white/5 dark:border-white/10 shadow-xl p-6 rounded-xl transition-all duration-300 hover:shadow-2xl overflow-hidden flex flex-col'
  const tableHeaderClasses = 'bg-muted/50 font-semibold'
  const tableRowClasses =
    'border-b border-white/5 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors'
  const tableCellClasses = 'py-3 px-4'

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 pb-24">
      {/* HEADER E FILTROS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Espelho de Ponto</h1>
          <p className="text-muted-foreground mt-1">Visualize suas jornadas e quadro de avisos.</p>
        </div>

        <div className="flex flex-wrap items-end gap-4 print:hidden">
          {isAdmin && (
            <div className="space-y-1">
              <Label>Funcionário</Label>
              <Select value={selectedFunc} onValueChange={setSelectedFunc}>
                <SelectTrigger className="w-[200px] md:w-[240px] bg-background/50 border-white/10">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.nome} ({f.cargo || 'Colaborador'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1">
            <Label>Mês/Ano</Label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex h-9 w-[160px] rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="h-9 px-4 text-sm transition-colors"
          >
            <Download className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>

          {isAdmin && (
            <Button
              onClick={() => setShowNovoAvisoModal(true)}
              className="h-9 px-4 text-sm bg-primary text-primary-foreground transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" /> Cadastrar
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* GRID DE CONTEÚDO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA 1: Espelho (60%) + Ajustes + Tarefas do Dia */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-6">
          {/* Tabela de Ponto */}
          <div className={cn(cardClasses, 'print:border-none print:shadow-none print:p-0')}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Registros do Mês</h2>
            </div>

            <div className="overflow-x-auto flex-1">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : dailyCalculations.rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mb-3 opacity-20" />
                  <p>Nenhum ponto registrado para este período.</p>
                </div>
              ) : (
                <Table className="text-sm">
                  <TableHeader className={tableHeaderClasses}>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className={tableCellClasses}>Data</TableHead>
                      <TableHead className={tableCellClasses}>Entrada</TableHead>
                      <TableHead className={tableCellClasses}>Saída Almoço</TableHead>
                      <TableHead className={tableCellClasses}>Ret. Almoço</TableHead>
                      <TableHead className={tableCellClasses}>Saída</TableHead>
                      <TableHead className={tableCellClasses}>Total</TableHead>
                      <TableHead className={tableCellClasses}>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyCalculations.rows.map((row, idx) => (
                      <TableRow key={idx} className={tableRowClasses}>
                        {row.completo ? (
                          <>
                            <TableCell
                              className={cn(tableCellClasses, 'font-medium whitespace-nowrap')}
                            >
                              {format(parseISO(row.data), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell className={tableCellClasses}>{row.entrada}</TableCell>
                            <TableCell className={tableCellClasses}>{row.saidaAlmoco}</TableCell>
                            <TableCell className={tableCellClasses}>{row.retornoAlmoco}</TableCell>
                            <TableCell className={tableCellClasses}>{row.saida}</TableCell>
                            <TableCell className={cn(tableCellClasses, 'font-semibold')}>
                              {formatMinutes(row.totalMins)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                tableCellClasses,
                                'font-medium',
                                getStatusColor(row.status),
                              )}
                            >
                              {row.status}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell
                              className={cn(tableCellClasses, 'font-medium whitespace-nowrap')}
                            >
                              {format(parseISO(row.data), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell
                              colSpan={6}
                              className={cn(
                                tableCellClasses,
                                'bg-amber-50/50 dark:bg-amber-950/20',
                              )}
                            >
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-amber-700 dark:text-amber-400 text-sm">
                                <span className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 shrink-0" />
                                  Ponto incompleto. Procure o gerente.
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border border-white/10 hover:bg-white/5 shrink-0 print:hidden"
                                  onClick={() => {
                                    setAdjForm({ ...initialAdjForm, punch_date: row.data })
                                    setShowAdjustmentModal(true)
                                  }}
                                >
                                  Solicitar Ajuste
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {!loading && dailyCalculations.rows.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5 dark:border-white/10 flex justify-between items-center print:border-t-black">
                <span className="font-semibold text-sm">Total de Horas Trabalhadas:</span>
                <span className="font-bold text-lg text-primary">
                  {formatMinutes(dailyCalculations.totalMinutesMonth)} hrs
                </span>
              </div>
            )}
          </div>

          {/* Tabela de Ajustes de Ponto */}
          <div className={cn(cardClasses, 'print:hidden')}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Solicitações de Ajuste (NSR)</h2>
              </div>
              {session?.user?.id === selectedFunc && (
                <Button size="sm" variant="outline" onClick={() => setShowAdjustmentModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Ajuste
                </Button>
              )}
            </div>

            <div className="overflow-x-auto flex-1">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : adjustments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <FileEdit className="h-10 w-10 mb-3 opacity-20" />
                  <p>Nenhuma solicitação de ajuste.</p>
                </div>
              ) : (
                <Table className="text-sm">
                  <TableHeader className={tableHeaderClasses}>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className={tableCellClasses}>NSR</TableHead>
                      <TableHead className={tableCellClasses}>Data</TableHead>
                      <TableHead className={tableCellClasses}>Horários Solicitados</TableHead>
                      <TableHead className={tableCellClasses}>Status</TableHead>
                      {isAdmin && <TableHead className={tableCellClasses}>Ações</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adjustments.map((adj) => (
                      <TableRow key={adj.id} className={tableRowClasses}>
                        <TableCell className={cn(tableCellClasses, 'font-medium')}>
                          #{adj.nsr}
                        </TableCell>
                        <TableCell className={tableCellClasses}>
                          {format(parseISO(adj.punch_date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell className={tableCellClasses}>
                          <div className="text-xs space-y-1">
                            <div>
                              <span className="font-semibold">In:</span>{' '}
                              {adj.punch_time_in || '--:--'} |{' '}
                              <span className="font-semibold">L-Out:</span>{' '}
                              {adj.punch_lunch_out || '--:--'} |{' '}
                              <span className="font-semibold">L-In:</span>{' '}
                              {adj.punch_lunch_in || '--:--'} |{' '}
                              <span className="font-semibold">Out:</span>{' '}
                              {adj.punch_time_out || '--:--'}
                            </div>
                            <div className="text-muted-foreground italic">
                              "{adj.justification}"
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={tableCellClasses}>
                          <Badge
                            variant={
                              adj.status === 'approved'
                                ? 'default'
                                : adj.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {adj.status === 'approved'
                              ? 'Aprovado'
                              : adj.status === 'rejected'
                                ? 'Rejeitado'
                                : 'Pendente'}
                          </Badge>
                        </TableCell>
                        {isAdmin && (
                          <TableCell className={tableCellClasses}>
                            {adj.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveReject(adj.id, 'approved')}
                                >
                                  Aprovar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleApproveReject(adj.id, 'rejected')}
                                >
                                  Rejeitar
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {/* Tarefas do Dia */}
          <div className={cn(cardClasses, 'print:hidden')}>
            <div className="flex items-center gap-2 mb-4">
              <ListTodo className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Tarefas do Dia</h2>
            </div>

            <div className="overflow-x-auto flex-1">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : tarefasDia.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-full">
                  <CheckCircle2 className="h-10 w-10 mb-2 text-emerald-500 opacity-50" />
                  <p>Nenhuma tarefa para hoje!</p>
                </div>
              ) : (
                <Table className="text-sm">
                  <TableHeader className={tableHeaderClasses}>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className={cn(tableCellClasses, 'w-[60%]')}>Tarefa</TableHead>
                      <TableHead className={tableCellClasses}>Prazo</TableHead>
                      <TableHead className={tableCellClasses}>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tarefasDia.map((item) => {
                      const isDone = item.status === 'concluida'
                      return (
                        <TableRow
                          key={item.id}
                          className={cn(tableRowClasses, isDone && 'opacity-60 bg-muted/20')}
                        >
                          <TableCell className={cn(tableCellClasses, 'font-medium')}>
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={isDone}
                                onCheckedChange={() => toggleAvisoStatus(item.id, item.status)}
                                className="mt-0.5 scale-100 hover:scale-110 transition-transform"
                              />
                              <span className={isDone ? 'line-through text-muted-foreground' : ''}>
                                {item.titulo}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className={cn(tableCellClasses, 'whitespace-nowrap')}>
                            {formatPrazoDisplay(item.tipo, item.prazo)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              tableCellClasses,
                              'font-medium',
                              getStatusColor(item.status),
                            )}
                          >
                            {formatStatusDisplay(item.status)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA 2: Mural (40%) + Principais Tarefas */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-6 print:hidden">
          {/* Mural de Informativos */}
          <div
            className={cn(
              cardClasses,
              'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800',
            )}
          >
            <div className="flex items-center gap-2 mb-4 text-blue-800 dark:text-blue-300">
              <Info className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Mural de Informativos</h2>
            </div>

            <div className="grid gap-3 flex-1">
              {loading ? (
                <>
                  <Skeleton className="h-24 w-full bg-white/50" />
                  <Skeleton className="h-24 w-full bg-white/50" />
                </>
              ) : mural.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-full">
                  <Info className="h-10 w-10 mb-2 opacity-30" />
                  <p>Nenhum aviso no momento.</p>
                </div>
              ) : (
                mural.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/80 dark:bg-black/40 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white/20 dark:border-white/5 transition-all hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-1.5 gap-2">
                      <h4 className="font-semibold text-sm leading-tight">{item.titulo}</h4>
                      <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                        {format(parseISO(item.data), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.descricao}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium"
                        >
                          Ver Mais
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{item.titulo}</DialogTitle>
                          <DialogDescription>
                            Publicado em {format(parseISO(item.data), 'dd/MM/yyyy')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 text-sm leading-relaxed">{item.descricao}</div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Principais Tarefas */}
          <div className={cardClasses}>
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Principais Tarefas</h2>
            </div>

            <div className="overflow-x-auto flex-1">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : principaisTarefas.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-full">
                  <CheckCircle2 className="h-10 w-10 mb-2 text-emerald-500 opacity-50" />
                  <p>Nenhuma tarefa pendente!</p>
                </div>
              ) : (
                <Table className="text-sm">
                  <TableHeader className={tableHeaderClasses}>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className={cn(tableCellClasses, 'w-[50%]')}>Tarefa</TableHead>
                      <TableHead className={tableCellClasses}>Prazo</TableHead>
                      <TableHead className={tableCellClasses}>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {principaisTarefas.map((item) => {
                      const isDone = item.status === 'concluida'
                      return (
                        <TableRow
                          key={item.id}
                          className={cn(tableRowClasses, isDone && 'opacity-60 bg-muted/20')}
                        >
                          <TableCell className={cn(tableCellClasses, 'font-medium')}>
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={isDone}
                                onCheckedChange={() => toggleAvisoStatus(item.id, item.status)}
                                className="mt-0.5 scale-100 hover:scale-110 transition-transform"
                              />
                              <span className={isDone ? 'line-through text-muted-foreground' : ''}>
                                {item.titulo}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className={cn(tableCellClasses, 'whitespace-nowrap')}>
                            {formatPrazoDisplay(item.tipo, item.prazo)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              tableCellClasses,
                              'font-medium',
                              getStatusColor(item.status),
                            )}
                          >
                            {formatStatusDisplay(item.status)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CADASTRAR AVISO */}
      {isAdmin && (
        <Dialog open={showNovoAvisoModal} onOpenChange={setShowNovoAvisoModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Aviso</DialogTitle>
              <DialogDescription>
                Crie um informativo, tarefa do dia ou tarefa principal
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>
                  Tipo <span className="text-red-500">*</span>
                </Label>
                <Select value={form.tipo} onValueChange={handleTipoChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informativo">Informativo</SelectItem>
                    <SelectItem value="tarefa_dia">Tarefa do Dia</SelectItem>
                    <SelectItem value="tarefa_principal">Tarefa Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Título <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: Novo Uniforme"
                  maxLength={50}
                />
                <div className="text-right text-[10px] text-muted-foreground">
                  {form.titulo.length}/50
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  Descrição <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  placeholder="Detalhes do aviso ou tarefa..."
                  maxLength={500}
                  className="resize-none h-20"
                />
                <div className="text-right text-[10px] text-muted-foreground">
                  {form.descricao.length}/500
                </div>
              </div>

              {form.tipo !== 'tarefa_dia' && (
                <div className="space-y-2">
                  <Label>
                    Data <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                  />
                </div>
              )}

              {form.tipo === 'tarefa_dia' && (
                <div className="space-y-2">
                  <Label>
                    Prazo (Horário) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="time"
                    value={form.prazo}
                    onChange={(e) => setForm({ ...form, prazo: e.target.value })}
                  />
                </div>
              )}

              {form.tipo === 'tarefa_principal' && (
                <div className="space-y-2">
                  <Label>
                    Prazo (Data limite) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={form.prazo}
                    onChange={(e) => setForm({ ...form, prazo: e.target.value })}
                  />
                </div>
              )}

              {form.tipo === 'informativo' && (
                <div className="space-y-2">
                  <Label>
                    Prazo <span className="text-red-500">*</span>
                  </Label>
                  <Select value={form.prazo} onValueChange={(v) => setForm({ ...form, prazo: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unica">Única</SelectItem>
                      <SelectItem value="diaria">Diária</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>
                  Atribuir a <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.funcionario_id}
                  onValueChange={(v) => setForm({ ...form, funcionario_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funcionário" />
                  </SelectTrigger>
                  <SelectContent>
                    {funcionarios.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.tipo !== 'informativo' && (
                <div className="space-y-2">
                  <Label>
                    Status Inicial <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em_progresso">Em Progresso</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNovoAvisoModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveAviso} disabled={!isFormValid()}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL SOLICITAR AJUSTE */}
      <Dialog open={showAdjustmentModal} onOpenChange={setShowAdjustmentModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Solicitar Ajuste de Ponto</DialogTitle>
            <DialogDescription>
              Você não registrou o ponto hoje ou há campos incompletos. Preencha os horários que
              faltaram e justifique.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>
                Data do Ponto <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={adjForm.punch_date}
                onChange={(e) => setAdjForm({ ...adjForm, punch_date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Entrada (opcional)</Label>
                <Input
                  type="time"
                  value={adjForm.punch_time_in}
                  onChange={(e) => setAdjForm({ ...adjForm, punch_time_in: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Saída Almoço (opcional)</Label>
                <Input
                  type="time"
                  value={adjForm.punch_lunch_out}
                  onChange={(e) => setAdjForm({ ...adjForm, punch_lunch_out: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Retorno Almoço (opcional)</Label>
                <Input
                  type="time"
                  value={adjForm.punch_lunch_in}
                  onChange={(e) => setAdjForm({ ...adjForm, punch_lunch_in: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Saída (opcional)</Label>
                <Input
                  type="time"
                  value={adjForm.punch_time_out}
                  onChange={(e) => setAdjForm({ ...adjForm, punch_time_out: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Justificativa <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={adjForm.justification}
                onChange={(e) => setAdjForm({ ...adjForm, justification: e.target.value })}
                placeholder="Ex: Esqueci de bater o ponto na volta do almoço..."
                maxLength={500}
                className="resize-none h-20"
              />
              <div className="text-right text-[10px] text-muted-foreground">
                {adjForm.justification.length}/500 (Mínimo 10 caracteres)
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustmentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAdjustment}>Enviar Solicitação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BOTOES FLUTUANTES */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50 print:hidden">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-background/95 backdrop-blur-md border border-white/5 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-medium hover:bg-muted"
        >
          <Clock className="w-4 h-4 text-primary" />
          Voltar para Ponto
        </Link>
        <a
          href="https://pelaspanelas.goskip.app/ponto"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-background/95 backdrop-blur-md border border-white/5 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-medium hover:bg-muted"
        >
          <ExternalLink className="w-4 h-4 text-primary" />
          Acesso ao Portal
        </a>
      </div>
    </div>
  )
}
