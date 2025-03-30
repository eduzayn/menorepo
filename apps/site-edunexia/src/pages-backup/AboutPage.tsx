export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
            Sobre a Edunéxia
          </h1>
          <p className="text-lg text-gray-600">
            Trabalhamos para transformar a educação através da tecnologia, 
            fornecendo soluções integradas que otimizam processos e melhoram a experiência de aprendizado.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-primary-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">
              Nossa Missão
            </h2>
            <p className="text-gray-700">
              Transformar a gestão educacional através de tecnologia acessível e intuitiva, 
              permitindo que instituições de ensino foquem no que realmente importa: a educação de qualidade.
            </p>
          </div>
          <div className="bg-primary-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-primary-800 mb-4">
              Nossa Visão
            </h2>
            <p className="text-gray-700">
              Ser reconhecida como a plataforma de gestão educacional mais completa e inovadora, 
              presente em instituições de ensino de todos os portes em todo o Brasil.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-primary-800 mb-8 text-center">
          Nossos Valores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Confiança</h3>
            <p className="text-gray-600">
              Construímos relações baseadas na transparência e integridade, sendo um parceiro confiável para nossas instituições clientes.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Inovação</h3>
            <p className="text-gray-600">
              Buscamos constantemente novas soluções e tecnologias para melhorar nossos produtos e a experiência dos usuários.
            </p>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 flex items-center justify-center rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Colaboração</h3>
            <p className="text-gray-600">
              Acreditamos no poder do trabalho em equipe e na parceria com nossos clientes para criar soluções que realmente atendam às necessidades.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-primary-800 mb-8 text-center">
          Nossa Equipe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-40 h-40 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-primary-800">Ana Silva</h3>
            <p className="text-gray-600">CEO & Fundadora</p>
          </div>
          <div className="text-center">
            <div className="w-40 h-40 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-primary-800">Carlos Mendes</h3>
            <p className="text-gray-600">CTO</p>
          </div>
          <div className="text-center">
            <div className="w-40 h-40 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-primary-800">Mariana Costa</h3>
            <p className="text-gray-600">Diretora de Produto</p>
          </div>
          <div className="text-center">
            <div className="w-40 h-40 rounded-full bg-gray-300 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-primary-800">Paulo Oliveira</h3>
            <p className="text-gray-600">Diretor Comercial</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage; 