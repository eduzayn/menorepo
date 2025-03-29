import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { Link } from 'react-router-dom';
/**
 * Componente que captura erros em seus filhos e exibe uma UI alternativa
 * quando ocorre uma exceção durante a renderização
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error, errorInfo: null };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // Aqui você pode enviar o erro para um serviço de monitoramento
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // Fallback personalizado ou UI padrão de erro
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8 text-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-3xl font-extrabold text-gray-900", children: "Oops! Algo deu errado." }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Encontramos um problema ao carregar esta p\u00E1gina." })] }), _jsxs("div", { className: "mt-8 space-y-6", children: [_jsxs("div", { className: "rounded-md shadow-sm bg-white p-6 border border-red-100", children: [_jsx("h3", { className: "font-medium text-red-800 mb-2", children: "Detalhes do erro:" }), _jsx("p", { className: "text-sm text-gray-700 mb-4", children: this.state.error?.toString() || 'Erro desconhecido' }), process.env.NODE_ENV === 'development' && this.state.errorInfo && (_jsxs("details", { className: "text-left mt-4", children: [_jsx("summary", { className: "text-sm font-medium text-gray-700 cursor-pointer", children: "Stack trace" }), _jsx("pre", { className: "mt-2 text-xs text-gray-600 overflow-auto p-2 bg-gray-50 rounded", children: this.state.errorInfo.componentStack })] }))] }), _jsxs("div", { className: "flex flex-col space-y-4", children: [_jsx("button", { onClick: () => window.location.reload(), className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: "Tentar novamente" }), _jsx(Link, { to: "/", className: "w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: "Voltar para p\u00E1gina inicial" })] })] })] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
