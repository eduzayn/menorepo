import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, UserIcon, BuildingOfficeIcon, PhoneIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signUp } = useAuth();
    // Obter o token de convite da URL se existir
    const queryParams = new URLSearchParams(location.search);
    const inviteToken = queryParams.get('token') || '';
    const inviteEmail = queryParams.get('email') || '';
    const [form, setForm] = useState({
        nome: '',
        email: inviteEmail,
        telefone: '',
        cargo: '',
        instituicao: '',
        senha: '',
        confirmarSenha: ''
    });
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState(null);
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
        if (form.senha !== form.confirmarSenha) {
            setError('As senhas não coincidem');
            return;
        }
        if (form.senha.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres');
            return;
        }
        setRegistering(true);
        setError(null);
        try {
            // Simulação de registro
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Em produção:
            // await signUp({
            //   email: form.email,
            //   password: form.senha,
            //   nome: form.nome,
            //   telefone: form.telefone,
            //   cargo: form.cargo,
            //   inviteToken
            // });
            // Redirecionar para login após o registro
            navigate('/login', {
                state: {
                    message: 'Cadastro realizado com sucesso! Você já pode fazer login.'
                }
            });
        }
        catch (error) {
            console.error('Erro ao registrar:', error);
            setError('Não foi possível completar o registro. Verifique se o email já está cadastrado ou se o convite é válido.');
        }
        finally {
            setRegistering(false);
        }
    };
    return (_jsxs("div", { className: "min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("div", { className: "flex justify-center", children: _jsx("img", { className: "mx-auto h-12 w-auto", src: "/logo.svg", alt: "Edun\u00E9xia" }) }), _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Crie sua conta" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: inviteToken
                            ? 'Complete seu cadastro para acessar o Portal do Parceiro'
                            : 'Cadastre-se para acessar o Portal do Parceiro' })] }), _jsx("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: _jsxs("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: [error && (_jsx("div", { className: "mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700", children: error })), _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "nome", className: "block text-sm font-medium text-gray-700", children: "Nome Completo" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(UserIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { id: "nome", name: "nome", type: "text", autoComplete: "name", required: true, className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", placeholder: "Seu nome completo", value: form.nome, onChange: handleChange, disabled: registering })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "E-mail" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(EnvelopeIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, className: `focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${inviteEmail ? 'bg-gray-50' : ''}`, placeholder: "seu@email.com", value: form.email, onChange: handleChange, disabled: !!inviteEmail || registering })] }), inviteEmail && (_jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Este e-mail foi pr\u00E9-preenchido com base no seu convite" }))] }), _jsxs("div", { className: "grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "telefone", className: "block text-sm font-medium text-gray-700", children: "Telefone" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(PhoneIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { id: "telefone", name: "telefone", type: "tel", autoComplete: "tel", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", placeholder: "(00) 00000-0000", value: form.telefone, onChange: handleChange, disabled: registering })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "cargo", className: "block text-sm font-medium text-gray-700", children: "Cargo" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(UserIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { id: "cargo", name: "cargo", type: "text", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", placeholder: "Seu cargo", value: form.cargo, onChange: handleChange, disabled: registering })] })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "instituicao", className: "block text-sm font-medium text-gray-700", children: "Institui\u00E7\u00E3o" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(BuildingOfficeIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { id: "instituicao", name: "instituicao", type: "text", className: `focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${inviteToken ? 'bg-gray-50' : ''}`, placeholder: "Nome da institui\u00E7\u00E3o", value: form.instituicao, onChange: handleChange, disabled: !!inviteToken || registering })] }), inviteToken && (_jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Voc\u00EA ser\u00E1 vinculado \u00E0 institui\u00E7\u00E3o do convite" }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "senha", className: "block text-sm font-medium text-gray-700", children: "Senha" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { id: "senha", name: "senha", type: "password", autoComplete: "new-password", required: true, minLength: 8, className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", placeholder: "********", value: form.senha, onChange: handleChange, disabled: registering })] }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "M\u00EDnimo de 8 caracteres" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmarSenha", className: "block text-sm font-medium text-gray-700", children: "Confirmar Senha" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { id: "confirmarSenha", name: "confirmarSenha", type: "password", autoComplete: "new-password", required: true, minLength: 8, className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", placeholder: "********", value: form.confirmarSenha, onChange: handleChange, disabled: registering })] })] }), _jsx("div", { children: _jsx("button", { type: "submit", className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary", disabled: registering, children: registering ? 'Registrando...' : 'Cadastrar' }) }), _jsx("div", { className: "flex items-center justify-center", children: _jsx("div", { className: "text-sm", children: _jsxs(Link, { to: "/login", className: "font-medium text-primary hover:text-primary-dark flex items-center", children: [_jsx(ArrowLeftIcon, { className: "mr-1 h-4 w-4" }), "J\u00E1 possui conta? Fa\u00E7a login"] }) }) })] }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-500", children: "Precisa de ajuda?" }) })] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("a", { href: "mailto:suporte@edunexia.com", className: "text-sm font-medium text-primary hover:text-primary-dark", children: "Contatar suporte" }) })] })] }) })] }));
};
export default Register;
