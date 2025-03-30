import React, { useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

interface LocationState {
  planName?: string;
  institutionName?: string;
  email?: string;
}

const TrialSuccessPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Redirect if accessed directly without state
  if (!state || !state.planName) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Período de teste iniciado!</h1>
            <p className="mt-4 text-lg text-gray-500">
              Você agora tem acesso gratuito ao {state.planName} pelos próximos 14 dias.
            </p>
          </div>

          <div className="mt-12 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Detalhes do seu teste</h2>
              <div className="mt-4 text-sm text-gray-600">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <span className="block text-gray-500">Instituição:</span>
                    <span className="font-medium">{state.institutionName}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Plano:</span>
                    <span className="font-medium">{state.planName}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Período de teste gratuito
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Duração do teste:</span>
                    <span className="font-medium">14 dias (sem compromisso)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Próximos passos</h2>
              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">1. Verifique seu email</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Enviamos um email para <span className="font-medium">{state.email}</span> com suas credenciais de acesso e instruções para configurar sua conta.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">2. Acesse sua plataforma</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Use o link abaixo para acessar sua plataforma Edunéxia. Suas credenciais temporárias estão no email que enviamos.
                  </p>
                  <div className="mt-3">
                    <a
                      href="https://app.edunexia.com/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Acessar plataforma
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">3. Explore os recursos</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Utilize o período de teste gratuito para explorar todos os recursos disponíveis no seu plano e avaliar se atendem às necessidades da sua instituição.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">4. Decida ao final do período</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Ao final dos 14 dias, você poderá escolher um plano de assinatura ou simplesmente deixar expirar sem cobranças.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg overflow-hidden shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Sem compromisso</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Seu período de teste é completamente gratuito e sem necessidade de cartão de crédito. Após os 14 dias, você pode optar por continuar com um dos nossos planos ou simplesmente não fazer nada - não haverá cobranças automáticas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
            >
              <svg className="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialSuccessPage; 