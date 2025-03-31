import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const PlanosPage: React.FC = () => {
  const planos = [
    {
      id: 'starter',
      nome: 'Starter',
      preco: 'R$ 299',
      periodo: '/mês',
      descricao: 'Ideal para escolas pequenas',
      recursos: [
        'Até 200 alunos',
        'Sistema de matrículas',
        'Portal do aluno básico',
        'Gestão financeira básica',
        'Suporte por email'
      ]
    },
    {
      id: 'professional',
      nome: 'Professional',
      preco: 'R$ 599',
      periodo: '/mês',
      descricao: 'Para escolas em crescimento',
      destaque: true,
      recursos: [
        'Até 500 alunos',
        'Sistema de matrículas avançado',
        'Portal do aluno completo',
        'Gestão financeira completa',
        'Material didático digital',
        'Suporte prioritário',
        'Treinamento da equipe'
      ]
    },
    {
      id: 'enterprise',
      nome: 'Enterprise',
      preco: 'Personalizado',
      periodo: '',
      descricao: 'Para grandes instituições',
      recursos: [
        'Alunos ilimitados',
        'Recursos personalizados',
        'API e integrações',
        'Suporte 24/7',
        'Gestor de conta dedicado',
        'SLA garantido'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Planos e Preços - Edunéxia</title>
        <meta name="description" content="Conheça os planos da Edunéxia e escolha o que melhor se adapta às necessidades da sua instituição de ensino." />
      </Helmet>

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Planos para todas as necessidades
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Escolha o plano ideal para sua instituição e comece a transformar
              a gestão educacional hoje mesmo.
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {planos.map((plano) => (
                <div
                  key={plano.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                    plano.destaque ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-2">{plano.nome}</h3>
                    <p className="text-gray-600 mb-6">{plano.descricao}</p>
                    <div className="mb-8">
                      <span className="text-4xl font-bold">{plano.preco}</span>
                      <span className="text-gray-500">{plano.periodo}</span>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plano.recursos.map((recurso, index) => (
                        <li key={index} className="flex items-center">
                          <svg
                            className="h-5 w-5 text-primary-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {recurso}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={plano.id === 'enterprise' ? '/contato' : '/trial'}
                      className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
                        plano.destaque
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {plano.id === 'enterprise' ? 'Fale conosco' : 'Começar teste grátis'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>
            <div className="max-w-3xl mx-auto space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Quanto tempo dura o período de teste?
                </h3>
                <p className="text-gray-600">
                  Oferecemos um período de teste gratuito de 14 dias para você
                  explorar todas as funcionalidades da plataforma.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Preciso fornecer cartão de crédito para o teste?
                </h3>
                <p className="text-gray-600">
                  Não, você não precisa fornecer dados de pagamento durante o
                  período de teste.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Posso mudar de plano depois?
                </h3>
                <p className="text-gray-600">
                  Sim, você pode fazer upgrade ou downgrade do seu plano a
                  qualquer momento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ainda tem dúvidas?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Nossa equipe está pronta para ajudar você a escolher o melhor
              plano para sua instituição.
            </p>
            <Link
              to="/contato"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Fale com um consultor
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default PlanosPage; 