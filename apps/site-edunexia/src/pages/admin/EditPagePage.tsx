import { useParams, Navigate } from 'react-router-dom';
import { PageForm } from '../../components/admin/PageForm';
import { usePageById } from '../../hooks/usePages';

const EditPagePage = () => {
  // Obter ID da URL
  const { id } = useParams<{ id: string }>();
  
  // Buscar dados da página
  const { data: page, isLoading, error } = usePageById(id || '');
  
  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="space-y-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar página</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Não foi possível carregar os dados da página. Verifique o ID e tente novamente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!page) {
    return <Navigate to="/admin/paginas" replace />;
  }
  
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Página</h1>
        <p className="text-gray-600 mt-1">
          Edite a página "{page.title}"
        </p>
      </div>
      
      <PageForm mode="edit" initialData={page} />
    </div>
  );
};

export default EditPagePage; 