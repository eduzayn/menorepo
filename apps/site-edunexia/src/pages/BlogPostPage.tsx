import React from 'react';
import { useParams } from 'react-router-dom';

interface BlogPostPageProps {
  // Propriedades do componente
}

const BlogPostPage: React.FC<BlogPostPageProps> = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Post do Blog</h1>
        <p className="text-gray-600 mb-6">Exibindo post: {slug}</p>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Título do Post</h2>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Publicado em: 30/03/2024</span>
            <span className="mx-2">•</span>
            <span>Por: Equipe Edunéxia</span>
          </div>
          
          <div className="prose max-w-none">
            <p>Este é um componente de exibição para posts do blog. O conteúdo real seria carregado com base no slug: <strong>{slug}</strong>.</p>
            <p className="mt-4">Em uma implementação real, buscaríamos o conteúdo em uma API ou banco de dados.</p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Comentários</h3>
            <p className="text-gray-500">Funcionalidade em desenvolvimento.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage; 