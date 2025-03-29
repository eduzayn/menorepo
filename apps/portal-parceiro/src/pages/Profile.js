import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { UserIcon, BuildingOfficeIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
const Profile = () => {
    const { user, profile, updateProfile, updatePassword } = useAuth();
    const [profileForm, setProfileForm] = useState({
        nome: profile?.nome || '',
        email: user?.email || '',
        telefone: profile?.telefone || '',
        cargo: profile?.cargo || '',
        instituicao: profile?.instituicao_nome || '',
        bio: profile?.bio || ''
    });
    const [passwordForm, setPasswordForm] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });
    const [updating, setUpdating] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [alert, setAlert] = useState(null);
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setAlert(null);
        try {
            // Simular atualização de perfil
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Em produção:
            // await updateProfile({
            //   nome: profileForm.nome,
            //   telefone: profileForm.telefone,
            //   cargo: profileForm.cargo,
            //   bio: profileForm.bio
            // });
            setAlert({
                type: 'success',
                message: 'Perfil atualizado com sucesso!'
            });
        }
        catch (error) {
            setAlert({
                type: 'error',
                message: 'Erro ao atualizar perfil. Por favor, tente novamente.'
            });
        }
        finally {
            setUpdating(false);
        }
    };
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
            setAlert({
                type: 'error',
                message: 'As senhas não coincidem'
            });
            return;
        }
        setChangingPassword(true);
        setAlert(null);
        try {
            // Simular atualização de senha
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Em produção:
            // await updatePassword({
            //   currentPassword: passwordForm.senhaAtual,
            //   newPassword: passwordForm.novaSenha
            // });
            setAlert({
                type: 'success',
                message: 'Senha atualizada com sucesso!'
            });
            setPasswordForm({
                senhaAtual: '',
                novaSenha: '',
                confirmarSenha: ''
            });
        }
        catch (error) {
            setAlert({
                type: 'error',
                message: 'Erro ao atualizar senha. Verifique se a senha atual está correta.'
            });
        }
        finally {
            setChangingPassword(false);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Meu Perfil" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Atualize suas informa\u00E7\u00F5es pessoais e prefer\u00EAncias" })] }), alert && (_jsx("div", { className: `mt-6 p-4 ${alert.type === 'success' ? 'bg-green-50 text-green-800 border-green-400' : 'bg-red-50 text-red-800 border-red-400'} border-l-4 rounded-md`, children: alert.message })), _jsxs("div", { className: "mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6", children: [_jsx("div", { className: "sm:col-span-6", children: _jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsxs("div", { className: "px-4 py-5 sm:px-6 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Informa\u00E7\u00F5es do Perfil" }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "Dados pessoais e de contato" })] }), _jsx(UserIcon, { className: "h-8 w-8 text-primary" })] }), _jsx("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-6", children: _jsxs("form", { onSubmit: handleProfileSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6", children: [_jsxs("div", { className: "sm:col-span-3", children: [_jsx("label", { htmlFor: "nome", className: "block text-sm font-medium text-gray-700", children: "Nome Completo" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(UserIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "text", name: "nome", id: "nome", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", value: profileForm.nome, onChange: handleProfileChange, required: true })] })] }), _jsxs("div", { className: "sm:col-span-3", children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "E-mail" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(EnvelopeIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "email", name: "email", id: "email", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md bg-gray-50", value: profileForm.email, disabled: true })] }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Para alterar o e-mail, contate o administrador" })] }), _jsxs("div", { className: "sm:col-span-3", children: [_jsx("label", { htmlFor: "telefone", className: "block text-sm font-medium text-gray-700", children: "Telefone" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(PhoneIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "tel", name: "telefone", id: "telefone", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", value: profileForm.telefone, onChange: handleProfileChange })] })] }), _jsxs("div", { className: "sm:col-span-3", children: [_jsx("label", { htmlFor: "cargo", className: "block text-sm font-medium text-gray-700", children: "Cargo" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(UserIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "text", name: "cargo", id: "cargo", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", value: profileForm.cargo, onChange: handleProfileChange })] })] }), _jsxs("div", { className: "sm:col-span-6", children: [_jsx("label", { htmlFor: "instituicao", className: "block text-sm font-medium text-gray-700", children: "Institui\u00E7\u00E3o" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(BuildingOfficeIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "text", name: "instituicao", id: "instituicao", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md bg-gray-50", value: profileForm.instituicao, disabled: true })] }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Voc\u00EA est\u00E1 vinculado a esta institui\u00E7\u00E3o" })] }), _jsxs("div", { className: "sm:col-span-6", children: [_jsx("label", { htmlFor: "bio", className: "block text-sm font-medium text-gray-700", children: "Bio / Informa\u00E7\u00F5es Adicionais" }), _jsx("div", { className: "mt-1", children: _jsx("textarea", { id: "bio", name: "bio", rows: 3, className: "shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md", value: profileForm.bio, onChange: handleProfileChange }) }), _jsx("p", { className: "mt-2 text-sm text-gray-500", children: "Breve descri\u00E7\u00E3o sobre voc\u00EA." })] })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { type: "submit", className: "ml-3 btn-primary", disabled: updating, children: updating ? 'Salvando...' : 'Salvar Perfil' }) })] }) })] }) }), _jsx("div", { className: "sm:col-span-6", children: _jsxs("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg", children: [_jsxs("div", { className: "px-4 py-5 sm:px-6 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "Seguran\u00E7a" }), _jsx("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: "Altere sua senha" })] }), _jsx(LockClosedIcon, { className: "h-8 w-8 text-primary" })] }), _jsx("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-6", children: _jsxs("form", { onSubmit: handlePasswordSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6", children: [_jsxs("div", { className: "sm:col-span-6", children: [_jsx("label", { htmlFor: "senhaAtual", className: "block text-sm font-medium text-gray-700", children: "Senha Atual" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "password", name: "senhaAtual", id: "senhaAtual", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", value: passwordForm.senhaAtual, onChange: handlePasswordChange, required: true })] })] }), _jsxs("div", { className: "sm:col-span-3", children: [_jsx("label", { htmlFor: "novaSenha", className: "block text-sm font-medium text-gray-700", children: "Nova Senha" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "password", name: "novaSenha", id: "novaSenha", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", value: passwordForm.novaSenha, onChange: handlePasswordChange, minLength: 8, required: true })] }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "M\u00EDnimo de 8 caracteres" })] }), _jsxs("div", { className: "sm:col-span-3", children: [_jsx("label", { htmlFor: "confirmarSenha", className: "block text-sm font-medium text-gray-700", children: "Confirmar Nova Senha" }), _jsxs("div", { className: "mt-1 relative rounded-md shadow-sm", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(LockClosedIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) }), _jsx("input", { type: "password", name: "confirmarSenha", id: "confirmarSenha", className: "focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md", value: passwordForm.confirmarSenha, onChange: handlePasswordChange, minLength: 8, required: true })] })] })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { type: "submit", className: "ml-3 btn-primary", disabled: changingPassword, children: changingPassword ? 'Alterando...' : 'Alterar Senha' }) })] }) })] }) })] })] }));
};
export default Profile;
