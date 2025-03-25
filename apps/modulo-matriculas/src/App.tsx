import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@edunexia/auth'
import { router } from './routes'

function App() {
  return (
    <AuthProvider
      supabaseUrl={import.meta.env.VITE_SUPABASE_URL}
      supabaseAnonKey={import.meta.env.VITE_SUPABASE_ANON_KEY}
    >
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App 