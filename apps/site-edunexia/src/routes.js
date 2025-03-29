import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
// Componente de loading para Suspense
const PageLoading = () => (_jsx("div", { className: "container mx-auto px-4 py-12", children: _jsxs("div", { className: "animate-pulse space-y-8", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-3/4 mx-auto" }), _jsx("div", { className: "h-64 bg-gray-200 rounded-lg max-w-4xl mx-auto" }), _jsx("div", { className: "h-4 bg-gray-200 rounded max-w-2xl mx-auto" }), _jsx("div", { className: "h-4 bg-gray-200 rounded max-w-3xl mx-auto" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-5/6 mx-auto" })] }) }));
// Componente para envolver páginas com Suspense
const SuspenseWrapper = ({ children }) => (_jsx(Suspense, { fallback: _jsx(PageLoading, {}), children: children }));
// Componente de Layout com Outlet
const LayoutWithOutlet = () => (_jsx(Layout, { children: _jsx(Outlet, {}) }));
function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(LayoutWithOutlet, {}), children: [_jsx(Route, { path: "/", element: _jsx(SuspenseWrapper, { children: _jsx(HomePage, {}) }) }), _jsx(Route, { path: "/sobre", element: _jsx(SuspenseWrapper, { children: _jsx(AboutPage, {}) }) }), _jsx(Route, { path: "/contato", element: _jsx(SuspenseWrapper, { children: _jsx(ContactPage, {}) }) }), _jsx(Route, { path: "/pagina/:slug", element: _jsx(SuspenseWrapper, { children: _jsx(DynamicPage, {}) }) }), _jsx(Route, { path: "/blog", element: _jsx(SuspenseWrapper, { children: _jsx(BlogPage, {}) }) }), _jsx(Route, { path: "/blog/:slug", element: _jsx(SuspenseWrapper, { children: _jsx(BlogPostPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(SuspenseWrapper, { children: _jsx(NotFoundPage, {}) }) })] }), _jsx(Route, { path: "/admin/login", element: _jsx(SuspenseWrapper, { children: _jsx(LoginPage, {}) }) }), _jsxs(Route, { path: "/admin", element: _jsx(ProtectedRoute, { children: _jsx(AdminLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(SuspenseWrapper, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "paginas", element: _jsx(SuspenseWrapper, { children: _jsx(PaginasPage, {}) }) }), _jsx(Route, { path: "paginas/nova", element: _jsx(SuspenseWrapper, { children: _jsx("div", { className: "p-4", children: "Cria\u00E7\u00E3o de nova p\u00E1gina - Em desenvolvimento" }) }) }), _jsx(Route, { path: "paginas/editar/:id", element: _jsx(SuspenseWrapper, { children: _jsx("div", { className: "p-4", children: "Edi\u00E7\u00E3o de p\u00E1gina - Em desenvolvimento" }) }) }), _jsx(Route, { path: "blog", element: _jsx(SuspenseWrapper, { children: _jsx("div", { className: "p-4", children: "Gerenciamento de Blog - Em desenvolvimento" }) }) }), _jsx(Route, { path: "blog/novo", element: _jsx(SuspenseWrapper, { children: _jsx("div", { className: "p-4", children: "Cria\u00E7\u00E3o de novo post - Em desenvolvimento" }) }) }), _jsx(Route, { path: "blog/editar/:id", element: _jsx(SuspenseWrapper, { children: _jsx("div", { className: "p-4", children: "Edi\u00E7\u00E3o de post - Em desenvolvimento" }) }) }), _jsx(Route, { path: "categorias", element: _jsx(SuspenseWrapper, { children: _jsx("div", { className: "p-4", children: "Gerenciamento de Categorias - Em desenvolvimento" }) }) }), _jsx(Route, { path: "leads", element: _jsx(SuspenseWrapper, { children: _jsx("div", { className: "p-4", children: "Gerenciamento de Leads - Em desenvolvimento" }) }) }), _jsx(Route, { path: "depoimentos", element: _jsx(SuspenseWrapper, { children: _jsx("div", { className: "p-4", children: "Gerenciamento de Depoimentos - Em desenvolvimento" }) }) }), _jsx(Route, { path: "configuracoes", element: _jsx(SuspenseWrapper, { children: _jsx("div", { className: "p-4", children: "Configura\u00E7\u00F5es do Site - Em desenvolvimento" }) }) }), _jsx(Route, { path: "menu", element: _jsx(SuspenseWrapper, { children: _jsx("div", { className: "p-4", children: "Gerenciamento de Menu - Em desenvolvimento" }) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/admin", replace: true }) })] }), _jsx(Route, { path: "/api-test", element: _jsx(SuspenseWrapper, { children: _jsx(HomeTest, {}) }) })] }));
}
export default AppRoutes;
