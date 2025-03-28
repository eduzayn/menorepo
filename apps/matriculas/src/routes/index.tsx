import { RouteObject } from 'react-router-dom'
import { cursosRoutes } from './cursos'
import { Login } from '../pages/Login'
import { Layout } from '../components/Layout'

// Definindo as rotas como um array de objetos para uso direto no Routes
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Layout />,
    children: cursosRoutes
  }
]

// Para compatibilidade com código existente
export const router = {
  routes
}

export default routes 