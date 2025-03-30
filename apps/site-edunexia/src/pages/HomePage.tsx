import { Link } from 'react-router-dom';
import { usePublishedPages } from '../hooks/usePages';
import { usePublishedBlogPosts } from '../hooks/useBlog';
import BlogPostCard from '../components/BlogPostCard';

export function HomePage() {
  const { data: pagesData } = usePublishedPages();
  const { data: blogData } = usePublishedBlogPosts({ limit: 3 });
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              Transformando a educação com tecnologia
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              A Edunéxia oferece uma plataforma completa e integrada para instituições 
              de ensino gerenciarem processos acadêmicos, financeiros e administrativos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contato" className="px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition text-center">
                Agende uma demonstração
              </Link>
              <Link to="/planos" className="px-6 py-3 border border-primary-600 text-primary-600 font-medium rounded-md hover:bg-primary-50 transition text-center">
                Conheça nossos planos
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://via.placeholder.com/600x400?text=Edunexia+Platform" 
              alt="Plataforma Edunéxia" 
              className="w-full max-w-lg rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 rounded-xl my-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">
            Soluções para cada necessidade
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nossa plataforma integra todos os módulos essenciais para a gestão educacional moderna
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 flex items-center justify-center rounded-lg mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Sistema de Matrículas</h3>
            <p className="text-gray-600 mb-4">
              Simplifique todo o processo de matrículas, desde a captação de leads até a efetivação e documentação.
            </p>
            <Link 
              to="/pagina/sistema-matriculas" 
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              Saiba mais
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 flex items-center justify-center rounded-lg mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Portal do Aluno</h3>
            <p className="text-gray-600 mb-4">
              Ofereça uma experiência digital completa para alunos acessarem notas, frequência, materiais e financeiro.
            </p>
            <Link 
              to="/pagina/portal-aluno" 
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              Saiba mais
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 flex items-center justify-center rounded-lg mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-3">Gestão Financeira</h3>
            <p className="text-gray-600 mb-4">
              Controle completo sobre mensalidades, boletos, acordos, inadimplência e relatórios financeiros.
            </p>
            <Link 
              to="/pagina/gestao-financeira" 
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              Saiba mais
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Posts recentes do blog */}
      {blogData && blogData.posts && blogData.posts.length > 0 && (
        <section className="py-16 my-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              Blog Edunéxia
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conteúdos exclusivos sobre tecnologia educacional e gestão de instituições de ensino
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {blogData.posts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/blog" 
              className="inline-block px-6 py-3 border border-primary-600 text-primary-600 font-medium rounded-md hover:bg-primary-50 transition"
            >
              Ver todos os artigos
            </Link>
          </div>
        </section>
      )}
      
      {/* Páginas Publicadas */}
      {pagesData && pagesData.length > 0 && (
        <section className="py-16 my-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-4">
              Conteúdos Disponíveis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore nossas páginas informativas e conheça mais sobre nossas soluções
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pagesData.map((page) => (
              <Link 
                to={`/pagina/${page.slug}`} 
                key={page.id}
                className="group bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                {page.featured_image_url && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={page.featured_image_url} 
                      alt={page.title} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-primary-800 mb-2 group-hover:text-primary-600 transition">
                  {page.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {page.meta_description || "Clique para saber mais sobre este conteúdo."}
                </p>
                <div className="text-primary-600 font-medium inline-flex items-center">
                  Ler mais
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-16 my-12 bg-primary-600 text-white rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para transformar sua instituição?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Agende uma demonstração e descubra como a Edunéxia pode otimizar seus processos educacionais.
          </p>
          <Link 
            to="/contato" 
            className="inline-block px-8 py-4 bg-white text-primary-600 font-medium rounded-md hover:bg-gray-100 transition"
          >
            Fale com um especialista
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage; 