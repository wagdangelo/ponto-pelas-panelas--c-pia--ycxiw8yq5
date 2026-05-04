import { useState, useEffect, useCallback } from 'react'
import { Plus, AlertCircle, Clock, User } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase/client'
import { ManualPunchModal } from './ManualPunchModal'

type GroupedPunch = {
  id: string
  name: string
  dateStr: string
  entrada: string
  saida: string
}

export function AdminHistoryCard() {
  const [history, setHistory] = useState<GroupedPunch[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'empty' | 'success'>('loading')
  const [isManualOpen, setIsManualOpen] = useState(false)

  const fetchHistory = useCallback(async () => {
    setStatus('loading')
    try {
      const { data, error } = await supabase
        .from('pontos')
        .select('id, data, horario, tipo_ponto, funcionarios(nome)')
        .order('data_hora', { ascending: false })
        .limit(50)

      if (error) throw error

      if (!data || data.length === 0) {
        setStatus('empty')
        return
      }

      const groups: Record<string, GroupedPunch> = {}

      data.forEach((p) => {
        // @ts-expect-error mapping relation return
        const name = p.funcionarios?.nome || 'Colaborador'
        const key = `${p.data}-${name}`

        if (!groups[key]) {
          const parts = p.data.split('-')
          const dateStr = parts.length === 3 ? `${parts[2]}/${parts[1]}` : p.data
          groups[key] = { id: key, name, dateStr, entrada: '??:??', saida: '??:??' }
        }

        const hm = p.horario?.substring(0, 5) || '??:??'
        if (p.tipo_ponto === 'Entrada') {
          groups[key].entrada = hm
        } else if (
          p.tipo_ponto?.toLowerCase().includes('saída') ||
          p.tipo_ponto?.toLowerCase().includes('saida')
        ) {
          groups[key].saida = hm
        } else if (groups[key].entrada === '??:??') {
          groups[key].entrada = hm // fallback map to entry
        }
      })

      const arr = Object.values(groups).slice(0, 5)

      if (arr.length === 0) {
        setStatus('empty')
      } else {
        setHistory(arr)
        setStatus('success')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return (
    <>
      <Card className="bg-background border shadow-sm h-full flex flex-col min-h-[320px] rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b bg-muted/10 rounded-t-2xl">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Histórico Recente
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setIsManualOpen(true)}
            className="h-8 font-semibold shadow-sm rounded-lg"
          >
            <Plus size={16} className="mr-1" /> Manual
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col pt-4">
          {status === 'loading' && (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-[56px] w-full rounded-xl bg-muted/60" />
              ))}
            </div>
          )}

          {status === 'error' && (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle size={24} className="text-destructive" />
              </div>
              <p className="font-medium">Erro ao carregar o histórico.</p>
              <Button variant="outline" size="sm" onClick={fetchHistory}>
                Tentar novamente
              </Button>
            </div>
          )}

          {status === 'empty' && (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center space-y-3">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                <Clock size={28} className="text-muted-foreground/60" />
              </div>
              <p className="font-medium">Nenhum registro de ponto.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-muted/20 rounded-xl border border-muted/60 hover:bg-muted/40 hover:border-border transition-colors group"
                >
                  <div className="flex items-center gap-2.5 mb-2 sm:mb-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm">
                      <User size={14} />
                    </div>
                    <div className="font-semibold text-sm text-foreground line-clamp-1">
                      {item.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium pl-10 sm:pl-0">
                    <span className="bg-background px-2 py-0.5 rounded-md border shadow-sm text-xs font-bold text-muted-foreground">
                      {item.dateStr}
                    </span>
                    <span className="text-foreground tracking-tight bg-background/50 px-2 py-0.5 rounded-md">
                      {item.entrada} <span className="text-muted-foreground px-0.5">&rarr;</span>{' '}
                      {item.saida}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <ManualPunchModal open={isManualOpen} onOpenChange={setIsManualOpen} onSaved={fetchHistory} />
    </>
  )
}
