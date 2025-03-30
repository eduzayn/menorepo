export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
            Sobre a Edunéxia
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Transformando a educação através de tecnologia inovadora, com soluções modulares para 
            instituições de ensino de todos os portes.
          </p>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Missão */}
            <div className="bg-primary-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">Missão</h2>
              <p className="text-gray-700">
                Transformar a gestão educacional através de soluções tecnológicas inovadoras, 
                proporcionando eficiência operacional e excelência acadêmica para 
                instituições de ensino.
              </p>
            </div>

            {/* Visão */}
            <div className="bg-primary-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">Visão</h2>
              <p className="text-gray-700">
                Ser reconhecida como a plataforma de referência em gestão educacional 
                no Brasil, impactando positivamente milhões de alunos através de 
                nossas soluções tecnológicas.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-primary-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-primary-800 mb-4">Valores</h2>
              <ul className="text-gray-700 space-y-2">
                <li>• Inovação constante</li>
                <li>• Compromisso com a educação</li>
                <li>• Excelência em serviços</li>
                <li>• Integridade e transparência</li>
                <li>• Responsabilidade social</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-800 mb-8">
            Nossa História
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 mb-6">
              A Edunéxia nasceu da visão de transformar a maneira como as instituições de ensino
              gerenciam seus processos, unindo tecnologia de ponta e conhecimento profundo do setor educacional.
            </p>
            <p className="text-gray-700 mb-6">
              Fundada por especialistas em educação e tecnologia, nossa empresa rapidamente se destacou
              pela abordagem modular e flexível, permitindo que instituições de diferentes portes 
              pudessem acessar soluções adaptadas às suas necessidades específicas.
            </p>
            <p className="text-gray-700 mb-6">
              Hoje, seguimos comprometidos com nossa missão de simplificar a gestão educacional, permitindo
              que nossos clientes possam focar no que realmente importa: oferecer educação de qualidade.
            </p>
          </div>
        </div>
      </section>

      {/* Nosso Time */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-800 mb-8">
            Nosso Time
          </h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12">
            Contamos com uma equipe multidisciplinar de profissionais apaixonados por educação e tecnologia,
            comprometidos em oferecer as melhores soluções para nossos clientes.
          </p>
          
          {/* Aqui seriam exibidos os membros da equipe */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {/* Esta seção será implementada posteriormente com dados reais */}
          </div>
        </div>
      </section>
    </div>
  );
} 