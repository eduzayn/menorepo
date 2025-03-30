import { useState, useEffect } from 'react';
import { ApiClient } from '@edunexia/api-client/src/client';

interface Testimonial {
  id: string;
  author_name: string;
  author_title?: string;
  author_avatar_url?: string;
  content: string;
  rating: number;
  company?: string;
  is_featured: boolean;
}

interface TestimonialSectionProps {
  limit?: number;
  featuredOnly?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function TestimonialSection({
  limit = 5,
  featuredOnly = true,
  className = '',
  title = 'O que nossos alunos dizem',
  subtitle = 'Veja os depoimentos de quem já transformou sua carreira com a Edunéxia'
}: TestimonialSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Usando mock data, não precisamos de um cliente real
  // No ambiente de produção, usaríamos configurações reais
  const apiClient = {
    from: (table: string) => ({
      select: () => ({
        order: () => ({
          eq: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          })
        })
      })
    }),
    handleError: (error: any, context: string) => {
      console.error(`API error in ${context}:`, error);
      return {
        message: 'Ocorreu um erro ao processar sua solicitação.',
        code: 'UNKNOWN_ERROR',
        details: error
      };
    }
  } as any;

  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Demo mode with mock data
        const useMockData = true;
        
        let data: Testimonial[];
        
        if (useMockData) {
          // Mock testimonials for development
          const mockTestimonials: Testimonial[] = [
            {
              id: '1',
              author_name: 'Maria Silva',
              author_title: 'Desenvolvedora Frontend',
              author_avatar_url: 'https://randomuser.me/api/portraits/women/32.jpg',
              content: 'Os cursos da Edunéxia transformaram minha carreira. A qualidade do material didático e o suporte dos professores foram fundamentais para meu desenvolvimento profissional.',
              rating: 5,
              company: 'TechSoft',
              is_featured: true
            },
            {
              id: '2',
              author_name: 'João Oliveira',
              author_title: 'Estudante de Engenharia',
              author_avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg',
              content: 'Estou impressionado com a metodologia prática dos cursos. Consegui aplicar o conhecimento imediatamente nos meus projetos da faculdade.',
              rating: 5,
              is_featured: true
            },
            {
              id: '3',
              author_name: 'Ana Souza',
              author_title: 'Gerente de Projetos',
              author_avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg',
              content: 'A flexibilidade de horários e a qualidade do material me permitiram conciliar os estudos com meu trabalho. Recomendo a todos os profissionais que buscam aprimoramento.',
              rating: 4,
              company: 'Inovare Tecnologia',
              is_featured: true
            },
            {
              id: '4',
              author_name: 'Carlos Mendes',
              author_title: 'Analista de Sistemas',
              author_avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg',
              content: 'Os certificados da Edunéxia são reconhecidos no mercado. Após a conclusão do curso, recebi três propostas de emprego!',
              rating: 5,
              company: 'DataTech',
              is_featured: false
            },
            {
              id: '5',
              author_name: 'Juliana Castro',
              author_title: 'Especialista em Marketing Digital',
              author_avatar_url: 'https://randomuser.me/api/portraits/women/90.jpg',
              content: 'O curso de Marketing Digital superou minhas expectativas. Conteúdo atualizado e professores com grande experiência de mercado.',
              rating: 5,
              company: 'Agência Impacto',
              is_featured: true
            }
          ];
          
          // Filter if needed
          data = featuredOnly 
            ? mockTestimonials.filter(t => t.is_featured) 
            : mockTestimonials;
            
          // Apply limit
          data = data.slice(0, limit);
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
        } else {
          // Real API call
          let query = apiClient.from('site_testimonials')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (featuredOnly) {
            query = query.eq('is_featured', true);
          }
          
          const { data: fetchedData, error } = await query.limit(limit);
          
          if (error) throw error;
          data = fetchedData as any[];
        }
        
        setTestimonials(data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Não foi possível carregar os depoimentos. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestimonials();
  }, [apiClient, featuredOnly, limit]);
  
  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // Render stars for rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg 
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };
  
  const handlePrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  // If error or no testimonials, show appropriate message
  if (error) {
    return (
      <div className={`bg-gray-50 py-12 ${className}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!isLoading && testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }
  
  return (
    <section className={`bg-indigo-50 py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            {subtitle}
          </p>
        </div>
        
        <div className="mt-12 relative">
          {isLoading ? (
            // Loading skeleton
            <div className="animate-pulse max-w-3xl mx-auto">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>
              <div className="flex justify-center space-x-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-5 w-5 bg-gray-200 rounded-full"></div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ) : (
            // Testimonial carousel
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="mx-auto max-w-3xl text-center">
                      <div className="flex justify-center mb-4">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="mt-3 text-xl leading-relaxed text-gray-700 italic">
                        "{testimonial.content}"
                      </p>
                      <div className="mt-8 flex items-center justify-center">
                        {testimonial.author_avatar_url && (
                          <div className="mr-4">
                            <img
                              className="h-12 w-12 rounded-full object-cover"
                              src={testimonial.author_avatar_url}
                              alt={testimonial.author_name}
                            />
                          </div>
                        )}
                        <div className="text-left">
                          <div className="text-base font-medium text-gray-900">
                            {testimonial.author_name}
                          </div>
                          {(testimonial.author_title || testimonial.company) && (
                            <div className="text-sm text-gray-500">
                              {testimonial.author_title}
                              {testimonial.author_title && testimonial.company && ' • '}
                              {testimonial.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {testimonials.length > 1 && (
                <>
                  <button 
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Depoimento anterior"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Próximo depoimento"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
          
          {!isLoading && testimonials.length > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 w-2 rounded-full ${
                    i === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Ir para depoimento ${i + 1}`}
                  aria-current={i === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 