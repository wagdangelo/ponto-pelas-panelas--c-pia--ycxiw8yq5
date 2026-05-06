import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DashboardPrincipal from './pages/DashboardPrincipal'
import EspelhoPonto from './pages/EspelhoPonto'
import Colaboradores from './pages/Colaboradores'
import Ponto from './pages/Ponto'
import { AuthProvider, useAuth } from './hooks/use-auth'
import { Loader2 } from 'lucide-react'
import { ErrorBoundary } from './components/ErrorBoundary'

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-principal"
          element={
            <ProtectedRoute>
              <DashboardPrincipal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/colaboradores"
          element={
            <ProtectedRoute>
              <Colaboradores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/espelho-ponto"
          element={
            <ProtectedRoute>
              <EspelhoPonto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ponto"
          element={
            <ProtectedRoute>
              <Ponto />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

const App = () => (
  <ErrorBoundary>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
)

export default App
