import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@edunexia/auth'
import AppRoutes from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider moduleName="COMUNICACAO">
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
} 