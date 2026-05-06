import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MoreVertical, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function ColaboradorCard({ colab, onEdit, onDelete }: any) {
  const isAtivo = colab.status === 'Ativo'

  return (
    <Card className="p-5 flex flex-col h-full relative group hover:shadow-md transition-all duration-200 border-border/50">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Badge
          variant={isAtivo ? 'default' : 'secondary'}
          className={isAtivo ? 'bg-[#CDE3B4] text-[#2c1810] hover:bg-[#CDE3B4]/80' : ''}
        >
          {colab.status}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(colab)} className="cursor-pointer">
              <Edit size={14} className="mr-2 text-muted-foreground" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(colab)}
              className="cursor-pointer text-destructive focus:bg-destructive/10"
            >
              <Trash2 size={14} className="mr-2" /> Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4 mb-5 mt-2">
        <Avatar className="h-16 w-16 border shadow-sm">
          <AvatarImage src={colab.foto_url} />
          <AvatarFallback className="bg-primary/5 text-primary text-xl font-serif">
            {colab.nome?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-serif text-xl leading-tight line-clamp-1" title={colab.nome}>
            {colab.nome}
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">
            {colab.cargo}
          </p>
        </div>
      </div>

      <div className="mt-auto space-y-2.5 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
        <div className="flex items-center gap-2.5 truncate" title={colab.email}>
          <Mail size={14} className="shrink-0" /> <span className="truncate">{colab.email}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone size={14} className="shrink-0" /> {colab.telefone}
        </div>
        <div className="flex items-center gap-2.5 truncate" title={colab.cidade}>
          <MapPin size={14} className="shrink-0" />{' '}
          <span className="truncate">
            {colab.cidade} — {colab.role}
          </span>
        </div>
      </div>
    </Card>
  )
}
