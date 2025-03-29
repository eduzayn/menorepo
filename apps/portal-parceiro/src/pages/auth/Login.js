import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        }
        catch (err) {
            setLoading(false);
            if (err.message?.includes('Invalid login credentials')) {
                setError('Credenciais inválidas. Por favor, verifique seu email e senha.');
            }
            else if (err.message?.includes('Email not confirmed')) {
                setError('Seu email ainda não foi confirmado. Verifique sua caixa de entrada.');
            }
            else {
                setError(`Erro ao fazer login: ${err.message || 'Tente novamente mais tarde'}`);
            }
            console.error('Erro de login:', err);
        }
    };
    return (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900 mb-6", children: "Portal do Parceiro" }), error && (_jsx("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 mb-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(ExclamationCircleIcon, { className: "h-5 w-5 text-red-400", "aria-hidden": "true" }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700", children: error }) })] }) })), _jsxs("form", { className: "space-y-6", onSubmit: handleLogin, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email" }), _jsx("div", { className: "mt-1", children: _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "seu@email.com" }) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Senha" }), _jsx("div", { className: "mt-1", children: _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "remember-me", name: "remember-me", type: "checkbox", className: "h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "remember-me", className: "ml-2 block text-sm text-gray-900", children: "Lembrar-me" })] }), _jsx("div", { className: "text-sm", children: _jsx("a", { href: "#", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "Esqueceu a senha?" }) })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: loading, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50", children: loading ? 'Entrando...' : 'Entrar' }) })] }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-500", children: "Precisa de ajuda?" }) })] }), _jsx("div", { className: "mt-4 text-center text-sm", children: _jsxs("p", { className: "text-gray-600", children: ["Em caso de d\u00FAvidas, entre em contato com o suporte t\u00E9cnico", _jsx("br", {}), _jsx("a", { href: "mailto:suporte@edunexia.com", className: "text-indigo-600 hover:text-indigo-500", children: "suporte@edunexia.com" })] }) })] })] }));
};
export default Login;
