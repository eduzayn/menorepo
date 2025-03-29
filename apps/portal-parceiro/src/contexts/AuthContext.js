import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';
const defaultContext = {
    user: null,
    profile: null,
    loading: true,
    signIn: async () => ({ error: null, data: null }),
    signUp: async () => ({ error: null, data: null }),
    signOut: async () => { },
    resetPassword: async () => ({ error: null }),
    updatePassword: async () => ({ error: null }),
    completePasswordReset: async () => ({ error: null }),
    updateProfile: async () => ({ error: null }),
};
export const AuthContext = createContext(defaultContext);
/**
 * Provider de autenticação
 * Em produção, este componente seria substituído pelo equivalente de @edunexia/auth
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Verificar autenticação atual e obter sessão
        const getSession = async () => {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(session.user);
                    await getProfile(session.user.id);
                }
            }
            catch (error) {
                console.error('Erro ao obter sessão:', error);
            }
            finally {
                setLoading(false);
            }
        };
        getSession();
        // Configurar listener para mudanças na autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user);
                await getProfile(session.user.id);
            }
            else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
            }
        });
        return () => subscription.unsubscribe();
    }, []);
    // Buscar perfil do usuário
    const getProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) {
                throw error;
            }
            if (data) {
                setProfile(data);
            }
        }
        catch (error) {
            console.error('Erro ao buscar perfil:', error);
        }
    };
    // Login com email/senha
    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return { data, error };
        }
        catch (error) {
            console.error('Erro ao fazer login:', error);
            return { data: null, error };
        }
    };
    // Registro de novo usuário
    const signUp = async ({ email, password, nome, telefone, cargo, inviteToken }) => {
        try {
            // Registrar usuário com Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nome,
                        telefone,
                        cargo
                    }
                }
            });
            if (error)
                throw error;
            if (data?.user) {
                // Criar perfil do usuário no banco
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                    {
                        id: data.user.id,
                        nome,
                        telefone: telefone || '',
                        cargo: cargo || '',
                        invite_token: inviteToken || null
                    }
                ]);
                if (profileError)
                    throw profileError;
            }
            return { data, error: null };
        }
        catch (error) {
            console.error('Erro ao registrar usuário:', error);
            return { data: null, error };
        }
    };
    // Logout
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
        }
        catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };
    // Recuperação de senha
    const resetPassword = async (email) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            return { error };
        }
        catch (error) {
            console.error('Erro ao solicitar recuperação de senha:', error);
            return { error };
        }
    };
    // Completar o processo de redefinição de senha
    const completePasswordReset = async ({ token, newPassword }) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            return { error };
        }
        catch (error) {
            console.error('Erro ao redefinir senha:', error);
            return { error };
        }
    };
    // Atualizar senha
    const updatePassword = async (password) => {
        try {
            const { error } = await supabase.auth.updateUser({
                password,
            });
            return { error };
        }
        catch (error) {
            console.error('Erro ao atualizar senha:', error);
            return { error };
        }
    };
    // Atualizar perfil do usuário
    const updateProfile = async (profileData) => {
        if (!user)
            return { error: new Error('Usuário não autenticado') };
        try {
            // Atualizar perfil no banco
            const { error } = await supabase
                .from('profiles')
                .update(profileData)
                .eq('id', user.id);
            if (error)
                throw error;
            // Atualizar estado local
            setProfile({ ...profile, ...profileData });
            return { error: null };
        }
        catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return { error };
        }
    };
    const value = {
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        completePasswordReset,
        updateProfile,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
// Hook personalizado para acessar o contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
