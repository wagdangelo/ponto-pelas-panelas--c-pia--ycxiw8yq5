import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ExternalLink, Clock, Camera, Image as ImageIcon } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { AdminDashboard } from './admin/AdminDashboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Ponto = {
  id: string
  tipo_ponto: string
  data_hora: string
  horario: string
  data: string
  foto_url?: string
}

const PONTOS_ORDER = ['Entrada', 'Saída Almoço', 'Retorno Almoço', 'Saida']

export default function Dashboard() {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [currentTime, setCurrentTime] = useState(new Date())
  const [pontos, setPontos] = useState<Ponto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Estados do Modal de Câmera e Confirmação
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pendingPontoType, setPendingPontoType] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const userName = user?.user_metadata?.name || user?.email || 'Colaborador'

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchPontos = useCallback(async () => {
    if (!user) return

    setLoading(true)
    const today = format(new Date(), 'yyyy-MM-dd')

    const { data, error } = await supabase
      .from('pontos')
      .select('*')
      .eq('funcionario_id', user.id)
      .eq('data', today)
      .order('data_hora', { ascending: true })

    if (error) {
      console.error(error)
      toast({
        title: 'Erro ao buscar pontos',
        description: error.message,
        variant: 'destructive',
      })
    } else if (data) {
      setPontos(data as Ponto[])
    }

    setLoading(false)
  }, [user, toast])

  useEffect(() => {
    fetchPontos()

    if (!user) return

    const channel = supabase
      .channel('pontos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pontos',
          filter: `funcionario_id=eq.${user.id}`,
        },
        () => {
          fetchPontos()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchPontos, user])

  // Limpa os recursos da câmera ao desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  const getTurno = (timeStr: string) => {
    if (!timeStr) return 'DIA'
    const hour = parseInt(timeStr.substring(0, 2), 10)
    if (hour >= 6 && hour <= 12) return 'DIA'
    return 'NOITE'
  }

  const getNextPontoType = () => {
    if (pontos.length === 0) return 'Entrada'
    const lastType = pontos[pontos.length - 1].tipo_ponto
    const index = PONTOS_ORDER.indexOf(lastType)
    if (index >= 0 && index < PONTOS_ORDER.length - 1) {
      return PONTOS_ORDER[index + 1]
    }
    return null
  }

  const handleRegisterClick = (tipo: string) => {
    if (tipo === 'Entrada' || tipo === 'Saida') {
      openCamera(tipo)
    } else {
      setPendingPontoType(tipo)
      setIsConfirmOpen(true)
    }
  }

  const openCamera = async (tipo: string) => {
    setPendingPontoType(tipo)
    setIsCameraOpen(true)
    setCameraError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch((e) => console.error('Error playing video:', e))
      }
    } catch (err: any) {
      console.error(err)
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Permissão de câmera negada. Ative nas configurações do navegador.')
      } else {
        setCameraError('Não conseguimos acessar a câmera. Tente novamente.')
      }
    }
  }

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCameraOpen(false)
    setPendingPontoType(null)
  }

  const onVideoRef = useCallback(
    (node: HTMLVideoElement) => {
      if (node && streamRef.current) {
        node.srcObject = streamRef.current
        node.play().catch((e) => console.error('Error playing video:', e))
      }
      videoRef.current = node
    },
    [isCameraOpen],
  )

  const getCoordinates = async () => {
    let latitude: number | null = null
    let longitude: number | null = null

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: true,
        })
      })
      latitude = pos.coords.latitude
      longitude = pos.coords.longitude

      if (latitude !== null && longitude !== null) {
        localStorage.setItem('user_lat', latitude.toString())
        localStorage.setItem('user_lng', longitude.toString())
      }
    } catch (e) {
      console.warn('Não foi possível obter a localização em tempo real', e)
      const latStr = localStorage.getItem('user_lat')
      const lngStr = localStorage.getItem('user_lng')
      latitude = latStr ? parseFloat(latStr) : null
      longitude = lngStr ? parseFloat(lngStr) : null
    }

    return { latitude, longitude }
  }

  const submitWithoutPhoto = async () => {
    if (!pendingPontoType || !user) return

    setSaving(true)
    try {
      const { latitude, longitude } = await getCoordinates()

      const now = new Date()
      const dataStr = format(now, 'yyyy-MM-dd')
      const horarioStr = format(now, 'HH:mm:ss')
      const dataHoraStr = now.toISOString()

      const { error } = await supabase.from('pontos').insert({
        funcionario_id: user.id,
        tipo_ponto: pendingPontoType,
        data: dataStr,
        horario: horarioStr,
        entrada: horarioStr,
        data_hora: dataHoraStr,
        status_validacao: 'dentro_tolerancia',
        foto_url: null,
        latitude,
        longitude,
        criado_em: new Date().toISOString(),
        wifi_conectado: null,
      })

      if (error) throw error

      toast({
        title: 'Ponto registrado com sucesso!',
        description: `${pendingPontoType} registrada com sucesso às ${horarioStr.substring(0, 5)}.`,
      })

      setIsConfirmOpen(false)
      setPendingPontoType(null)
      await fetchPontos()
    } catch (error: any) {
      toast({
        title: 'Erro ao registrar ponto. Tente novamente.',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const captureAndSubmit = async () => {
    if (!videoRef.current || !pendingPontoType || !user) return

    setSaving(true)

    try {
      // Captura da foto via Canvas
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth || 640
      canvas.height = videoRef.current.videoHeight || 480
      const ctx = canvas.getContext('2d')

      let blob: Blob | null = null
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', 0.8),
        )
      }

      if (!blob) throw new Error('Falha ao capturar a imagem da câmera.')

      const tipo = pendingPontoType
      closeCamera()

      // Obter geolocalização ANTES do upload
      const { latitude, longitude } = await getCoordinates()

      const now = new Date()
      const dataStr = format(now, 'yyyy-MM-dd')
      const horarioStr = format(now, 'HH:mm:ss')
      const dataHoraStr = now.toISOString()
      const timestamp = now.getTime()

      // Upload para Supabase Storage
      const filePath = `${user.id}/${dataStr}/${tipo.replace(/\s+/g, '_')}_${timestamp}.jpg`

      const { error: uploadError } = await supabase.storage.from('pontos').upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('pontos').getPublicUrl(filePath)

      const { error } = await supabase.from('pontos').insert({
        funcionario_id: user.id,
        tipo_ponto: tipo,
        data: dataStr,
        horario: horarioStr,
        entrada: horarioStr,
        data_hora: dataHoraStr,
        status_validacao: 'dentro_tolerancia',
        foto_url: publicUrlData.publicUrl,
        latitude,
        longitude,
        criado_em: new Date().toISOString(),
        wifi_conectado: null,
      })

      if (error) throw error

      toast({
        title: 'Ponto registrado com sucesso!',
        description: `${tipo} registrada com sucesso às ${horarioStr.substring(0, 5)}.`,
      })

      await fetchPontos()
    } catch (error: any) {
      toast({
        title: 'Erro ao registrar ponto. Tente novamente.',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const nextType = getNextPontoType()

  if (isAdmin) {
    return <AdminDashboard />
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20 flex flex-col font-sans">
      <header className="bg-background border-b sticky top-0 z-10 px-4 py-3 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="font-bold text-lg leading-tight line-clamp-1 text-foreground">
            {userName}
          </h1>
          <div className="flex items-center text-primary font-medium text-sm mt-0.5">
            <Clock size={14} className="mr-1.5" />
            {format(currentTime, 'HH:mm:ss')}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          title="Sair"
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut size={20} />
        </Button>
      </header>

      <main className="flex-1 p-4 md:p-6 flex flex-col items-center max-w-lg mx-auto w-full gap-6 mt-4">
        <Card className="w-full shadow-sm border-muted">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center">Status do Ponto de Hoje</CardTitle>
            <CardDescription className="text-center capitalize">
              {format(currentTime, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">Carregando...</p>
              </div>
            ) : pontos.length === 0 ? (
              <div className="text-center text-muted-foreground py-10 bg-muted/40 rounded-xl border border-dashed border-muted-foreground/20">
                Nenhum ponto registrado
              </div>
            ) : (
              <div className="space-y-3">
                {pontos.map((ponto) => (
                  <div
                    key={ponto.id}
                    className="flex justify-between items-center p-3.5 bg-background rounded-xl border shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-10 bg-primary/20 rounded-full" />
                      <div>
                        <p className="font-semibold text-foreground">{ponto.tipo_ponto}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                          Turno: {getTurno(ponto.horario)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="font-bold text-lg tracking-tight text-primary bg-primary/10 px-3 py-1 rounded-lg">
                        {ponto.horario?.substring(0, 5)}
                      </div>
                      {ponto.foto_url && (
                        <a
                          href={ponto.foto_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          <ImageIcon size={14} />
                          Ver foto
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="w-full mt-2">
          {nextType ? (
            <Button
              className="w-full h-11 text-base font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
              onClick={() => handleRegisterClick(nextType)}
              disabled={saving || loading}
            >
              {saving ? 'Registrando ponto...' : `Registrar ${nextType}`}
            </Button>
          ) : (
            <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-green-600 font-semibold bg-green-50 py-2 rounded-lg border border-green-100">
                Todos os pontos registrados hoje
              </p>
              <Button
                variant="secondary"
                className="w-full h-11 text-base rounded-xl opacity-70"
                disabled
              >
                Turno Concluído, Bom Descanso
              </Button>
            </div>
          )}
        </div>
      </main>

      <a
        href="https://pontopelaspanelas.goskip.app/espelho-ponto"
        target="_self"
        className="fixed bottom-5 right-5 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-background/95 backdrop-blur-md px-4 py-2.5 rounded-full border shadow-lg hover:shadow-xl z-20"
      >
        Acesso ao Portal
        <ExternalLink size={16} />
      </a>

      {/* Modal de Confirmação (Sem Câmera) */}
      <Dialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          if (!open && !saving) {
            setIsConfirmOpen(false)
            setPendingPontoType(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md w-[95%] rounded-2xl mx-auto p-5 border-none shadow-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-center text-xl font-bold">Confirmar Registro</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              Confirma <strong>{pendingPontoType}</strong>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4 sm:space-x-0">
            <Button
              variant="secondary"
              className="w-full h-11 rounded-xl font-semibold order-2 sm:order-1"
              onClick={() => {
                setIsConfirmOpen(false)
                setPendingPontoType(null)
              }}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              className="w-full h-11 rounded-xl font-bold shadow-md order-1 sm:order-2 flex items-center justify-center"
              onClick={submitWithoutPhoto}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Câmera */}
      <Dialog
        open={isCameraOpen}
        onOpenChange={(open) => {
          if (!open && !saving) closeCamera()
        }}
      >
        <DialogContent className="sm:max-w-md w-[95%] rounded-2xl mx-auto p-5 border-none shadow-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Camera size={22} className="text-primary" />
              Capturar Foto - {pendingPontoType}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-4 py-2">
            {cameraError ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-center text-sm font-medium w-full border border-destructive/20">
                {cameraError}
              </div>
            ) : (
              <div className="relative w-full aspect-[3/4] sm:aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
                <video
                  ref={onVideoRef}
                  className="w-full h-full object-cover scale-x-[-1]"
                  autoPlay
                  playsInline
                  muted
                />
                {saving && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-2 sm:space-x-0">
            <Button
              variant="secondary"
              className="w-full h-11 rounded-xl font-semibold order-2 sm:order-1"
              onClick={closeCamera}
              disabled={saving}
            >
              Cancelar
            </Button>
            {!cameraError && (
              <Button
                className="w-full h-11 rounded-xl font-bold shadow-md order-1 sm:order-2 flex items-center justify-center"
                onClick={captureAndSubmit}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registrando ponto...
                  </>
                ) : (
                  'Capturar Foto'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
