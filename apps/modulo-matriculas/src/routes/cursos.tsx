import { RouteObject } from 'react-router-dom'
import { CursosList } from '../components/cursos/CursosList'
import { CursoForm } from '../components/cursos/CursoForm'
import { CursoDetails } from '../components/cursos/CursoDetails'
import { PrivateRoute } from '../components/PrivateRoute'

export const cursosRoutes: RouteObject[] = [
  {
    path: '/cursos',
    element: (
      <PrivateRoute roles={['admin', 'coordenador']}>
        <CursosList />
      </PrivateRoute>
    )
  },
  {
    path: '/cursos/novo',
    element: (
      <PrivateRoute roles={['admin']}>
        <CursoForm />
      </PrivateRoute>
    )
  },
  {
    path: '/cursos/:id',
    element: (
      <PrivateRoute roles={['admin', 'coordenador']}>
        <CursoDetails />
      </PrivateRoute>
    )
  },
  {
    path: '/cursos/:id/edit',
    element: (
      <PrivateRoute roles={['admin']}>
        <CursoForm />
      </PrivateRoute>
    )
  }
] 