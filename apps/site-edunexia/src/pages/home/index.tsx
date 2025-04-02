import React from 'react';
import { usePublishedPages } from '@/hooks/usePages';
import { usePublishedBlogPosts } from '@/hooks/useBlog';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const HomePage: React.FC = () => {
  const { data: pages } = usePublishedPages();
  const { data: blogData } = usePublishedBlogPosts();

  return (
    <>
      <Helmet>
        <title>Edunéxia - Plataforma Educacional Completa</title>
        <meta name="description" content="A Edunéxia é uma plataforma educacional completa que oferece soluções para gestão escolar, portal do aluno, material didático e muito mais." />
      </Helmet>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                Transforme a gestão da sua escola
              </h1>
              <p className="text-xl mb-8">
                Uma plataforma completa para escolas e instituições de ensino.
                Simplifique processos, melhore a comunicação e potencialize o aprendizado.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/planos"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Ver planos
                </Link>
                <Link
                  to="/trial"
                  className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
                >
                  Teste grátis
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              Tudo que você precisa em um só lugar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Gestão Escolar</h3>
                <p className="text-gray-600">
                  Simplifique processos administrativos, matrículas e gestão financeira.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Portal do Aluno</h3>
                <p className="text-gray-600">
                  Acesso fácil a notas, frequência, material didático e comunicados.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Material Didático</h3>
                <p className="text-gray-600">
                  Biblioteca digital completa com conteúdo atualizado e interativo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        {blogData?.posts && blogData.posts.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12">
                Blog Edunéxia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogData.posts.slice(0, 3).map((post) => (
                  <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                    {post.featured_image_url && (
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        <Link to={`/blog/${post.slug}`} className="hover:text-primary-600">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{post.author?.name || 'Autor desconhecido'}</span>
                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/blog"
                  className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Ver todos os posts
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-primary-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Comece agora mesmo
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experimente a Edunéxia gratuitamente por 14 dias e descubra como podemos
              transformar a gestão da sua instituição de ensino.
            </p>
            <Link
              to="/trial"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Começar teste grátis
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage; 