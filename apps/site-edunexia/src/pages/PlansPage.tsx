import React from 'react';
import { Link } from 'react-router-dom';

const PlansPage: React.FC = () => {
  const plans = [
    {
      id: 'basic',
      name: 'Plano Básico',
      price: 'R$ 1.499',
      period: '/mês',
      description: 'Ideal para pequenas instituições que estão começando a digitalizar seus processos.',
      features: [
        'Sistema de Matrículas',
        'Portal do Aluno',
        'Gestão Financeira Básica',
        'Suporte por email',
        'Atualizações de segurança',
      ],
      includes: [
        'apps/matriculas',
        'apps/portal-do-aluno',
        'apps/financeiro (básico)',
      ],
      cta: 'Começar agora',
      trialCta: 'Teste grátis por 14 dias',
      popular: false,
    },
    {
      id: 'standard',
      name: 'Plano Padrão',
      price: 'R$ 2.899',
      period: '/mês',
      description: 'Perfeito para instituições de médio porte que buscam mais recursos e integrações.',
      features: [
        'Todos os recursos do Plano Básico',
        'Comunicação Institucional',
        'Material Didático Digital',
        'Biblioteca Virtual',
        'Dashboard Analítico',
        'Suporte prioritário',
      ],
      includes: [
        'apps/matriculas',
        'apps/portal-do-aluno',
        'apps/financeiro-empresarial',
        'apps/comunicacao',
        'apps/material-didatico',
      ],
      cta: 'Assinar agora',
      trialCta: 'Teste grátis por 14 dias',
      popular: true,
    },
    {
      id: 'premium',
      name: 'Plano Premium',
      price: 'R$ 4.799',
      period: '/mês',
      description: 'Solução completa para grandes instituições com necessidades avançadas.',
      features: [
        'Todos os recursos do Plano Padrão',
        'Gestão de RH Educacional',
        'Portal do Parceiro',
        'Portal do Polo',
        'Contabilidade Integrada',
        'APIs personalizadas',
        'Suporte 24/7',
      ],
      includes: [
        'Todos os módulos da plataforma',
        'Integrações com sistemas externos',
        'Personalização de identidade visual',
      ],
      cta: 'Assinar agora',
      trialCta: 'Teste grátis por 14 dias',
      popular: false,
    },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Escolha o plano ideal para sua instituição
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça nossos pacotes de módulos e escolha a solução que melhor atende às necessidades da sua instituição de ensino.
          </p>
          <div className="mt-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg className="mr-2 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Todos os planos incluem 14 dias grátis, sem compromisso
            </span>
          </div>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative flex flex-col rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'border-2 border-indigo-500' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 pt-2 pr-4">
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                    Mais escolhido
                  </span>
                </div>
              )}

              <div className="bg-white px-6 pt-12 pb-10">
                <div>
                  <h3 className="text-2xl font-semibold text-center text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex justify-center">
                    <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-xl font-medium text-gray-500 align-self-end ml-1 mt-auto">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 text-center">{plan.description}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6">
                <div className="space-y-6">
                  <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">O que está incluído</h4>
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Módulos incluídos</h4>
                  <ul className="space-y-4">
                    {plan.includes.map((include, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">{include}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <Link
                    to={`/checkout/${plan.id}`}
                    className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md ${
                      plan.popular
                        ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                        : 'text-indigo-600 bg-white hover:bg-gray-50 border-indigo-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  <Link
                    to={`/trial/${plan.id}`}
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    {plan.trialCta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Precisa de um plano personalizado?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Entre em contato com nossa equipe para conhecer opções de personalização e módulos adicionais.
          </p>
          <div className="mt-6">
            <Link
              to="/contato"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Fale com um consultor
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-12 sm:p-12">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">Perguntas frequentes</h2>
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Como funciona o período de testes gratuitos?</h3>
                <p className="mt-2 text-base text-gray-600">
                  Todos os planos incluem 14 dias de teste grátis. Durante este período, você terá acesso completo a todos os recursos do plano escolhido, sem compromisso. Você pode cancelar a qualquer momento antes do término do período de testes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Posso mudar de plano a qualquer momento?</h3>
                <p className="mt-2 text-base text-gray-600">
                  Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Existe taxa de implementação?</h3>
                <p className="mt-2 text-base text-gray-600">
                  Não há taxa de implementação para assinaturas realizadas pelo site. Nossa plataforma é autoexplicativa e oferecemos documentação completa para facilitar a implementação.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Posso adicionar módulos específicos ao meu plano?</h3>
                <p className="mt-2 text-base text-gray-600">
                  Sim, oferecemos a opção de adicionar módulos específicos em qualquer plano, mediante pagamento adicional por módulo. Esta opção está disponível no painel administrativo após a assinatura.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Qual o prazo de contrato?</h3>
                <p className="mt-2 text-base text-gray-600">
                  As assinaturas são mensais, sem fidelidade. Para planos anuais, oferecemos 10% de desconto no valor total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage; 