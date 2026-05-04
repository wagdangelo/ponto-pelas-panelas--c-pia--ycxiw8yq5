import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase/client'

export function ManualPunchModal({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onSaved: () => void
}) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [employees, setEmployees] = useState<{ id: string; nome: string }[]>([])

  const [data, setData] = useState({
    funcionario_id: '',
    data: '',
    horario: '',
    tipo: 'Entrada',
  })

  useEffect(() => {
    if (open && employees.length === 0) {
      setLoadingUsers(true)
      supabase
        .from('funcionarios')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome')
        .then(({ data: empData }) => {
          if (empData) setEmployees(empData)
          setLoadingUsers(false)
        })
    }
  }, [open, employees.length])

  const handleSave = async () => {
    if (!data.funcionario_id || !data.data || !data.horario) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.from('pontos').insert({
        funcionario_id: data.funcionario_id,
        user_id: data.funcionario_id,
        tipo_ponto: data.tipo,
        data: data.data,
        horario: data.horario + ':00',
        data_hora: new Date(`${data.data}T${data.horario}:00`).toISOString(),
        status_validacao: 'manual',
      })

      if (error) throw error

      toast({ title: 'Ponto manual registrado com sucesso!' })
      onSaved()
      onOpenChange(false)
      setData({ funcionario_id: '', data: '', horario: '', tipo: 'Entrada' })
    } catch (err: any) {
      toast({ title: 'Erro ao registrar', description: err.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!saving) onOpenChange(o)
      }}
    >
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Registro Manual de Ponto</DialogTitle>
          <DialogDescription>
            Adicione um registro de ponto retroativo para um colaborador.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Colaborador</Label>
            <Select
              value={data.funcionario_id}
              onValueChange={(v) => setData({ ...data, funcionario_id: v })}
              disabled={loadingUsers}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue
                  placeholder={loadingUsers ? 'Carregando...' : 'Selecione o colaborador'}
                />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.nome || 'Sem nome'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tipo de Registro</Label>
            <Select value={data.tipo} onValueChange={(v) => setData({ ...data, tipo: v })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Saída Almoço">Saída Almoço</SelectItem>
                <SelectItem value="Retorno Almoço">Retorno Almoço</SelectItem>
                <SelectItem value="Saída">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={data.data}
                onChange={(e) => setData({ ...data, data: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Horário</Label>
              <Input
                type="time"
                value={data.horario}
                onChange={(e) => setData({ ...data, horario: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="rounded-xl">
            {saving ? 'Salvando...' : 'Salvar Registro'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
