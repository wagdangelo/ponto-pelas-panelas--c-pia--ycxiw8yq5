import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Info } from 'lucide-react'

export function AdminClockCard() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="bg-muted/40 border-none shadow-sm flex flex-col justify-center h-full min-h-[320px] relative overflow-hidden rounded-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-8 z-10">
        <div className="space-y-2">
          <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight tabular-nums font-display">
            {format(now, 'HH:mm:ss')}
          </div>
          <div className="text-lg md:text-xl text-muted-foreground capitalize font-medium">
            {format(now, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </div>
        </div>

        <div className="bg-background/90 backdrop-blur-sm px-5 py-4 rounded-xl border border-border/50 shadow-sm max-w-sm w-full flex items-start gap-3 transition-all hover:shadow-md">
          <Info className="text-primary shrink-0 mt-0.5" size={18} />
          <p className="text-sm font-medium text-foreground text-left leading-snug">
            Visão Administrativa: Gerencie os registros ao lado.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
