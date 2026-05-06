import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SelectField = ({ form, name, label, options }: any) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} value={field.value || ''}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((o: any) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
)

export function TabProfissional({ form, isEditing }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email *</FormLabel>
            <FormControl>
              <Input type="email" placeholder="email@empresa.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="senha"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Senha {isEditing ? '(Opcional)' : '*'}</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="6 dígitos numéricos"
                maxLength={6}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cargo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cargo *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Desenvolvedor" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <SelectField
        form={form}
        name="role"
        label="Regra de Acesso *"
        options={['Admin', 'Gerente', 'Colaborador']}
      />
      <FormField
        control={form.control}
        name="data_admissao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Admissão *</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="salario_base"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salário Base (R$) *</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" min="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <SelectField
        form={form}
        name="tipo_contrato"
        label="Tipo de Contrato *"
        options={['CLT', 'PJ', 'Estágio']}
      />
      <SelectField
        form={form}
        name="status"
        label="Status *"
        options={['Ativo', 'Desligado', 'Férias']}
      />
    </div>
  )
}
