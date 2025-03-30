import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Importações lazy para melhorar desempenho - Site
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const HomeTest = lazy(() => import('./pages/Home').then(module => ({ default: module.HomePage })));
const DynamicPage = lazy(() => import('./pages/DynamicPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Importações lazy - Área Administrativa
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const PaginasPage = lazy(() => import('./pages/admin/PaginasPage'));
const NewPagePage = lazy(() => import('./pages/admin/NewPagePage'));
const EditPagePage = lazy(() => import('./pages/admin/EditPagePage'));
const LeadsPage = lazy(() => import('./pages/admin/LeadsPage'));
const ConfiguracoesPage = lazy(() => import('./pages/admin/ConfiguracoesPage'));

// Componente de loading para Suspense
const PageLoading = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="animate-pulse space-y-8">
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
      <div className="h-64 bg-gray-200 rounded-lg max-w-4xl mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded max-w-2xl mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded max-w-3xl mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
    </div>
  </div>
);

// Componente para envolver páginas com Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoading />}>{children}</Suspense>
);

// Componente de Layout com Outlet
const LayoutWithOutlet = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas do site */}
      <Route element={<LayoutWithOutlet />}>
        {/* Páginas principais */}
        <Route path="/" element={<SuspenseWrapper><HomePage /></SuspenseWrapper>} />
        <Route path="/sobre" element={<SuspenseWrapper><AboutPage /></SuspenseWrapper>} />
        <Route path="/contato" element={<SuspenseWrapper><ContactPage /></SuspenseWrapper>} />
        
        {/* Página dinâmica baseada em slug */}
        <Route path="/pagina/:slug" element={<SuspenseWrapper><DynamicPage /></SuspenseWrapper>} />
        
        {/* Páginas do blog */}
        <Route path="/blog" element={<SuspenseWrapper><BlogPage /></SuspenseWrapper>} />
        <Route path="/blog/:slug" element={<SuspenseWrapper><BlogPostPage /></SuspenseWrapper>} />
        
        {/* Rota para página não encontrada */}
        <Route path="*" element={<SuspenseWrapper><NotFoundPage /></SuspenseWrapper>} />
      </Route>
      
      {/* Login admin */}
      <Route 
        path="/admin/login" 
        element={<SuspenseWrapper><LoginPage /></SuspenseWrapper>} 
      />
      
      {/* Rotas do painel administrativo (protegidas) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuspenseWrapper><DashboardPage /></SuspenseWrapper>} />
        
        {/* Gerenciamento de páginas */}
        <Route path="paginas" element={<SuspenseWrapper><PaginasPage /></SuspenseWrapper>} />
        <Route path="paginas/nova" element={<SuspenseWrapper><NewPagePage /></SuspenseWrapper>} />
        <Route path="paginas/editar/:id" element={<SuspenseWrapper><EditPagePage /></SuspenseWrapper>} />
        
        {/* Gerenciamento de Leads */}
        <Route path="leads" element={<SuspenseWrapper><LeadsPage /></SuspenseWrapper>} />
        
        {/* Configurações do site */}
        <Route path="configuracoes" element={<SuspenseWrapper><ConfiguracoesPage /></SuspenseWrapper>} />
        
        {/* Rotas temporárias para outras seções */}
        <Route path="blog" element={
          <SuspenseWrapper>
            <div className="p-4">Gerenciamento de Blog - Em desenvolvimento</div>
          </SuspenseWrapper>
        } />
        <Route path="blog/novo" element={
          <SuspenseWrapper>
            <div className="p-4">Criação de novo post - Em desenvolvimento</div>
          </SuspenseWrapper>
        } />
        <Route path="blog/editar/:id" element={
          <SuspenseWrapper>
            <div className="p-4">Edição de post - Em desenvolvimento</div>
          </SuspenseWrapper>
        } />
        
        <Route path="categorias" element={
          <SuspenseWrapper>
            <div className="p-4">Gerenciamento de Categorias - Em desenvolvimento</div>
          </SuspenseWrapper>
        } />
        <Route path="depoimentos" element={
          <SuspenseWrapper>
            <div className="p-4">Gerenciamento de Depoimentos - Em desenvolvimento</div>
          </SuspenseWrapper>
        } />
        <Route path="menu" element={
          <SuspenseWrapper>
            <div className="p-4">Gerenciamento de Menu - Em desenvolvimento</div>
          </SuspenseWrapper>
        } />
        
        {/* Redirecionar rotas não encontradas no admin para o dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      
      {/* Página de teste sem o Layout */}
      <Route 
        path="/api-test" 
        element={<SuspenseWrapper><HomeTest /></SuspenseWrapper>} 
      />
    </Routes>
  );
}

export default AppRoutes; 