import { Link } from 'react-router-dom';

export default function PlanosPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
            Planos e Preços
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Soluções sob medida para cada fase e necessidade da sua instituição de ensino.
            Escolha o plano que se adapta ao seu contexto educacional.
          </p>
        </div>
      </section>

      {/* Planos Section */}
      <section className="py-12">
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* Plano Essencial */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col w-full lg:w-1/3 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-8 bg-primary-50">
              <h3 className="text-2xl font-bold text-primary-800 mb-2">Essencial</h3>
              <p className="text-gray-600">Ideal para pequenas instituições</p>
              <div className="mt-6 mb-2">
                <span className="text-4xl font-bold text-primary-800">R$ 599</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <p className="text-sm text-gray-500">Até 300 alunos</p>
            </div>
            <div className="p-8 flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Sistema de Matrículas Básico</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Portal do Aluno</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Financeiro Básico</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Suporte por e-mail</span>
                </li>
              </ul>
            </div>
            <div className="p-8 border-t border-gray-100">
              <Link 
                to="/contato?plano=essencial"
                className="block w-full py-3 px-6 text-center bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition"
              >
                Solicitar demonstração
              </Link>
            </div>
          </div>

          {/* Plano Profissional */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col w-full lg:w-1/3 border-2 border-primary-500 relative">
            <div className="absolute top-0 right-0 bg-primary-600 text-white px-4 py-1 rounded-bl-lg font-medium text-sm">
              Mais popular
            </div>
            <div className="p-8 bg-primary-100">
              <h3 className="text-2xl font-bold text-primary-800 mb-2">Profissional</h3>
              <p className="text-gray-600">Para instituições em crescimento</p>
              <div className="mt-6 mb-2">
                <span className="text-4xl font-bold text-primary-800">R$ 1.299</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <p className="text-sm text-gray-500">Até 800 alunos</p>
            </div>
            <div className="p-8 flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Sistema de Matrículas Completo</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Portal do Aluno com App Mobile</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Gestão Financeira Completa</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Material Didático Digital</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Comunicação Institucional</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Suporte prioritário 8x5</span>
                </li>
              </ul>
            </div>
            <div className="p-8 border-t border-gray-100">
              <Link 
                to="/contato?plano=profissional"
                className="block w-full py-3 px-6 text-center bg-primary-700 text-white font-medium rounded-md hover:bg-primary-800 transition"
              >
                Solicitar demonstração
              </Link>
            </div>
          </div>

          {/* Plano Enterprise */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col w-full lg:w-1/3 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="p-8 bg-gradient-to-r from-primary-50 to-blue-50">
              <h3 className="text-2xl font-bold text-primary-800 mb-2">Enterprise</h3>
              <p className="text-gray-600">Para grandes instituições</p>
              <div className="mt-6 mb-2">
                <span className="text-gray-500">Preço personalizado</span>
              </div>
              <p className="text-sm text-gray-500">Número ilimitado de alunos</p>
            </div>
            <div className="p-8 flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Todos os recursos do Profissional</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Múltiplas unidades/filiais</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>BI e Inteligência de Negócios</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Integrações personalizadas</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Suporte prioritário 24/7</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Gerente de conta dedicado</span>
                </li>
              </ul>
            </div>
            <div className="p-8 border-t border-gray-100">
              <Link 
                to="/contato?plano=enterprise"
                className="block w-full py-3 px-6 text-center bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition"
              >
                Consultar preços
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 my-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">Perguntas Frequentes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossos planos e serviços
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Os preços incluem implantação?</h3>
            <p className="text-gray-600">
              Os valores apresentados são mensalidades. A implantação é cobrada separadamente e varia de acordo com o porte da instituição e os módulos contratados.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Posso contratar apenas um módulo específico?</h3>
            <p className="text-gray-600">
              Sim, é possível contratar módulos individuais. Entre em contato conosco para discutir suas necessidades específicas e obter um orçamento personalizado.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Qual é o prazo de implantação?</h3>
            <p className="text-gray-600">
              O prazo médio de implantação varia de 30 a 90 dias, dependendo do tamanho da instituição e da complexidade da solução contratada.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-primary-800 mb-2">Como funciona o suporte técnico?</h3>
            <p className="text-gray-600">
              Oferecemos diferentes níveis de suporte conforme o plano contratado, desde suporte por e-mail até atendimento 24/7 com gerente de conta dedicado para o plano Enterprise.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 my-8 bg-primary-600 text-white rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ainda tem dúvidas?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar a encontrar a solução ideal para sua instituição.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contato" 
              className="inline-block px-8 py-4 bg-white text-primary-600 font-medium rounded-md hover:bg-gray-100 transition"
            >
              Fale com um especialista
            </Link>
            <a 
              href="tel:+551199999999" 
              className="inline-block px-8 py-4 border border-white text-white font-medium rounded-md hover:bg-primary-500 transition"
            >
              (11) 9999-9999
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 