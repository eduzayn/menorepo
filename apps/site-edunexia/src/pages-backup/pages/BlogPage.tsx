import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import BlogPostCard from '../components/BlogPostCard';
import { usePublishedBlogPosts, useBlogCategories } from '../hooks/useBlog';

export function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('pagina') || '1', 10);
  const selectedCategorySlug = searchParams.get('categoria') || '';
  
  // Recuperar todas as categorias
  const { data: categories } = useBlogCategories();
  
  // Encontrar ID da categoria se houver um slug selecionado
  const selectedCategory = categories?.find(cat => cat.slug === selectedCategorySlug);
  
  // Buscar posts publicados com paginação
  const { data, isLoading, error } = usePublishedBlogPosts({
    page: currentPage,
    limit: 9,
    categoryId: selectedCategory?.id
  });
  
  // Função para trocar de página
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('pagina', newPage.toString());
    setSearchParams(params);
    window.scrollTo(0, 0);
  };
  
  // Função para filtrar por categoria
  const handleCategoryFilter = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams);
    if (categorySlug) {
      params.set('categoria', categorySlug);
    } else {
      params.delete('categoria');
    }
    params.delete('pagina'); // Reset página ao mudar categoria
    setSearchParams(params);
  };
  
  // Extrair post em destaque (primeiro post)
  const featuredPost = data?.posts[0];
  const regularPosts = data?.posts.slice(1);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header do Blog */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-primary-800 mb-4">Blog da Edunéxia</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Artigos, tutoriais e cases de sucesso sobre tecnologia educacional e gestão de instituições de ensino.
          </p>
        </div>
        
        {/* Categorias */}
        {categories && categories.length > 0 && (
          <div className="mb-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button 
                onClick={() => handleCategoryFilter('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  !selectedCategorySlug 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              
              {categories.map(category => (
                <button 
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategorySlug === category.slug 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div className="py-12">
            <div className="max-w-3xl mx-auto">
              <div className="animate-pulse space-y-8">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="py-12">
            <div className="max-w-md mx-auto bg-red-50 p-6 rounded-lg text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Erro ao carregar posts</h2>
              <p className="text-red-600 mb-4">
                Não foi possível carregar os artigos do blog. Por favor, tente novamente mais tarde.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}
        
        {/* Posts do blog */}
        {!isLoading && !error && data && (
          <>
            {/* Post em destaque */}
            {featuredPost && (
              <div className="mb-12">
                <BlogPostCard post={featuredPost} variant="featured" />
              </div>
            )}
            
            {/* Posts regulares (grid) */}
            {regularPosts && regularPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {regularPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum post encontrado</h3>
                <p className="text-gray-500">
                  {selectedCategorySlug 
                    ? `Não encontramos posts na categoria selecionada.` 
                    : `Ainda não há posts publicados no blog.`}
                </p>
                {selectedCategorySlug && (
                  <button 
                    onClick={() => handleCategoryFilter('')}
                    className="mt-4 text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Ver todos os posts
                  </button>
                )}
              </div>
            )}
            
            {/* Paginação */}
            {data.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-md ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === data.pagination.totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === data.pagination.totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* CTA */}
        <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-800 mb-4">
            Quer receber nossos artigos em primeira mão?
          </h2>
          <p className="text-primary-700 mb-6 max-w-2xl mx-auto">
            Assine nossa newsletter e receba conteúdos exclusivos sobre tecnologia educacional, 
            gestão escolar e as últimas tendências em educação.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="sm:flex-shrink-0 px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition">
              Assinar
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BlogPage; 