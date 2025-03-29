import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LockClosedIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { completePasswordReset } = useAuth();
    // Obter token da URL
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('token') || '';
    const [form, setForm] = useState({
        password: '',
        confirmPassword: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        // Verificar se o token é válido ao carregar a página
        const validateToken = async () => {
            if (!resetToken) {
                setTokenValid(false);
                setMessage({
                    type: 'error',
                    text: 'Link de redefinição inválido ou expirado. Solicite um novo link.'
                });
                return;
            }
            try {
                // Simulação de validação
                await new Promise(resolve => setTimeout(resolve, 500));
                // Em produção:
                // const isValid = await auth.validateResetToken(resetToken);
                // setTokenValid(isValid);
                // Simular que o token é válido
                setTokenValid(true);
            }
            catch (error) {
                setTokenValid(false);
                setMessage({
                    type: 'error',
                    text: 'Ocorreu um erro ao validar seu link. Por favor, tente novamente.'
                });
            }
        };
        validateToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetToken]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validações básicas
        if (form.password !== form.confirmPassword) {
            setMessage({
                type: 'error',
                text: 'As senhas não coincidem'
            });
            return;
        }
        if (form.password.length < 8) {
            setMessage({
                type: 'error',
                text: 'A senha deve ter pelo menos 8 caracteres'
            });
            return;
        }
        setSubmitting(true);
        setMessage(null);
        try {
            // Simulação de reset
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Em produção:
            // await completePasswordReset({
            //   token: resetToken,
            //   newPassword: form.password
            // });
            setMessage({
                type: 'success',
                text: 'Senha redefinida com sucesso!'
            });
            // Redirecionar para login após alguns segundos
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Sua senha foi redefinida. Você já pode fazer login com sua nova senha.'
                    }
                });
            }, 2000);
        }
        catch (error) {
            setMessage({
                type: 'error',
                text: 'Não foi possível redefinir sua senha. O link pode ter expirado.'
            });
        }
        finally {
            setSubmitting(false);
        }
    };
    if (tokenValid === null) {
        // Carregando
        return (_jsx("div", { className: "min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) }), _jsx("h2", { className: "mt-6 text-center text-xl font-medium text-gray-900", children: "Verificando link de redefini\u00E7\u00E3o..." })] }) }));
    }
    if (tokenValid === false) {
        // Token inválido
        return (_jsx("div", { className: "min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("div", { className: "flex justify-center", children: _jsx("img", { className: "mx-auto h-12 w-auto", src: "/logo.svg", alt: "Edun\u00E9xia" }) }), _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Link inv\u00E1lido" }), _jsxs("div", { className: "mt-2 text-center text-sm text-gray-600", children: [_jsx("p", { className: "mt-1", children: message?.text || 'Este link de redefinição é inválido ou expirou.' }), _jsx("div", { className: "mt-4", children: _jsxs(Link, { to: "/forgot-password", className: "font-medium text-primary hover:text-primary-dark flex items-center justify-center", children: [_jsx(ArrowLeftIcon, { className: "mr-1 h-4 w-4" }), "Solicitar novo link"] }) })] })] }) }));
    }
    return (_jsxs("div", { className: "min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("div", { className: "flex justify-center", children: _jsx("img", { className: "mx-auto h-12 w-auto", src: "/logo.svg", alt: "Edun\u00E9xia" }) }), _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Redefinir Senha" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Digite sua nova senha para continuar" })] }), _jsx("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: _jsxs("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: [message && (_jsxs("div", { className: `mb-4 p-4 ${message.type === 'success'
                                ? 'bg-green-50 border-l-4 border-green-400 text-green-700 flex items-start'
                                : 'bg-red-50 border-l-4 border-red-400 text-red-700'}`, children: [message.type === 'success' && (_jsx(CheckCircleIcon, { className: "h-5 w-5 text-green-400 mr-2 mt-0.5" })), _jsx("span", { children: message.text })] })), _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Nova Senha" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "new-password", required: true, minLength: 8, className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", placeholder: "********", value: form.password, onChange: handleChange, disabled: submitting || message?.type === 'success' })] }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "M\u00EDnimo de 8 caracteres" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "Confirmar Nova Senha" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { id: "confirmPassword", name: "confirmPassword", type: "password", autoComplete: "new-password", required: true, minLength: 8, className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", placeholder: "********", value: form.confirmPassword, onChange: handleChange, disabled: submitting || message?.type === 'success' })] })] }), _jsx("div", { children: _jsx("button", { type: "submit", className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary", disabled: submitting || message?.type === 'success', children: submitting ? 'Redefinindo...' : 'Redefinir Senha' }) }), _jsx("div", { className: "flex items-center justify-center", children: _jsx("div", { className: "text-sm", children: _jsxs(Link, { to: "/login", className: "font-medium text-primary hover:text-primary-dark flex items-center", children: [_jsx(ArrowLeftIcon, { className: "mr-1 h-4 w-4" }), "Voltar para o login"] }) }) })] })] }) })] }));
};
export default ResetPassword;
