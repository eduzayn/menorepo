import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import DefaultLayout from './layouts/DefaultLayout';

// Importação lazy das páginas
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const EmptyPage = lazy(() => import('./pages/EmptyPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CriarContaPage = lazy(() => import('./pages/CriarContaPage'));

// Componente de loading para Suspense
const PageLoading = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="animate-pulse space-y-8">
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
      <div className="h-64 bg-gray-200 rounded-lg max-w-4xl mx-auto"></div>
    </div>
  </div>
);

// Componente para envolver páginas com Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoading />}>{children}</Suspense>
);

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        {/* Rotas principais */}
        <Route path="/" element={<SuspenseWrapper><HomePage /></SuspenseWrapper>} />
        <Route path="/sobre" element={<SuspenseWrapper><AboutPage /></SuspenseWrapper>} />
        <Route path="/contato" element={<SuspenseWrapper><ContactPage /></SuspenseWrapper>} />
        
        {/* Autenticação */}
        <Route path="/login" element={<SuspenseWrapper><LoginPage /></SuspenseWrapper>} />
        <Route path="/criar-conta" element={<SuspenseWrapper><CriarContaPage /></SuspenseWrapper>} />
        
        {/* Blog */}
        <Route path="/blog" element={<SuspenseWrapper><BlogPage /></SuspenseWrapper>} />
        <Route path="/blog/:slug" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        
        {/* Páginas de soluções */}
        <Route path="/pagina/:slug" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        <Route path="/planos" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        
        {/* Redirecionamentos para módulos */}
        <Route path="/matriculas" element={<EmptyPage />} />
        <Route path="/portal-do-aluno" element={<EmptyPage />} />
        <Route path="/material-didatico" element={<EmptyPage />} />
        <Route path="/financeiro" element={<EmptyPage />} />
        <Route path="/comunicacao" element={<EmptyPage />} />
        
        {/* Dashboard e páginas protegidas */}
        <Route path="/dashboard" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        
        {/* Recuperação de senha */}
        <Route path="/recuperar-senha" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        
        {/* Página não encontrada */}
        <Route path="*" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes; 