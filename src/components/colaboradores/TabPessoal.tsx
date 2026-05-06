import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { maskCPF, maskPhone, maskCEP } from '@/lib/masks'

export function TabPessoal({ form, onCepBlur }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <FormField
        control={form.control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo *</FormLabel>
            <FormControl>
              <Input placeholder="João da Silva" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="data_nascimento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Nascimento *</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cpf"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF *</FormLabel>
            <FormControl>
              <Input
                placeholder="000.000.000-00"
                {...field}
                onChange={(e) => field.onChange(maskCPF(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="telefone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone *</FormLabel>
            <FormControl>
              <Input
                placeholder="(00) 00000-0000"
                {...field}
                onChange={(e) => field.onChange(maskPhone(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cep"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEP *</FormLabel>
            <FormControl>
              <Input
                placeholder="00000-000"
                {...field}
                onBlur={(e) => {
                  field.onBlur()
                  onCepBlur(e)
                }}
                onChange={(e) => field.onChange(maskCEP(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="rua"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rua *</FormLabel>
            <FormControl>
              <Input placeholder="Nome da rua" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="numero"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número *</FormLabel>
            <FormControl>
              <Input placeholder="123" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="complemento"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Complemento</FormLabel>
            <FormControl>
              <Input placeholder="Apto 45" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bairro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bairro *</FormLabel>
            <FormControl>
              <Input placeholder="Centro" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cidade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade *</FormLabel>
            <FormControl>
              <Input placeholder="São Paulo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
