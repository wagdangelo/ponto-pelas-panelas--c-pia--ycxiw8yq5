import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

export default function Ponto() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto py-8 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Ponto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Funcionalidade de câmera e geolocalização para {user?.email}.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
