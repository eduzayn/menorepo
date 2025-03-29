import { SitePage } from '@edunexia/database-schema/src/site-edunexia';

// Dados fictícios para testar páginas dinâmicas
export const mockPages: SitePage[] = [
  {
    id: '1',
    slug: 'sistema-matriculas',
    title: 'Sistema de Matrículas',
    content: {
      blocks: [
        {
          type: 'paragraph',
          content: 'O Sistema de Matrículas da Edunéxia é uma solução completa para gestão do processo de captação e matrícula de alunos.'
        },
        {
          type: 'paragraph',
          content: 'Com uma interface intuitiva e processos automatizados, nossa plataforma reduz significativamente o tempo gasto em tarefas administrativas, permitindo que sua equipe foque no que realmente importa: oferecer uma excelente experiência para novos alunos.'
        },
        {
          type: 'heading',
          content: 'Principais funcionalidades'
        },
        {
          type: 'paragraph',
          content: '• Gestão completa do funil de captação de leads\n• Automatização de comunicações por email e SMS\n• Formulários personalizáveis para inscrição online\n• Controle de documentação digital\n• Assinatura eletrônica de contratos\n• Integração com sistema financeiro para pagamentos\n• Relatórios e dashboards de acompanhamento'
        },
        {
          type: 'image',
          url: 'https://via.placeholder.com/800x400?text=Sistema+de+Matriculas',
          alt: 'Sistema de Matrículas da Edunéxia',
          caption: 'Interface principal do Sistema de Matrículas'
        },
        {
          type: 'heading',
          content: 'Benefícios'
        },
        {
          type: 'paragraph',
          content: '• Redução de até 70% no tempo de processamento de matrículas\n• Eliminação de papéis e documentos físicos\n• Melhoria na experiência do candidato/aluno\n• Diminuição de erros no processo\n• Possibilidade de matrículas 100% online\n• Aumento nas taxas de conversão de leads'
        },
        {
          type: 'paragraph',
          content: 'Entre em contato conosco para agendar uma demonstração personalizada e descobrir como podemos otimizar o processo de matrículas na sua instituição.'
        }
      ]
    },
    meta_description: 'Sistema completo para gestão de matrículas, desde a captação de leads até a efetivação e documentação. Conheça a solução da Edunéxia.',
    meta_keywords: 'sistema de matrículas, matrícula online, gestão de matrículas, automatização de matrículas',
    status: 'published',
    featured_image_url: 'https://via.placeholder.com/1200x600?text=Sistema+de+Matriculas',
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-03-10T14:45:00Z',
    published_at: '2023-03-10T15:00:00Z'
  },
  {
    id: '2',
    slug: 'portal-aluno',
    title: 'Portal do Aluno',
    content: {
      blocks: [
        {
          type: 'paragraph',
          content: 'O Portal do Aluno da Edunéxia proporciona uma experiência digital completa para estudantes acessarem todos os serviços acadêmicos em um único lugar.'
        },
        {
          type: 'paragraph',
          content: 'Com uma interface moderna e responsiva, o portal pode ser acessado de qualquer dispositivo, oferecendo autonomia e praticidade para os alunos consultarem informações acadêmicas, financeiras e de comunicação.'
        },
        {
          type: 'heading',
          content: 'Recursos disponíveis'
        },
        {
          type: 'paragraph',
          content: '• Visualização de notas e frequência\n• Acesso ao material didático\n• Consulta de grade horária\n• Solicitações de documentos\n• Visualização e pagamento de boletos\n• Comunicação direta com professores\n• Acompanhamento de atividades e avaliações\n• Calendário acadêmico\n• Notificações e avisos importantes'
        },
        {
          type: 'image',
          url: 'https://via.placeholder.com/800x400?text=Portal+do+Aluno',
          alt: 'Portal do Aluno Edunéxia',
          caption: 'Dashboard do Portal do Aluno'
        },
        {
          type: 'heading',
          content: 'Vantagens para a instituição'
        },
        {
          type: 'paragraph',
          content: '• Redução no volume de atendimento presencial\n• Diminuição de custos operacionais\n• Melhoria na comunicação com alunos\n• Aumento na satisfação dos estudantes\n• Digitalização de processos acadêmicos\n• Personalização da experiência do aluno'
        },
        {
          type: 'paragraph',
          content: 'Nossa equipe oferece treinamento completo para implementação e uso do Portal do Aluno, além de suporte contínuo para garantir o melhor aproveitamento da plataforma.'
        }
      ]
    },
    meta_description: 'Portal do Aluno completo com acesso a notas, frequência, material didático e financeiro. Solução digital para instituições de ensino.',
    meta_keywords: 'portal do aluno, área do aluno, sistema acadêmico, gestão educacional',
    status: 'published',
    featured_image_url: 'https://via.placeholder.com/1200x600?text=Portal+do+Aluno',
    created_at: '2023-02-05T09:15:00Z',
    updated_at: '2023-04-12T11:20:00Z',
    published_at: '2023-04-12T13:00:00Z'
  },
  {
    id: '3',
    slug: 'gestao-financeira',
    title: 'Gestão Financeira',
    content: {
      blocks: [
        {
          type: 'paragraph',
          content: 'O módulo de Gestão Financeira da Edunéxia oferece controle completo sobre todos os aspectos financeiros da sua instituição de ensino.'
        },
        {
          type: 'paragraph',
          content: 'Com recursos avançados de automação e integração, nossa solução simplifica a gestão de mensalidades, boletos, acordos financeiros e relatórios, proporcionando maior eficiência e redução de inadimplência.'
        },
        {
          type: 'heading',
          content: 'Funcionalidades principais'
        },
        {
          type: 'paragraph',
          content: '• Geração automática de mensalidades e boletos\n• Controle de inadimplência com ações automatizadas\n• Negociação e parcelamento de débitos\n• Dashboard financeiro com indicadores em tempo real\n• Conciliação bancária automatizada\n• Gestão de descontos e bolsas\n• Emissão de relatórios gerenciais\n• Integração com sistemas de cobrança e bancos'
        },
        {
          type: 'image',
          url: 'https://via.placeholder.com/800x400?text=Gestao+Financeira',
          alt: 'Sistema de Gestão Financeira Edunéxia',
          caption: 'Painel de controle financeiro'
        },
        {
          type: 'heading',
          content: 'Resultados comprovados'
        },
        {
          type: 'paragraph',
          content: '• Redução média de 35% na inadimplência\n• Aumento de 25% na eficiência operacional\n• Diminuição de 40% no tempo dedicado a processos financeiros\n• Melhoria significativa na precisão de relatórios\n• Maior transparência na gestão financeira'
        },
        {
          type: 'paragraph',
          content: 'Nosso módulo financeiro foi desenvolvido especificamente para o setor educacional, considerando as particularidades e desafios financeiros de instituições de ensino de todos os portes.'
        },
        {
          type: 'paragraph',
          content: 'Solicite uma demonstração para conhecer em detalhes como nossa solução pode otimizar a gestão financeira da sua instituição.'
        }
      ]
    },
    meta_description: 'Sistema de gestão financeira para instituições de ensino. Controle de mensalidades, inadimplência, boletos e relatórios financeiros completos.',
    meta_keywords: 'gestão financeira educacional, controle financeiro escolar, sistema financeiro educação, mensalidades',
    status: 'published',
    featured_image_url: 'https://via.placeholder.com/1200x600?text=Gestao+Financeira',
    created_at: '2023-03-18T14:20:00Z',
    updated_at: '2023-05-22T10:10:00Z',
    published_at: '2023-05-22T11:30:00Z'
  }
]; 