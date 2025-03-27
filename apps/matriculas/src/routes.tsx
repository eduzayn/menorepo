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
import { PlanosList } from './components/planos/PlanosList'
import { PlanoForm } from './components/planos/PlanoForm'
import { PlanoDetails } from './components/planos/PlanoDetails'
import { DocumentosList } from './components/documentos/DocumentosList'
import { DocumentoUpload } from './components/documentos/DocumentoUpload'
import { ContratoViewer } from './components/contratos/ContratoViewer'
import { ContratosList } from './components/contratos/ContratosList'
import { GerarBoleto } from './components/pagamentos/GerarBoleto'
import { ConfiguracoesList } from './components/configuracoes/ConfiguracoesList'
import { ConfiguracoesForm } from './components/configuracoes/ConfiguracoesForm'

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
    path: '/planos',
    element: (
      <PrivateRoute requiredRoles={['admin', 'secretaria', 'financeiro']}>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <PlanosList />,
      },
      {
        path: 'novo',
        element: <PlanoForm />,
      },
      {
        path: ':id',
        element: <PlanoDetails />,
      },
      {
        path: ':id/editar',
        element: <PlanoForm />,
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
    path: '/documentos',
    element: (
      <PrivateRoute requiredRoles={['admin', 'secretaria', 'documentacao']}>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: ':id',
        element: <DocumentosList />,
      },
      {
        path: ':alunoId/novo',
        element: <DocumentoUpload />,
      },
    ],
  },
  {
    path: '/contratos',
    element: (
      <PrivateRoute requiredRoles={['admin', 'secretaria', 'financeiro', 'aluno']}>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <ContratosList />,
      },
      {
        path: ':id',
        element: <ContratoViewer />,
      },
    ],
  },
  {
    path: '/pagamentos',
    element: (
      <PrivateRoute requiredRoles={['admin', 'secretaria', 'financeiro', 'aluno']}>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'matricula/:matriculaId/boletos',
        element: <GerarBoleto />,
      },
    ],
  },
  {
    path: '/configuracoes',
    element: (
      <PrivateRoute requiredRoles={['admin', 'financeiro']}>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <ConfiguracoesList />,
      },
      {
        path: ':tipo/novo',
        element: <ConfiguracoesForm />,
      },
      {
        path: ':tipo/nova',
        element: <ConfiguracoesForm />,
      },
      {
        path: ':tipo/:id/editar',
        element: <ConfiguracoesForm />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/matriculas" />,
  },
];

export default routes; 