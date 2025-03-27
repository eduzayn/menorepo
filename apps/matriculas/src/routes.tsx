import { Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { MatriculasList } from './components/MatriculasList'
import { MatriculaForm } from './components/MatriculaForm'
import { MatriculaDetails } from './components/MatriculaDetails'
import { PrivateRoute } from './components/PrivateRoute'
import { CursosList } from './components/cursos/CursosList'
import { CursoForm } from './components/cursos/CursoForm'
import { CursoDetails } from './components/cursos/CursoDetails'

const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/cursos',
    element: (
      <PrivateRoute requiredRoles={['admin', 'secretaria']}>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <CursosList />,
      },
      {
        path: 'novo',
        element: <CursoForm />,
      },
      {
        path: ':id',
        element: <CursoDetails />,
      },
      {
        path: ':id/editar',
        element: <CursoForm />,
      },
    ],
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
        path: '',
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
];

export default routes; 