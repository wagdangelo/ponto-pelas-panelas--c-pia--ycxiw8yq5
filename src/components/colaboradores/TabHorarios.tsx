import { FormField, FormItem, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const dias = [
  { id: 'segunda', label: 'Segunda-feira' },
  { id: 'terca', label: 'Terça-feira' },
  { id: 'quarta', label: 'Quarta-feira' },
  { id: 'quinta', label: 'Quinta-feira' },
  { id: 'sexta', label: 'Sexta-feira' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
]

export function TabHorarios({ form }: any) {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-3 gap-4 font-semibold text-sm px-2 text-muted-foreground uppercase tracking-wide">
        <div>Dia da Semana</div>
        <div>Entrada (HH:mm)</div>
        <div>Saída (HH:mm)</div>
      </div>
      {dias.map((dia) => (
        <div
          key={dia.id}
          className="grid grid-cols-3 gap-4 items-center bg-muted/20 p-3 rounded-lg border border-transparent hover:border-border transition-colors"
        >
          <div className="text-sm font-medium">{dia.label}</div>
          <FormField
            control={form.control}
            name={`horarios.${dia.id}.entrada`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="time" className="bg-background" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`horarios.${dia.id}.saida`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="time" className="bg-background" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  )
}
