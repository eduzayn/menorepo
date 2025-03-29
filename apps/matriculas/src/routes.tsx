import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { MatriculasList } from './components/MatriculasList'
import { MatriculaForm } from './components/MatriculaForm'
import { MatriculaFormMultiStep } from './components/MatriculaFormMultiStep'
import { MatriculaDetails } from './components/MatriculaDetails'
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
import { Dashboard, RelatorioFinanceiro } from './pages/dashboard'
// @ts-ignore - Importação do módulo core para constantes de rotas
import { ROUTE_PREFIXES } from '@edunexia/core-types'
import ProtectedRoute from './components/Protected'

// Prefixo para todas as rotas deste módulo
const PREFIX = ROUTE_PREFIXES.MATRICULAS;

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas de autenticação */}
      <Route path={`${PREFIX}/login`} element={<Login />} />

      {/* Layout principal com proteção */}
      <Route 
        path={PREFIX} 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/financeiro" element={<RelatorioFinanceiro />} />
        
        {/* Cursos */}
        <Route path="cursos" element={<CursosList />} />
        <Route path="cursos/novo" element={<CursoForm />} />
        <Route path="cursos/:id" element={<CursoDetails />} />
        <Route path="cursos/:id/editar" element={<CursoForm />} />
        
        {/* Planos */}
        <Route path="planos" element={<PlanosList />} />
        <Route path="planos/novo" element={<PlanoForm />} />
        <Route path="planos/:id" element={<PlanoDetails />} />
        <Route path="planos/:id/editar" element={<PlanoForm />} />
        
        {/* Matrículas */}
        <Route path="matriculas" element={<MatriculasList />} />
        <Route path="matriculas/nova" element={<MatriculaForm />} />
        <Route path="matriculas/nova-assistente" element={<MatriculaFormMultiStep />} />
        <Route path="matriculas/:id" element={<MatriculaDetails />} />
        <Route path="matriculas/:id/editar" element={<MatriculaForm />} />
        
        {/* Documentos */}
        <Route path="documentos" element={<DocumentosList />} />
        <Route path="documentos/upload" element={<DocumentoUpload />} />
        
        {/* Contratos */}
        <Route path="contratos" element={<ContratosList />} />
        <Route path="contratos/:id" element={<ContratoViewer />} />
        
        {/* Pagamentos */}
        <Route path="pagamentos/boleto/:id" element={<GerarBoleto />} />
        
        {/* Configurações */}
        <Route path="configuracoes" element={<ConfiguracoesList />} />
        <Route path="configuracoes/editar" element={<ConfiguracoesForm />} />
      </Route>
      
      {/* Redirecionamentos */}
      <Route path="/" element={<Navigate to={PREFIX} replace />} />
      <Route path="/login" element={<Navigate to={`${PREFIX}/login`} replace />} />
      <Route path="/dashboard" element={<Navigate to={`${PREFIX}/dashboard`} replace />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to={`${PREFIX}/login`} replace />} />
    </Routes>
  )
} 