import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-150px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div>
            <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Página não encontrada</h2>
            <p className="mt-2 text-gray-600">
              Desculpe, a página que você está procurando não existe ou foi movida.
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
    </Layout>
  );
} 