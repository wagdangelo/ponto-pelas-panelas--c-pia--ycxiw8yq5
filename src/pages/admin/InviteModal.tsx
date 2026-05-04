import { useState } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { Mail, Send } from 'lucide-react'

export function InviteModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const handleInvite = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'E-mail inválido',
        description: 'Insira um e-mail válido.',
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Convite enviado com sucesso!',
      description: `Um e-mail de acesso foi enviado para ${email}.`,
    })

    setEmail('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="text-primary" size={22} />
            Convidar Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Insira o e-mail do colaborador que deseja convidar para acessar o sistema de ponto.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <Label htmlFor="email" className="text-foreground font-medium">
            Endereço de E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="colaborador@pelaspanelas.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl"
            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancelar
          </Button>
          <Button onClick={handleInvite} className="gap-2 rounded-xl shadow-sm">
            <Send size={16} />
            Enviar Convite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
