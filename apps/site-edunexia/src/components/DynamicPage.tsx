import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePageBySlug } from '../hooks/usePages';

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: page, isLoading, error } = usePageBySlug(slug || '');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (error) {
      navigate('/404');
    }
    
    // Renderizar o conteúdo HTML da página quando disponível
    if (page?.content) {
      // Converter o conteúdo para string se necessário
      const contentString = typeof page.content === 'string' 
        ? page.content 
        : JSON.stringify(page.content);
      
      setContent(contentString);
    }
  }, [page, error, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2.5"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {page?.featured_image_url && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
          <img 
            src={page.featured_image_url} 
            alt={page.title} 
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6 max-w-4xl mx-auto">
        {page?.title}
      </h1>
      
      {page?.published_at && (
        <div className="text-gray-600 mb-8 max-w-4xl mx-auto">
          Publicado em: {new Date(page.published_at).toLocaleDateString('pt-BR')}
        </div>
      )}
      
      {/* Renderizando o conteúdo HTML */}
      <div 
        className="prose prose-lg max-w-4xl mx-auto" 
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
} 