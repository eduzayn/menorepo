import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface TrialPageParams {
  planId: string;
}

const TrialPage: React.FC = () => {
  const { planId } = useParams<{ [key: string]: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [institution, setInstitution] = useState({
    name: '',
    type: 'faculdade',
    email: '',
    phone: '',
    website: '',
    studentsCount: '',
    responsibleName: '',
    responsiblePosition: '',
    responsibleEmail: '',
    responsiblePhone: '',
  });

  // Plan data based on planId
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    // In a real implementation, fetch plan details from an API
    const plans = {
      'basic': {
        id: 'basic',
        name: 'Plano Básico',
        price: 'R$ 1.499',
        features: [
          'Sistema de Matrículas',
          'Portal do Aluno',
          'Gestão Financeira Básica',
        ],
      },
      'standard': {
        id: 'standard',
        name: 'Plano Padrão',
        price: 'R$ 2.899',
        features: [
          'Sistema de Matrículas',
          'Portal do Aluno',
          'Gestão Financeira Empresarial',
          'Comunicação',
          'Material Didático',
        ],
      },
      'premium': {
        id: 'premium',
        name: 'Plano Premium',
        price: 'R$ 4.799',
        features: [
          'Todos os módulos da plataforma',
          'Integrações com sistemas externos',
          'Personalização de identidade visual',
        ],
      },
    };
    
    setPlan(plans[planId as keyof typeof plans] || plans.standard);
  }, [planId]);

  const handleInstitutionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInstitution(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulating API call to create trial account
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page
      navigate('/trial/success', { 
        state: { 
          planName: plan?.name,
          institutionName: institution.name,
          email: institution.email
        } 
      });
    } catch (error) {
      console.error('Error starting trial:', error);
      alert('Ocorreu um erro ao iniciar seu período de teste. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900">Iniciar período de avaliação gratuita</h1>
            <p className="mt-4 text-lg text-gray-600">
              Experimente o {plan.name} por 14 dias sem compromisso
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-10">
            <div className="px-6 py-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Detalhes do plano selecionado</h2>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">14 dias grátis, depois {plan.price}/mês</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  <svg className="mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Sem necessidade de cartão de crédito
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {plan.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados da Instituição</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Instituição</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={institution.name}
                        onChange={handleInstitutionChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Instituição</label>
                    <div className="mt-1">
                      <select
                        id="type"
                        name="type"
                        value={institution.type}
                        onChange={handleInstitutionChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="faculdade">Faculdade</option>
                        <option value="centro-universitario">Centro Universitário</option>
                        <option value="universidade">Universidade</option>
                        <option value="escola-tecnica">Escola Técnica</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="studentsCount" className="block text-sm font-medium text-gray-700">Quantidade de Alunos</label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="studentsCount"
                        id="studentsCount"
                        required
                        value={institution.studentsCount}
                        onChange={handleInstitutionChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 sm:col-span-2 mt-4">Dados de contato</h3>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Institucional</label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={institution.email}
                        onChange={handleInstitutionChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={institution.phone}
                        onChange={handleInstitutionChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 sm:col-span-2 mt-4">Responsável pela contratação</h3>

                  <div>
                    <label htmlFor="responsibleName" className="block text-sm font-medium text-gray-700">Nome completo</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="responsibleName"
                        id="responsibleName"
                        required
                        value={institution.responsibleName}
                        onChange={handleInstitutionChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="responsiblePosition" className="block text-sm font-medium text-gray-700">Cargo</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="responsiblePosition"
                        id="responsiblePosition"
                        required
                        value={institution.responsiblePosition}
                        onChange={handleInstitutionChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="responsibleEmail" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="responsibleEmail"
                        id="responsibleEmail"
                        required
                        value={institution.responsibleEmail}
                        onChange={handleInstitutionChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="responsiblePhone" className="block text-sm font-medium text-gray-700">Telefone</label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="responsiblePhone"
                        id="responsiblePhone"
                        required
                        value={institution.responsiblePhone}
                        onChange={handleInstitutionChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Informações importantes</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Ao iniciar o período de avaliação, você concorda com nossos <a href="/termos" className="font-medium underline">Termos de Serviço</a> e <a href="/privacidade" className="font-medium underline">Política de Privacidade</a>. 
                            Você terá acesso completo à plataforma por 14 dias, sem necessidade de cartão de crédito. Após o período de teste, você poderá escolher um plano para continuar utilizando.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </>
                    ) : 'Iniciar teste gratuito'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialPage; 