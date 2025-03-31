import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import './login.css';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { signIn, user, isLoading } = auth;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginFormData>({
    email: 'admin@edunexia.com.br',
    password: 'admin123',
  });

  // Log para verificar o estado inicial
  useEffect(() => {
    console.log('LoginPage mount - Auth state:', { user, isLoading, auth });
  }, []);

  // Redirecionar se já estiver logado
  useEffect(() => {
    console.log('LoginPage auth change:', { user, isLoading });
    if (!isLoading && user) {
      console.log('Usuário já autenticado, redirecionando para portal-selector');
      // Redirecionar para o seletor de portais após o login
      navigate('/portal-selector', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const validateForm = () => {
    if (!formData.email) {
      setFormError('Por favor, informe seu e-mail');
      return false;
    }

    if (!formData.password) {
      setFormError('Por favor, informe sua senha');
      return false;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Por favor, informe um e-mail válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    console.log('Tentando fazer login com:', formData.email);

    try {
      await signIn(formData.email, formData.password);
      // Redirecionar imediatamente após login bem-sucedido
      console.log('Login bem-sucedido, redirecionando para portal-selector');
      navigate('/portal-selector', { replace: true });
    } catch (error) {
      console.error('Erro no login:', error);
      setFormError('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <img src="/logo-edunexia.svg" alt="Edunéxia" className="h-16" />
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Acesso ao Sistema
          </h1>

          {formError && (
            <div className="mb-6 flex items-center rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="seu@email.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Sua senha"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-primary-600 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
              Esqueceu sua senha?
            </a>
          </div>
          
          {/* Dica sobre credenciais para facilitar testes */}
          <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-700">
            <p className="font-medium mb-1">Credenciais para teste:</p>
            <p>Admin: admin@edunexia.com.br / admin123</p>
            <p>Professor: professor@edunexia.com.br / prof123</p>
            <p>Aluno: aluno@edunexia.com.br / aluno123</p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Edunéxia - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 