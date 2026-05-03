import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { ChefHat, Eye, EyeOff, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { getDistanceInMeters } from '@/lib/geolocation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const TARGET_LAT = -23.684315025060474
const TARGET_LNG = -46.55300554706126
const MAX_DISTANCE_METERS = 100

type Status = 'idle' | 'locating' | 'authenticating' | 'error'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false)

  // Estados do modal de troca de senha
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const { signIn, signOut, session, loading: authLoading, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Clear errors when user types
  useEffect(() => {
    if (status === 'error') {
      setStatus('idle')
      setErrorMsg('')
    }
  }, [email, password])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (session && !needsPasswordChange) {
    if (isAdmin) {
      return <Navigate to="/dashboard" replace />
    } else {
      return <Navigate to="/espelho-ponto" replace />
    }
  }

  const proceedToAuth = async (isUserAdmin: boolean) => {
    setStatus('authenticating')
    const { error } = await signIn(email, password)

    if (error) {
      setStatus('error')
      if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Email ou senha incorretos.')
      } else {
        setErrorMsg('Ocorreu um erro ao fazer login. Tente novamente.')
      }
    } else {
      if (password === '123456') {
        setNeedsPasswordChange(true)
        setStatus('idle')
      } else {
        if (isUserAdmin) {
          navigate('/espelho-ponto', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      }
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (newPassword.length < 6) {
      setPasswordError('Mínimo 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não conferem')
      return
    }

    setIsUpdatingPassword(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    setIsUpdatingPassword(false)

    if (error) {
      setPasswordError('Erro ao atualizar a senha. Tente novamente.')
    } else {
      toast.success('Senha alterada com sucesso')
      await signOut()
      setNeedsPasswordChange(false)
      setNewPassword('')
      setConfirmPassword('')
      setPasswordError('')
      setPassword('')
    }
  }

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email || !password) return

    setStatus('locating')
    setErrorMsg('')

    let isUserAdmin = false
    try {
      const { data: role } = await supabase.rpc('get_user_role_by_email', { p_email: email })
      isUserAdmin = ['Admin', 'Gerente', 'admin', 'gerente'].includes(role || '')
    } catch (err) {
      console.error('Error fetching user role:', err)
    }

    if (isUserAdmin) {
      await proceedToAuth(true)
    } else {
      if (!navigator.geolocation) {
        setStatus('error')
        setErrorMsg('Não conseguimos acessar sua localização. Ative GPS e tente novamente.')
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const distance = getDistanceInMeters(latitude, longitude, TARGET_LAT, TARGET_LNG)

          if (distance <= MAX_DISTANCE_METERS) {
            proceedToAuth(false)
          } else {
            setStatus('error')
            setErrorMsg('Você não está no restaurante. Acesso negado.')
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
          setStatus('error')
          setErrorMsg('Não conseguimos acessar sua localização. Ative GPS e tente novamente.')
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    }
  }

  const isFormValid = email.trim().length > 0 && password.trim().length > 0
  const isLoading = status === 'locating' || status === 'authenticating'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-xl overflow-hidden border">
        {/* Header Area */}
        <div className="bg-[#7A2021] p-8 flex flex-col items-center justify-center text-white space-y-4">
          <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
            <ChefHat size={48} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-center tracking-tight">Ponto Pelas Panelas</h1>
        </div>

        {/* Form Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {status === 'error' && (
            <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-md flex items-start gap-3 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-destructive-foreground font-medium">
                {errorMsg}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11 pr-10 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              {status === 'error' ? (
                <Button
                  type="button"
                  onClick={handleLogin}
                  className="w-full h-11 font-medium text-base gap-2"
                  disabled={!isFormValid}
                >
                  <RefreshCw className="h-4 w-4" />
                  Tentar Novamente
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-11 font-medium text-base"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {status === 'locating' ? 'Verificando localização...' : 'Entrando...'}
                    </div>
                  ) : (
                    'Entrar'
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground text-center">
        Precisa estar no restaurante para registrar o ponto.
      </p>

      <Dialog open={needsPasswordChange} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md [&>button]:hidden bg-background rounded-2xl shadow-xl border"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center tracking-tight">
              Altere sua senha
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Senha Nova</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isUpdatingPassword}
                  className={cn(
                    'h-11 pr-10 w-full',
                    passwordError ? 'border-destructive focus-visible:ring-destructive' : '',
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  disabled={isUpdatingPassword}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme a Senha Nova</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isUpdatingPassword}
                  className={cn(
                    'h-11 pr-10 w-full',
                    passwordError ? 'border-destructive focus-visible:ring-destructive' : '',
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  disabled={isUpdatingPassword}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-destructive font-medium mt-1">{passwordError}</p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-11 font-medium text-base"
                disabled={isUpdatingPassword || !newPassword || !confirmPassword}
              >
                {isUpdatingPassword ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Atualizando...
                  </div>
                ) : (
                  'Salvar e Entrar'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
