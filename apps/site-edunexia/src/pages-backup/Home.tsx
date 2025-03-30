import { useEffect, useState } from 'react';
import { usePublishedPages } from '../hooks/usePages';
import { SitePage } from '@edunexia/database-schema/src/site-edunexia';

export function HomePage() {
  const { data: pages, isLoading, error } = usePublishedPages();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | null>(null);

  useEffect(() => {
    if (pages) {
      setConnectionStatus('connected');
    } else if (error) {
      setConnectionStatus('error');
      console.error('Erro ao buscar páginas:', error);
    }
  }, [pages, error]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Site Edunéxia</h1>
      
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Status da Conexão</h2>
        {isLoading ? (
          <p className="text-gray-600">Verificando conexão com o banco de dados...</p>
        ) : connectionStatus === 'connected' ? (
          <div className="flex items-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Conectado ao banco de dados com sucesso!</span>
          </div>
        ) : connectionStatus === 'error' ? (
          <div className="flex items-center text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Erro ao conectar ao banco de dados. Verifique o console.</span>
          </div>
        ) : null}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Páginas Publicadas</h2>
        {isLoading ? (
          <p className="text-gray-600">Carregando páginas...</p>
        ) : error ? (
          <p className="text-red-600">Erro ao carregar páginas.</p>
        ) : pages && pages.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page: SitePage) => (
              <li key={page.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium mb-2">{page.title}</h3>
                <p className="text-gray-600 mb-2">/{page.slug}</p>
                {page.featured_image_url && (
                  <img 
                    src={page.featured_image_url} 
                    alt={page.title} 
                    className="w-full h-40 object-cover rounded mb-2" 
                  />
                )}
                <p className="text-sm text-gray-500">
                  Publicado em: {new Date(page.published_at || page.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-8 border rounded-lg bg-gray-50">
            <p className="text-gray-600 mb-4">Nenhuma página publicada encontrada.</p>
            <p className="text-sm text-gray-500">
              A conexão com o banco de dados está funcionando, mas não há páginas publicadas.
              Utilize o painel administrativo para criar e publicar páginas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 