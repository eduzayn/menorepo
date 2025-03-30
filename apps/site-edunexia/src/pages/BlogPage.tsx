import { useState } from 'react';
import { Link } from 'react-router-dom';

// Tipos para os artigos do blog
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
}

// Dados simulados para demonstração
const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Como implementar ensino híbrido em sua instituição',
    slug: 'como-implementar-ensino-hibrido',
    excerpt: 'Descubra as melhores estratégias para implementar um modelo de ensino híbrido eficiente e que atenda às necessidades dos alunos.',
    cover_image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Ensino+Hibrido',
    published_at: '2023-11-15',
    category: 'Metodologias',
    author: {
      name: 'Ana Silva',
      avatar: 'https://placehold.co/150/4f46e5/ffffff?text=AS',
    },
  },
  {
    id: '2',
    title: 'Tendências tecnológicas na educação para 2023',
    slug: 'tendencias-tecnologicas-educacao-2023',
    excerpt: 'Conheça as principais tendências tecnológicas que estão transformando o cenário educacional e como aproveitá-las.',
    cover_image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Tendências+Tech',
    published_at: '2023-10-28',
    category: 'Tecnologia',
    author: {
      name: 'Pedro Costa',
      avatar: 'https://placehold.co/150/4f46e5/ffffff?text=PC',
    },
  },
  {
    id: '3',
    title: 'Gestão financeira eficiente para instituições de ensino',
    slug: 'gestao-financeira-instituicoes-ensino',
    excerpt: 'Aprenda estratégias para otimizar a gestão financeira da sua instituição de ensino e garantir a sustentabilidade a longo prazo.',
    cover_image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=Gestão+Financeira',
    published_at: '2023-10-15',
    category: 'Gestão',
    author: {
      name: 'Márcia Oliveira',
      avatar: 'https://placehold.co/150/4f46e5/ffffff?text=MO',
    },
  },
  {
    id: '4',
    title: 'Como melhorar a experiência do aluno com tecnologia',
    slug: 'melhorar-experiencia-aluno-tecnologia',
    excerpt: 'Descubra como utilizar a tecnologia para proporcionar uma experiência educacional mais engajadora e efetiva para os alunos.',
    cover_image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=UX+Educacional',
    published_at: '2023-09-30',
    category: 'Experiência do Aluno',
    author: {
      name: 'Rafael Mendes',
      avatar: 'https://placehold.co/150/4f46e5/ffffff?text=RM',
    },
  },
  {
    id: '5',
    title: 'Desafios da educação a distância e como superá-los',
    slug: 'desafios-educacao-distancia',
    excerpt: 'Analise os principais desafios enfrentados na educação a distância e conheça estratégias eficazes para superá-los.',
    cover_image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=EAD+Desafios',
    published_at: '2023-09-15',
    category: 'Educação a Distância',
    author: {
      name: 'Juliana Santos',
      avatar: 'https://placehold.co/150/4f46e5/ffffff?text=JS',
    },
  },
  {
    id: '6',
    title: 'Inteligência artificial na educação: possibilidades e limites',
    slug: 'inteligencia-artificial-educacao',
    excerpt: 'Explore as aplicações da inteligência artificial no contexto educacional, suas possibilidades e limites éticos.',
    cover_image: 'https://placehold.co/600x400/e2e8f0/1e40af?text=IA+Educação',
    published_at: '2023-09-05',
    category: 'Tecnologia',
    author: {
      name: 'Carlos Andrade',
      avatar: 'https://placehold.co/150/4f46e5/ffffff?text=CA',
    },
  },
];

// Categorias extraídas dos posts
const ALL_CATEGORIES = Array.from(new Set(MOCK_POSTS.map(post => post.category)));

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtragem de posts por categoria e termo de busca
  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    const matchesSearch = searchTerm
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
            Blog Edunéxia
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Conteúdos exclusivos sobre tecnologia educacional e gestão de instituições de ensino
          </p>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === null
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {ALL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Posts */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  <Link to={`/blog/${post.slug}`}>
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-xs font-medium bg-primary-100 text-primary-800 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm ml-3">
                        {new Date(post.published_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-700">{post.author.name}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhum artigo encontrado para os filtros selecionados.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 