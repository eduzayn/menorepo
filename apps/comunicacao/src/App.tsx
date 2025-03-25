import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@repo/auth'
import { ComunicacaoProvider } from '@/contexts/ComunicacaoContext'
import { AppRoutes } from './routes'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey}>
        <ComunicacaoProvider>
          <AppRoutes />
        </ComunicacaoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
} 