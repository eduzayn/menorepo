import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import { AuthProvider } from '@edunexia/auth'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider moduleName="MATRICULAS">
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  )
} 