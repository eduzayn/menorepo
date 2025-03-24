import { createBrowserRouter } from 'react-router-dom'
import { cursosRoutes } from './cursos'
import { Login } from '../pages/Login'
import { Layout } from '../components/Layout'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      ...cursosRoutes
    ]
  }
]) 