import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({
        type: 'error',
        text: 'Por favor, informe seu e-mail.'
      });
      return;
    }
    
    setSubmitting(true);
    setMessage(null);
    
    try {
      // Simulação de envio
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em produção:
      // await resetPassword(email);
      
      setMessage({
        type: 'success',
        text: 'Enviamos um e-mail com instruções para redefinir sua senha. Por favor, verifique sua caixa de entrada.'
      });
      
      // Limpar formulário
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Não foi possível enviar o e-mail de recuperação. Verifique se o e-mail está correto e tente novamente.'
      });
    } finally {
      setSubmitting(false);
    }
  };

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
          Recuperar Senha
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Informe seu e-mail para receber instruções de recuperação
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div 
              className={`mb-4 p-4 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-l-4 border-green-400 text-green-700' 
                  : 'bg-red-50 border-l-4 border-red-400 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Enviar instruções'}
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Precisa de ajuda?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="mailto:suporte@edunexia.com"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                Contatar suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 