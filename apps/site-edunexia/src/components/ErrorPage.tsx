import { Link, useRouteError } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import React from 'react';

interface ErrorPageProps {
  status?: number;
  title?: string;
  message?: string;
}

export default function ErrorPage({ 
  status = 404, 
  title = "Página não encontrada",
  message = "Desculpe, a página que você está procurando não existe ou foi movida."
}: ErrorPageProps) {
  // Tentar pegar informações do erro de rota, se disponível
  const error = useRouteError() as any;
  const errorStatus = error?.status || status;
  const errorTitle = 
    errorStatus === 404 ? "Página não encontrada" :
    errorStatus === 403 ? "Acesso Negado" :
    errorStatus === 500 ? "Erro no Servidor" :
    title;
  
  const errorMessage = error?.message || message;

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-9xl font-extrabold text-primary-600">{errorStatus}</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{errorTitle}</h2>
          <p className="mt-2 text-gray-600">
            {errorMessage}
          </p>
        </div>
        
        <div className="mt-8 flex flex-col space-y-4">
          <Link
            to="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Voltar para página inicial
          </Link>
          
          <Link
            to="/contato"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Entrar em contato
          </Link>
        </div>
      </div>
    </div>
  );
}

// Componente específico para erro 404
export const NotFoundError: React.FC = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-primary-600 sm:text-5xl">404</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Página não encontrada
              </h1>
              <p className="mt-1 text-base text-gray-500">
                Verifique o URL ou tente navegar para outra página.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Voltar para a página inicial
              </Link>
              <Link
                to="/contato"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Fale conosco
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Componente específico para erro de acesso negado
export function ForbiddenError() {
  return <ErrorPage 
    status={403}
    title="Acesso Negado" 
    message="Você não possui permissão para acessar esta página."
  />;
}

// Componente específico para erro de servidor
export function ServerError() {
  return <ErrorPage 
    status={500}
    title="Erro no Servidor" 
    message="Ocorreu um erro no servidor. Tente novamente mais tarde."
  />;
} 