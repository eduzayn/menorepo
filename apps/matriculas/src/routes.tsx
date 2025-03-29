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
import { ROUTE_PREFIXES } from '@edunexia/core'
import { RouteGuard } from '@edunexia/auth'

// Prefixo para todas as rotas deste módulo
const PREFIX = ROUTE_PREFIXES.MATRICULAS;

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas de autenticação */}
      <Route path={`${PREFIX}/auth/login`} element={<Login />} />

      {/* Rotas protegidas - Cursos */}
      <Route path={`${PREFIX}/cursos`} element={
        <RouteGuard requiredRoles={['admin', 'secretaria']}>
          <Layout />
        </RouteGuard>
      }>
        <Route index element={<CursosList />} />
        <Route path="novo" element={<CursoForm />} />
        <Route path=":id" element={<CursoDetails />} />
        <Route path=":id/editar" element={<CursoForm />} />
      </Route>

      {/* Rotas protegidas - Planos */}
      <Route path={`${PREFIX}/planos`} element={
        <RouteGuard requiredRoles={['admin', 'secretaria', 'financeiro']}>
          <Layout />
        </RouteGuard>
      }>
        <Route index element={<PlanosList />} />
        <Route path="novo" element={<PlanoForm />} />
        <Route path=":id" element={<PlanoDetails />} />
        <Route path=":id/editar" element={<PlanoForm />} />
      </Route>

      {/* Rotas protegidas - Matrículas */}
      <Route path={`${PREFIX}/matriculas`} element={
        <RouteGuard requiredRoles={['admin', 'secretaria']}>
          <Layout />
        </RouteGuard>
      }>
        <Route index element={<MatriculasList />} />
        <Route path="nova" element={<MatriculaForm />} />
        <Route path="nova-matricula" element={<MatriculaFormMultiStep />} />
        <Route path=":id" element={<MatriculaDetails />} />
      </Route>

      {/* Rotas protegidas - Documentos */}
      <Route path={`${PREFIX}/documentos`} element={
        <RouteGuard requiredRoles={['admin', 'secretaria', 'documentacao']}>
          <Layout />
        </RouteGuard>
      }>
        <Route path=":id" element={<DocumentosList />} />
        <Route path=":alunoId/novo" element={<DocumentoUpload />} />
      </Route>

      {/* Rotas protegidas - Contratos */}
      <Route path={`${PREFIX}/contratos`} element={
        <RouteGuard requiredRoles={['admin', 'secretaria', 'financeiro', 'aluno']}>
          <Layout />
        </RouteGuard>
      }>
        <Route index element={<ContratosList />} />
        <Route path=":id" element={<ContratoViewer />} />
      </Route>

      {/* Rotas protegidas - Pagamentos */}
      <Route path={`${PREFIX}/pagamentos`} element={
        <RouteGuard requiredRoles={['admin', 'secretaria', 'financeiro', 'aluno']}>
          <Layout />
        </RouteGuard>
      }>
        <Route path="matricula/:matriculaId/boletos" element={<GerarBoleto />} />
      </Route>

      {/* Rotas protegidas - Configurações */}
      <Route path={`${PREFIX}/configuracoes`} element={
        <RouteGuard requiredRoles={['admin', 'financeiro']}>
          <Layout />
        </RouteGuard>
      }>
        <Route index element={<ConfiguracoesList />} />
        <Route path=":tipo/novo" element={<ConfiguracoesForm />} />
        <Route path=":tipo/nova" element={<ConfiguracoesForm />} />
        <Route path=":tipo/:id/editar" element={<ConfiguracoesForm />} />
      </Route>

      {/* Rotas protegidas - Dashboard */}
      <Route path={`${PREFIX}/dashboard`} element={
        <RouteGuard requiredRoles={['admin', 'secretaria', 'financeiro']}>
          <Layout />
        </RouteGuard>
      }>
        <Route index element={<Dashboard />} />
        <Route path="financeiro" element={<RelatorioFinanceiro />} />
      </Route>

      {/* Redirecionamentos do módulo */}
      <Route path={PREFIX} element={<Navigate to={`${PREFIX}/dashboard`} replace />} />
      
      {/* Manter temporariamente as rotas antigas com redirecionamento para compatibilidade */}
      <Route path="/login" element={<Navigate to={`${PREFIX}/auth/login`} replace />} />
      <Route path="/dashboard" element={<Navigate to={`${PREFIX}/dashboard`} replace />} />
      <Route path="/cursos" element={<Navigate to={`${PREFIX}/cursos`} replace />} />
      <Route path="/planos" element={<Navigate to={`${PREFIX}/planos`} replace />} />
      <Route path="/matriculas" element={<Navigate to={`${PREFIX}/matriculas`} replace />} />
      
      {/* Rota coringa - redireciona para dashboard */}
      <Route path="*" element={<Navigate to={`${PREFIX}/dashboard`} replace />} />
    </Routes>
  );
} 