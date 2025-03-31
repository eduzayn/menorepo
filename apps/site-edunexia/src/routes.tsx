import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import DefaultLayout from './layouts/DefaultLayout';

// Importação direta das páginas críticas (sem lazy loading)
import LoginPage from './pages/login';
import PortalSelectorPage from './pages/portal-selector';
import RedirectPage from './pages/redirect';

// Importação lazy das páginas
const HomePage = lazy(() => import('./pages/home'));
const AboutPage = lazy(() => import('./pages/about'));
const ContactPage = lazy(() => import('./pages/contact'));
const BlogPage = lazy(() => import('./pages/blog'));
const EmptyPage = lazy(() => import('./pages/EmptyPage'));
const CriarContaPage = lazy(() => import('./pages/CriarContaPage'));
const NotFoundPage = lazy(() => import('./pages/not-found'));
const PlansPage = lazy(() => import('./pages/PlansPage'));
const TrialPage = lazy(() => import('./pages/TrialPage'));
const TrialSuccessPage = lazy(() => import('./pages/TrialSuccessPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'));
const DynamicPage = lazy(() => import('./pages/DynamicPage'));

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
        
        {/* Sistema de login unificado - Carregamento direto sem lazy loading para evitar problemas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/portal-selector" element={<PortalSelectorPage />} />
        <Route path="/redirect" element={<RedirectPage />} />
        
        {/* Autenticação legada - redirecionando para o novo sistema */}
        <Route path="/criar-conta" element={<SuspenseWrapper><CriarContaPage /></SuspenseWrapper>} />
        
        {/* Blog */}
        <Route path="/blog" element={<SuspenseWrapper><BlogPage /></SuspenseWrapper>} />
        <Route path="/blog/:slug" element={<SuspenseWrapper><DynamicPage /></SuspenseWrapper>} />
        
        {/* Páginas de soluções */}
        <Route path="/pagina/:slug" element={<SuspenseWrapper><DynamicPage /></SuspenseWrapper>} />
        <Route path="/planos" element={<SuspenseWrapper><PlansPage /></SuspenseWrapper>} />
        
        {/* Páginas de trial e checkout */}
        <Route path="/experimentar" element={<SuspenseWrapper><TrialPage /></SuspenseWrapper>} />
        <Route path="/experimentar/sucesso" element={<SuspenseWrapper><TrialSuccessPage /></SuspenseWrapper>} />
        <Route path="/checkout/:planId" element={<SuspenseWrapper><CheckoutPage /></SuspenseWrapper>} />
        <Route path="/checkout/sucesso" element={<SuspenseWrapper><CheckoutSuccessPage /></SuspenseWrapper>} />
        
        {/* Redirecionamentos para módulos */}
        <Route path="/matriculas" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        <Route path="/portal-do-aluno" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        <Route path="/material-didatico" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        <Route path="/financeiro" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        <Route path="/comunicacao" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        
        {/* Dashboard e páginas protegidas */}
        <Route path="/dashboard" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        
        {/* Recuperação de senha */}
        <Route path="/recuperar-senha" element={<SuspenseWrapper><EmptyPage /></SuspenseWrapper>} />
        
        {/* Página não encontrada */}
        <Route path="*" element={<SuspenseWrapper><NotFoundPage /></SuspenseWrapper>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes; 