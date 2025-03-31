import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

interface PageContent {
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  image: string;
  cta: {
    text: string;
    link: string;
  };
}

interface PageContentMap {
  [key: string]: PageContent;
}

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [moduleKey, setModuleKey] = useState<string>('');
  
  // Detecta o módulo pela rota ou pelo slug
  useEffect(() => {
    // Se temos um slug, usamos ele
    if (slug) {
      setModuleKey(slug);
      return;
    }
    
    // Caso contrário, extraímos da pathname (removendo a '/' inicial)
    const path = location.pathname.substring(1);
    setModuleKey(path);
  }, [slug, location.pathname]);
  
  const pageContents: PageContentMap = {
    'matriculas': {
      title: 'Sistema de Matrículas',
      description: 'Simplifique todo o processo de matrículas da sua instituição de ensino, desde a captação de leads até a efetivação e documentação, com nossa solução completa.',
      features: [
        'Processo de inscrição online simplificado',
        'Gestão de documentos digitais',
        'Automação de e-mails de confirmação',
        'Integração com sistema financeiro',
        'Dashboard de acompanhamento de matrículas',
        'Relatórios personalizados',
        'Gestão de vagas e turmas',
        'Suporte a múltiplas unidades'
      ],
      benefits: [
        'Redução de 70% no tempo de matrícula',
        'Eliminação de erros de preenchimento',
        'Melhor experiência para pais e alunos',
        'Aumento da taxa de conversão de leads',
        'Redução de custos operacionais'
      ],
      image: '/images/matriculas-preview.jpg',
      cta: {
        text: 'Agende uma demonstração',
        link: '/contato'
      }
    },
    'portal-do-aluno': {
      title: 'Portal do Aluno',
      description: 'Ofereça uma experiência digital completa para alunos acessarem notas, frequência, material didático e informações financeiras em uma interface intuitiva e moderna.',
      features: [
        'Acesso a notas e boletins',
        'Controle de frequência',
        'Conteúdo didático online',
        'Calendário acadêmico',
        'Comunicação direta com professores',
        'Visualização de mensalidades',
        'Emissão de boletos',
        'Aplicativo mobile disponível'
      ],
      benefits: [
        'Autonomia para o aluno gerenciar sua vida acadêmica',
        'Comunicação mais eficiente entre alunos e instituição',
        'Redução de atendimentos presenciais',
        'Maior engajamento dos alunos',
        'Modernização da imagem institucional'
      ],
      image: '/images/portal-aluno-preview.jpg',
      cta: {
        text: 'Conheça nossos planos',
        link: '/planos'
      }
    },
    'financeiro': {
      title: 'Gestão Financeira',
      description: 'Controle completo sobre mensalidades, boletos, acordos, inadimplência e relatórios financeiros para otimizar a saúde financeira da sua instituição.',
      features: [
        'Gestão de mensalidades e boletos',
        'Controle de inadimplência',
        'Acordos e negociações',
        'Integração com sistemas bancários',
        'Gestão de bolsas e descontos',
        'Relatórios financeiros detalhados',
        'Previsão de fluxo de caixa',
        'Dashboard financeiro em tempo real'
      ],
      benefits: [
        'Redução de até 40% na inadimplência',
        'Automatização de cobranças',
        'Visão consolidada da saúde financeira',
        'Tomada de decisões estratégicas baseadas em dados',
        'Redução de erros em processos financeiros'
      ],
      image: '/images/gestao-financeira-preview.jpg',
      cta: {
        text: 'Fale com um consultor',
        link: '/contato'
      }
    },
    'material-didatico': {
      title: 'Material Didático',
      description: 'Plataforma completa para criação, distribuição e gestão de conteúdo didático digital, proporcionando uma experiência de aprendizagem moderna e engajadora para seus alunos.',
      features: [
        'Biblioteca digital de conteúdos',
        'Criação de conteúdo interativo',
        'Vídeo-aulas integradas',
        'Atividades e exercícios online',
        'Avaliações automatizadas',
        'Estatísticas de uso e engajamento',
        'Conteúdo adaptativo',
        'Acesso offline via aplicativo'
      ],
      benefits: [
        'Redução de custos com materiais físicos',
        'Conteúdo sempre atualizado',
        'Aumento do engajamento dos alunos',
        'Análise de desempenho em tempo real',
        'Sustentabilidade ambiental'
      ],
      image: '/images/material-didatico-preview.jpg',
      cta: {
        text: 'Solicite uma demonstração',
        link: '/contato'
      }
    },
    'comunicacao': {
      title: 'Comunicação',
      description: 'Sistema integrado de comunicação para manter todos os envolvidos no processo educacional conectados, desde comunicados institucionais até mensagens individuais para pais e alunos.',
      features: [
        'Comunicados institucionais',
        'Mensagens direcionadas por turma',
        'Chat individual com pais e alunos',
        'Agendamento de mensagens',
        'Confirmação de leitura',
        'Envio de documentos e arquivos',
        'Notificações por e-mail e SMS',
        'Aplicativo mobile para comunicação imediata'
      ],
      benefits: [
        'Redução de ruídos na comunicação',
        'Aumento da participação dos pais',
        'Registro centralizado de todas as interações',
        'Diminuição de reclamações por falta de informação',
        'Fortalecimento da relação instituição-família'
      ],
      image: '/images/comunicacao-preview.jpg',
      cta: {
        text: 'Conheça esta solução',
        link: '/planos'
      }
    }
  };

  // Conteúdo padrão caso o slug não exista
  const defaultContent: PageContent = {
    title: 'Página não encontrada',
    description: 'O conteúdo que você está procurando não está disponível.',
    features: [],
    benefits: [],
    image: '/images/default-preview.jpg',
    cta: {
      text: 'Voltar para a página inicial',
      link: '/'
    }
  };

  // Obter o conteúdo com base no moduleKey ou usar o padrão
  const content = pageContents[moduleKey] || defaultContent;

  console.log('DynamicPage - ModuleKey:', moduleKey, 'Content:', content.title !== 'Página não encontrada' ? 'Found' : 'Not Found');

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl">
              {content.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Recursos principais
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-500">
              Nosso módulo de {content.title} oferece todas as ferramentas necessárias para otimizar este processo em sua instituição.
            </p>
            <div className="mt-8 space-y-4">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="aspect-w-5 aspect-h-3 rounded-lg overflow-hidden shadow-lg">
              <img 
                className="object-cover" 
                src={content.image}
                alt={content.title} 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/800x500?text=Edunexia";
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Benefícios
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="text-indigo-600 mb-2">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-base text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Pronto para transformar sua instituição?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Implemente o {content.title} e otimize sua operação educacional.
          </p>
          <div className="mt-8">
            <Link
              to={content.cta.link}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {content.cta.text}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPage; 