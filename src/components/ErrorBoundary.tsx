import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4 font-sans">
          <div className="bg-background max-w-md w-full p-8 rounded-2xl shadow-xl border text-center space-y-5">
            <div className="flex justify-center">
              <div className="bg-destructive/10 p-4 rounded-full">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Ops! Algo deu errado.</h1>
              <p className="text-muted-foreground text-sm">
                Encontramos um problema inesperado na aplicação. Nossa equipe já foi notificada.
              </p>
            </div>
            <div className="pt-4">
              <Button
                onClick={() => window.location.reload()}
                className="w-full h-11 text-base font-medium gap-2 rounded-xl"
              >
                <RefreshCw size={18} />
                Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
