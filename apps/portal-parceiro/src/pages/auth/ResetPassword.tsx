import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LockClosedIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const ResetPassword: React.FC = () => {
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
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

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
      } catch (error) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Não foi possível redefinir sua senha. O link pode ter expirado.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (tokenValid === null) {
    // Carregando
    return (
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
          <h2 className="mt-6 text-center text-xl font-medium text-gray-900">
            Verificando link de redefinição...
          </h2>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    // Token inválido
    return (
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <img
              className="mx-auto h-12 w-auto"
              src="/logo.svg"
              alt="Edunéxia"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Link inválido
          </h2>
          <div className="mt-2 text-center text-sm text-gray-600">
            <p className="mt-1">
              {message?.text || 'Este link de redefinição é inválido ou expirou.'}
            </p>
            <div className="mt-4">
              <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark flex items-center justify-center">
                <ArrowLeftIcon className="mr-1 h-4 w-4" />
                Solicitar novo link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="Edunéxia"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Redefinir Senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Digite sua nova senha para continuar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div 
              className={`mb-4 p-4 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-l-4 border-green-400 text-green-700 flex items-start' 
                  : 'bg-red-50 border-l-4 border-red-400 text-red-700'
              }`}
            >
              {message.type === 'success' && (
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nova Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  disabled={submitting || message?.type === 'success'}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Mínimo de 8 caracteres</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Nova Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="********"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={submitting || message?.type === 'success'}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={submitting || message?.type === 'success'}
              >
                {submitting ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-sm">
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark flex items-center">
                  <ArrowLeftIcon className="mr-1 h-4 w-4" />
                  Voltar para o login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 