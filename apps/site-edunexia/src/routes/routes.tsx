import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';

// Importação direta das páginas críticas (sem lazy loading)
import LoginPage from '../pages/login';
import PortalSelectorPage from '../pages/portal-selector';
import RedirectPage from '../pages/redirect';
import NotFoundPage from '../pages/not-found';

// Importação lazy das páginas
const HomePage = lazy(() => import('../pages/home'));
const AboutPage = lazy(() => import('../pages/about'));
const ContactPage = lazy(() => import('../pages/contact'));
const BlogPage = lazy(() => import('../pages/blog'));
const EmptyPage = lazy(() => import('../pages/EmptyPage'));
const CriarContaPage = lazy(() => import('../pages/CriarContaPage'));
const PlansPage = lazy(() => import('../pages/PlansPage'));
const TrialPage = lazy(() => import('../pages/TrialPage'));
const TrialSuccessPage = lazy(() => import('../pages/TrialSuccessPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('../pages/CheckoutSuccessPage'));
const DynamicPage = lazy(() => import('../pages/DynamicPage'));

// Landing pages de soluções
const MatriculasLandingPage = lazy(() => import('../pages/solucoes/matriculas'));
const PortalAlunoLandingPage = lazy(() => import('../pages/solucoes/portal-aluno'));
const MaterialDidaticoLandingPage = lazy(() => import('../pages/solucoes/material-didatico'));
const ComunicacaoLandingPage = lazy(() => import('../pages/solucoes/comunicacao'));

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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      // Página inicial
      { 
        index: true, 
        element: <SuspenseWrapper><HomePage /></SuspenseWrapper> 
      },
      
      // Rotas principais
      { 
        path: 'sobre', 
        element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> 
      },
      { 
        path: 'contato', 
        element: <SuspenseWrapper><ContactPage /></SuspenseWrapper> 
      },
      
      // Sistema de login unificado
      { 
        path: 'login', 
        element: <LoginPage /> 
      },
      { 
        path: 'portal-selector', 
        element: <PortalSelectorPage /> 
      },
      { 
        path: 'redirect', 
        element: <RedirectPage /> 
      },
      
      // Autenticação legada
      { 
        path: 'criar-conta', 
        element: <SuspenseWrapper><CriarContaPage /></SuspenseWrapper> 
      },
      
      // Blog
      { 
        path: 'blog', 
        element: <SuspenseWrapper><BlogPage /></SuspenseWrapper> 
      },
      { 
        path: 'blog/:slug', 
        element: <SuspenseWrapper><DynamicPage /></SuspenseWrapper> 
      },
      
      // Páginas dinâmicas
      { 
        path: 'pagina/:slug', 
        element: <SuspenseWrapper><DynamicPage /></SuspenseWrapper> 
      },
      
      // Planos e checkout
      { 
        path: 'planos', 
        element: <SuspenseWrapper><PlansPage /></SuspenseWrapper> 
      },
      { 
        path: 'experimentar', 
        element: <SuspenseWrapper><TrialPage /></SuspenseWrapper> 
      },
      { 
        path: 'experimentar/sucesso', 
        element: <SuspenseWrapper><TrialSuccessPage /></SuspenseWrapper> 
      },
      { 
        path: 'checkout/:planId', 
        element: <SuspenseWrapper><CheckoutPage /></SuspenseWrapper> 
      },
      { 
        path: 'checkout/sucesso', 
        element: <SuspenseWrapper><CheckoutSuccessPage /></SuspenseWrapper> 
      },
      
      // Landing pages de soluções (URL específica para evitar conflitos)
      { 
        path: 'solucoes/matriculas', 
        element: <SuspenseWrapper><MatriculasLandingPage /></SuspenseWrapper> 
      },
      { 
        path: 'solucoes/portal-aluno', 
        element: <SuspenseWrapper><PortalAlunoLandingPage /></SuspenseWrapper> 
      },
      { 
        path: 'solucoes/material-didatico', 
        element: <SuspenseWrapper><MaterialDidaticoLandingPage /></SuspenseWrapper> 
      },
      { 
        path: 'solucoes/comunicacao', 
        element: <SuspenseWrapper><ComunicacaoLandingPage /></SuspenseWrapper> 
      },
      
      // Página não encontrada (deve ser a última)
      { 
        path: '*', 
        element: <NotFoundPage /> 
      }
    ]
  }
]); 