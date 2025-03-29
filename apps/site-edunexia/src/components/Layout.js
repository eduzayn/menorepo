import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';
/**
 * Layout padrão da aplicação com Header e Footer
 * Pode ser usado de duas formas:
 * 1. Com children: <Layout><SeuComponente /></Layout>
 * 2. Como wrapper de rotas com Outlet: <Route element={<Layout />}>...</Route>
 */
export default function Layout({ children }) {
    return (_jsx(ErrorBoundary, { fallback: _jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center text-center p-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "N\u00E3o foi poss\u00EDvel carregar esta se\u00E7\u00E3o do site" }), _jsx("p", { className: "mb-6", children: "Por favor, atualize a p\u00E1gina ou tente novamente mais tarde" }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700", children: "Recarregar p\u00E1gina" })] }), children: _jsxs("div", { className: "flex min-h-screen flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1", children: children }), _jsx(Footer, {})] }) }));
}
