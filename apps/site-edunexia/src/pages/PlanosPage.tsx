import React from 'react';

interface Plano {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
  recursos: string[];
}

const PlanosPage: React.FC = () => {
  const planos: Plano[] = [
    {
      id: 'basico',
      nome: 'Básico',
      preco: 49.90,
      descricao: 'Ideal para escolas pequenas',
      recursos: [
        'Até 100 alunos',
        'Acesso básico às funcionalidades',
        'Suporte por email',
        'Atualizações de segurança'
      ]
    },
    {
      id: 'pro',
      nome: 'Pro',
      preco: 99.90,
      descricao: 'Perfeito para escolas médias',
      recursos: [
        'Até 500 alunos',
        'Acesso completo às funcionalidades',
        'Suporte prioritário',
        'Atualizações regulares',
        'Backup diário'
      ]
    },
    {
      id: 'enterprise',
      nome: 'Enterprise',
      preco: 199.90,
      descricao: 'Para grandes instituições',
      recursos: [
        'Alunos ilimitados',
        'Acesso premium às funcionalidades',
        'Suporte 24/7',
        'Atualizações imediatas',
        'Backup em tempo real',
        'API dedicada'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Planos e Preços
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-4">{plano.nome}</h2>
              <p className="text-gray-600 mb-6">{plano.descricao}</p>
              <div className="text-3xl font-bold mb-6">
                R$ {plano.preco.toFixed(2)}
                <span className="text-sm text-gray-500">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plano.recursos.map((recurso, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
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
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Começar Agora
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanosPage; 