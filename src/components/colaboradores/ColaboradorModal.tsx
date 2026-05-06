import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { manageFuncionario } from '@/services/funcionarios'
import { TabPessoal } from './TabPessoal'
import { TabProfissional } from './TabProfissional'
import { TabHorarios } from './TabHorarios'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres'),
  data_nascimento: z
    .string()
    .min(1, 'Obrigatório')
    .refine((d) => {
      const age = (new Date().getTime() - new Date(d).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      return age >= 18
    }, 'Deve ter pelo menos 18 anos'),
  cpf: z.string().min(14, 'CPF inválido'),
  telefone: z.string().min(14, 'Telefone inválido'),
  cep: z.string().min(9, 'CEP inválido'),
  rua: z.string().min(1, 'Obrigatório'),
  numero: z.string().min(1, 'Obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Obrigatório'),
  cidade: z.string().min(1, 'Obrigatório'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().optional(),
  cargo: z.string().min(1, 'Obrigatório'),
  role: z.string().min(1, 'Obrigatório'),
  data_admissao: z
    .string()
    .min(1, 'Obrigatório')
    .refine((d) => new Date(d) <= new Date(), 'Não pode ser data futura'),
  salario_base: z.coerce.number().min(0, 'Deve ser positivo'),
  tipo_contrato: z.string().min(1, 'Obrigatório'),
  status: z.string().min(1, 'Obrigatório'),
  horarios: z.record(z.object({ entrada: z.string().optional(), saida: z.string().optional() })),
})

const defaultHorarios = {
  segunda: { entrada: '09:00', saida: '18:00' },
  terca: { entrada: '09:00', saida: '18:00' },
  quarta: { entrada: '09:00', saida: '18:00' },
  quinta: { entrada: '09:00', saida: '18:00' },
  sexta: { entrada: '09:00', saida: '18:00' },
  sabado: { entrada: '', saida: '' },
  domingo: { entrada: '', saida: '' },
}

export function ColaboradorModal({ open, onClose, colab, onSuccess }: any) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: colab
      ? {
          ...colab,
          senha: '',
          horarios: colab.horarios || defaultHorarios,
          complemento: colab.complemento || '',
        }
      : {
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
          senha: '',
          cargo: '',
          role: 'Colaborador',
          data_admissao: '',
          salario_base: 0,
          tipo_contrato: 'CLT',
          status: 'Ativo',
          horarios: defaultHorarios,
        },
  })

  const handleCepBlur = async (e: any) => {
    const cep = e.target.value.replace(/\D/g, '')
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await res.json()
        if (data.erro) toast({ title: 'CEP não encontrado', variant: 'destructive' })
        else {
          form.setValue('rua', data.logradouro)
          form.setValue('bairro', data.bairro)
          form.setValue('cidade', data.localidade)
          form.clearErrors(['rua', 'bairro', 'cidade'])
        }
      } catch {
        toast({ title: 'Erro ao buscar CEP', variant: 'destructive' })
      }
    }
  }

  const onSubmit = async (data: any) => {
    if (!colab && (!data.senha || data.senha.length !== 6 || !/^\d+$/.test(data.senha))) {
      form.setError('senha', {
        type: 'manual',
        message: 'Senha deve ter exatos 6 dígitos numéricos',
      })
      return
    }
    if (colab && data.senha && (data.senha.length !== 6 || !/^\d+$/.test(data.senha))) {
      form.setError('senha', {
        type: 'manual',
        message: 'Senha deve ter exatos 6 dígitos numéricos',
      })
      return
    }

    try {
      setLoading(true)
      await manageFuncionario(colab ? 'update' : 'create', { ...data, id: colab?.id })
      toast({ title: `Colaborador ${colab ? 'atualizado' : 'cadastrado'} com sucesso` })
      onSuccess()
      onClose()
    } catch (e: any) {
      toast({ title: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={open ? undefined : onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {colab ? 'Editar Colaborador' : 'Novo Colaborador'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="pessoal" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="pessoal">Pessoal</TabsTrigger>
                <TabsTrigger value="profissional">Profissional</TabsTrigger>
                <TabsTrigger value="horarios">Horários</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
              </TabsList>
              <TabsContent value="pessoal">
                <TabPessoal form={form} onCepBlur={handleCepBlur} />
              </TabsContent>
              <TabsContent value="profissional">
                <TabProfissional form={form} isEditing={!!colab} />
              </TabsContent>
              <TabsContent value="horarios">
                <TabHorarios form={form} />
              </TabsContent>
              <TabsContent value="documentos">
                <div className="py-12 text-center space-y-4">
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Documentos: Contrato de Trabalho, Manual de Conduta, Descrição de Cargos,
                    Documentos Pessoais
                  </p>
                  <Button disabled variant="outline">
                    Upload (Em breve)
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
