import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { MatriculasList } from './components/MatriculasList'
import { MatriculaForm } from './components/MatriculaForm'
import { MatriculaDetails } from './components/MatriculaDetails'
import { PrivateRoute } from './components/PrivateRoute'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/matriculas',
    element: (
      <PrivateRoute requiredRoles={['admin', 'secretaria']}>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <MatriculasList />,
      },
      {
        path: 'nova',
        element: <MatriculaForm />,
      },
      {
        path: ':id',
        element: <MatriculaDetails />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/matriculas" />,
  },
]) 