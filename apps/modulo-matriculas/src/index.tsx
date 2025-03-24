import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import { MatriculasList } from './components/MatriculasList'
import { MatriculaForm } from './components/MatriculaForm'
import { MatriculaDetails } from './components/MatriculaDetails'

export const router = createBrowserRouter([
  {
    path: '/matriculas',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MatriculasList />
      },
      {
        path: 'nova',
        element: <MatriculaForm />
      },
      {
        path: ':id',
        element: <MatriculaDetails matriculaId=":id" onClose={() => window.history.back()} />
      }
    ]
  }
])

export default router 