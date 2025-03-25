import { RouteObject } from 'react-router-dom'
import { CursosList } from '../components/cursos/CursosList'
import { CursoForm } from '../components/cursos/CursoForm'
import { CursoDetails } from '../components/cursos/CursoDetails'
import { PrivateRoute } from '../components/PrivateRoute'

export const cursosRoutes: RouteObject[] = [
  {
    path: '/cursos',
    element: (
      <PrivateRoute requiredRoles={['admin', 'coordenador']}>
        <CursosList />
      </PrivateRoute>
    )
  },
  {
    path: '/cursos/novo',
    element: (
      <PrivateRoute requiredRoles={['admin']}>
        <CursoForm />
      </PrivateRoute>
    )
  },
  {
    path: '/cursos/:id',
    element: (
      <PrivateRoute requiredRoles={['admin', 'coordenador']}>
        <CursoDetails />
      </PrivateRoute>
    )
  },
  {
    path: '/cursos/:id/edit',
    element: (
      <PrivateRoute requiredRoles={['admin']}>
        <CursoForm />
      </PrivateRoute>
    )
  }
] 