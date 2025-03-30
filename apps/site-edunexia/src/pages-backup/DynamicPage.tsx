import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePageBySlug } from '../hooks/usePages';

// Mapeamento de slugs para módulos (fallback)
const SLUG_TO_MODULE_MAP: Record<string, string> = {
  'sistema-matriculas': '/matriculas',
  'portal-aluno': '/portal-do-aluno',
  'gestao-financeira': '/financeiro',
  'material-didatico': '/material-didatico',
  'comunicacao': '/comunicacao',
  'portal-polo': '/portal-polo',
  'portal-parceiro': '/portal-parceiro'
};

export function DynamicPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determinar qual slug usar
  const pageSlug = slug || (location.pathname === '/planos' ? 'planos' : '');
  
  // Buscar página pelo slug
  const { data: page, isLoading, error } = usePageBySlug(pageSlug);

  // Redirecionar com base no slug se página não for encontrada
  useEffect(() => {
    if (!isLoading && !page && !error && pageSlug) {
      // Verificar se há um módulo correspondente para redirecionar
      const moduleRedirect = SLUG_TO_MODULE_MAP[pageSlug];
      if (moduleRedirect) {
        navigate(moduleRedirect, { replace: true });
      } else {
        // Redirecionar para a home se não houver módulo correspondente
        navigate('/', { replace: true });
      }
    }
  }, [page, isLoading, error, navigate, pageSlug]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5 w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5 w-4/5"></div>
          <div className="h-64 bg-gray-200 rounded my-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-2.5 w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Erro ao carregar página</h1>
          <p className="text-red-600 mb-6">
            Não foi possível carregar o conteúdo desta página. Por favor, tente novamente mais tarde.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Página não encontrada</h1>
          <p className="text-gray-600 mb-6">
            A página que você está procurando não existe ou foi removida.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // Renderizar SEO
  const metaDescription = page.meta_description || `${page.title} - Edunéxia`;
  const metaKeywords = page.meta_keywords || 'edunexia, educação, tecnologia';

  // Helper para renderizar conteúdo estruturado
  const renderContent = () => {
    // Se for JSON estruturado, renderizar conforme tipo de cada bloco
    if (page.content) {
      try {
        // Exemplo simples - na prática você precisaria de um parser mais robusto
        // para lidar com diferentes tipos de blocos (texto, imagem, vídeo, etc)
        if (typeof page.content === 'string') {
          return <div dangerouslySetInnerHTML={{ __html: page.content }} />;
        }
        
        // Renderizar conteúdo estruturado (blocos)
        if (Array.isArray(page.content.blocks)) {
          return (
            <div className="space-y-8">
              {page.content.blocks.map((block: any, index: number) => {
                if (block.type === 'paragraph') {
                  return <p key={index} className="text-gray-700">{block.content}</p>;
                }
                if (block.type === 'heading') {
                  return <h2 key={index} className="text-2xl font-bold text-primary-800 mt-8 mb-4">{block.content}</h2>;
                }
                if (block.type === 'image' && block.url) {
                  return (
                    <figure key={index} className="my-6">
                      <img 
                        src={block.url.replace('via.placeholder.com', 'placehold.co')} 
                        alt={block.alt || ''} 
                        className="rounded-lg w-full" 
                      />
                      {block.caption && <figcaption className="text-sm text-gray-500 mt-2">{block.caption}</figcaption>}
                    </figure>
                  );
                }
                return null;
              })}
            </div>
          );
        }
        
        // Fallback para objeto simples
        return <pre className="p-4 bg-gray-100 rounded overflow-auto">{JSON.stringify(page.content, null, 2)}</pre>;
      } catch (e) {
        console.error("Erro ao renderizar conteúdo:", e);
        return <p className="text-red-600">Erro ao renderizar conteúdo da página.</p>;
      }
    }
    
    return <p className="text-gray-600">Esta página não possui conteúdo.</p>;
  };

  return (
    <>
      {/* SEO */}
      <div className="hidden">
        <title>{page.title} - Edunéxia</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
      </div>
      
      <div className="container mx-auto py-12 px-4">
        {/* Imagem de destaque */}
        {page.featured_image_url && (
          <div className="mb-8">
            <img 
              src={page.featured_image_url.replace('via.placeholder.com', 'placehold.co')} 
              alt={page.title} 
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        
        {/* Título e meta */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-4">{page.title}</h1>
          {page.published_at && (
            <p className="text-gray-500">
              Publicado em: {new Date(page.published_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
        
        {/* Conteúdo */}
        <div className="prose prose-lg max-w-none">
          {renderContent()}
        </div>
      </div>
    </>
  );
} 