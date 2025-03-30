import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BlogPostCard from '../components/BlogPostCard';
import { 
  useBlogPostBySlug, 
  useBlogAuthorById, 
  useBlogCategories, 
  usePublishedBlogPosts 
} from '../hooks/useBlog';

export function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Buscar post pelo slug
  const { data: post, isLoading, error } = useBlogPostBySlug(slug);
  
  // Buscar autor do post (se post estiver carregado)
  const { data: author } = useBlogAuthorById(post?.author_id || '');
  
  // Buscar todas as categorias para poder filtrar as do post
  const { data: categories } = useBlogCategories();
  
  // Buscar posts relacionados
  const { data: relatedPostsData } = usePublishedBlogPosts({
    limit: 3,
    // Não passamos categoryId para mostrar posts recentes em geral,
    // mas poderíamos filtrar por categoria se quiséssemos posts realmente relacionados
  });
  
  // Redirecionar para o blog se o post não for encontrado
  useEffect(() => {
    if (!isLoading && !post && !error) {
      navigate('/blog', { replace: true });
    }
  }, [post, isLoading, error, navigate]);
  
  // Encontrar categorias do post
  const postCategories = categories?.filter(
    cat => post?.category_ids.includes(cat.id)
  ) || [];
  
  // Formatar data
  const formattedDate = post?.published_at 
    ? new Date(post.published_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : '';
  
  // Estado de carregamento
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Estado de erro
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-red-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Erro ao carregar post</h2>
            <p className="text-red-600 mb-4">
              Não foi possível carregar o conteúdo deste artigo. Por favor, tente novamente mais tarde.
            </p>
            <Link 
              to="/blog" 
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
            >
              Voltar ao blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Caso o post não exista
  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Post não encontrado</h2>
            <p className="text-gray-600 mb-4">
              O artigo que você está procurando não está disponível ou foi removido.
            </p>
            <Link 
              to="/blog" 
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
            >
              Voltar ao blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Renderizar SEO
  const metaDescription = post.meta_description || post.excerpt || `${post.title} - Blog Edunéxia`;
  const metaKeywords = post.meta_keywords || 'edunexia, blog, educação, tecnologia';
  
  // Helper para renderizar conteúdo estruturado
  const renderContent = () => {
    // Se for JSON estruturado, renderizar conforme tipo de cada bloco
    if (post.content) {
      try {
        // Exemplo simples - na prática você precisaria de um parser mais robusto
        // para lidar com diferentes tipos de blocos (texto, imagem, vídeo, etc)
        if (typeof post.content === 'string') {
          return <div dangerouslySetInnerHTML={{ __html: post.content }} />;
        }
        
        // Renderizar conteúdo estruturado (blocos)
        if (Array.isArray(post.content.blocks)) {
          return (
            <div className="space-y-6">
              {post.content.blocks.map((block: any, index: number) => {
                if (block.type === 'paragraph') {
                  return <p key={index} className="text-gray-700 leading-relaxed">{block.content}</p>;
                }
                if (block.type === 'heading') {
                  return <h2 key={index} className="text-2xl font-bold text-primary-800 mt-8 mb-4">{block.content}</h2>;
                }
                if (block.type === 'image' && block.url) {
                  return (
                    <figure key={index} className="my-8">
                      <img src={block.url} alt={block.alt || ''} className="rounded-lg w-full" />
                      {block.caption && <figcaption className="text-sm text-gray-500 mt-2 text-center">{block.caption}</figcaption>}
                    </figure>
                  );
                }
                if (block.type === 'list' && Array.isArray(block.items)) {
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-2">
                      {block.items.map((item: string, i: number) => (
                        <li key={i} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  );
                }
                return null;
              })}
            </div>
          );
        }
        
        // Fallback para objeto simples
        return <pre className="p-4 bg-gray-100 rounded overflow-auto">{JSON.stringify(post.content, null, 2)}</pre>;
      } catch (e) {
        console.error("Erro ao renderizar conteúdo:", e);
        return <p className="text-red-600">Erro ao renderizar conteúdo do post.</p>;
      }
    }
    
    return <p className="text-gray-600">Este post não possui conteúdo.</p>;
  };
  
  // Renderizar posts relacionados
  const relatedPosts = relatedPostsData?.posts
    ?.filter(p => p.id !== post.id) // Excluir o post atual
    ?.slice(0, 3) || []; // Limitar a 3
  
  return (
    <Layout>
      {/* SEO */}
      <div className="hidden">
        <title>{post.title} - Blog Edunéxia</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        {post.featured_image_url && <meta property="og:image" content={post.featured_image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
      </div>
      
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-primary-600">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{post.title}</span>
          </nav>
          
          {/* Categorias */}
          <div className="flex flex-wrap gap-2 mb-4">
            {postCategories.map(category => (
              <Link 
                key={category.id} 
                to={`/blog?categoria=${category.slug}`}
                className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-100 transition"
              >
                {category.name}
              </Link>
            ))}
          </div>
          
          {/* Título e meta */}
          <h1 className="text-4xl font-bold text-primary-900 mb-4">{post.title}</h1>
          
          {/* Info do autor e data */}
          <div className="flex items-center mb-8">
            <div className="flex items-center">
              {author?.avatar_url ? (
                <img 
                  src={author.avatar_url} 
                  alt={author.name}
                  className="w-10 h-10 rounded-full mr-3" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <span className="text-primary-700 font-medium">
                    {author?.name.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{author?.name}</p>
                <div className="text-sm text-gray-500">{formattedDate}</div>
              </div>
            </div>
          </div>
          
          {/* Imagem de destaque */}
          {post.featured_image_url && (
            <div className="mb-8">
              <img 
                src={post.featured_image_url} 
                alt={post.title} 
                className="w-full rounded-lg shadow-md" 
              />
            </div>
          )}
          
          {/* Conteúdo */}
          <div className="prose prose-lg max-w-none">
            {renderContent()}
          </div>
          
          {/* Bio do autor */}
          {author && author.bio && (
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                {author.avatar_url ? (
                  <img 
                    src={author.avatar_url} 
                    alt={author.name}
                    className="w-16 h-16 rounded-full mr-4" 
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <span className="text-xl text-primary-700 font-medium">
                      {author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sobre {author.name}</h3>
                  <p className="text-gray-600 text-sm">{author.bio}</p>
                  
                  {/* Links sociais */}
                  {author.social_links && Object.keys(author.social_links).length > 0 && (
                    <div className="mt-3 flex space-x-3">
                      {Object.entries(author.social_links).map(([platform, url]) => (
                        <a 
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-primary-600"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Posts relacionados */}
        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-primary-800 mb-6">Posts relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <BlogPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}
        
        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">
              Gostou do conteúdo?
            </h2>
            <p className="text-primary-700 mb-6">
              Conheça as soluções da Edunéxia para sua instituição de ensino.
            </p>
            <Link 
              to="/contato" 
              className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition"
            >
              Agende uma demonstração
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}

export default BlogPostPage; 