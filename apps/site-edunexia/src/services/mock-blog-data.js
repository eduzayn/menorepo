// Autores do blog
export const mockBlogAuthors = [
    {
        id: '1',
        name: 'Ana Oliveira',
        bio: 'Ana é especialista em tecnologia educacional e gerente de produto na Edunéxia. Com mais de 10 anos de experiência no setor de educação, ela lidera o desenvolvimento de soluções inovadoras para instituições de ensino.',
        avatar_url: 'https://via.placeholder.com/150?text=Ana+Oliveira',
        email: 'ana.oliveira@edunexia.com.br',
        social_links: {
            linkedin: 'https://linkedin.com/in/anaoliveira',
            twitter: 'https://twitter.com/anaoliveira'
        },
        created_at: '2023-01-10T08:30:00Z',
        updated_at: '2023-01-10T08:30:00Z'
    },
    {
        id: '2',
        name: 'Carlos Mendes',
        bio: 'Carlos é desenvolvedor sênior na Edunéxia e especialista em soluções para educação digital. Formado em Ciência da Computação, dedica-se a criar tecnologias que transformam a experiência de aprendizagem.',
        avatar_url: 'https://via.placeholder.com/150?text=Carlos+Mendes',
        email: 'carlos.mendes@edunexia.com.br',
        social_links: {
            linkedin: 'https://linkedin.com/in/carlosmendes',
            github: 'https://github.com/carlosmendes'
        },
        created_at: '2023-01-15T10:45:00Z',
        updated_at: '2023-01-15T10:45:00Z'
    },
    {
        id: '3',
        name: 'Juliana Santos',
        bio: 'Juliana é coordenadora educacional e consultora na Edunéxia. Com mestrado em Educação, auxilia instituições na implementação de metodologias ativas e tecnologias educacionais.',
        avatar_url: 'https://via.placeholder.com/150?text=Juliana+Santos',
        email: 'juliana.santos@edunexia.com.br',
        social_links: {
            linkedin: 'https://linkedin.com/in/julianasantos',
            instagram: 'https://instagram.com/julianasantos.edu'
        },
        created_at: '2023-02-05T14:20:00Z',
        updated_at: '2023-02-05T14:20:00Z'
    }
];
// Categorias do blog
export const mockBlogCategories = [
    {
        id: '1',
        name: 'Tecnologia Educacional',
        slug: 'tecnologia-educacional',
        description: 'Artigos sobre inovações e tendências em tecnologia aplicada à educação.',
        created_at: '2023-01-05T09:00:00Z',
        updated_at: '2023-01-05T09:00:00Z'
    },
    {
        id: '2',
        name: 'Gestão Escolar',
        slug: 'gestao-escolar',
        description: 'Dicas e estratégias para uma gestão eficiente de instituições de ensino.',
        created_at: '2023-01-05T09:15:00Z',
        updated_at: '2023-01-05T09:15:00Z'
    },
    {
        id: '3',
        name: 'Educação Híbrida',
        slug: 'educacao-hibrida',
        description: 'Conteúdos sobre a integração de modelos presenciais e digitais no ensino.',
        created_at: '2023-01-05T09:30:00Z',
        updated_at: '2023-01-05T09:30:00Z'
    },
    {
        id: '4',
        name: 'Cases de Sucesso',
        slug: 'cases-de-sucesso',
        description: 'Histórias reais de instituições que transformaram seus processos com tecnologia.',
        created_at: '2023-01-05T09:45:00Z',
        updated_at: '2023-01-05T09:45:00Z'
    }
];
// Posts do blog
export const mockBlogPosts = [
    {
        id: '1',
        title: 'Como a inteligência artificial está transformando a educação',
        slug: 'inteligencia-artificial-educacao',
        excerpt: 'Descubra as principais aplicações de IA que estão revolucionando o ensino e a aprendizagem nas instituições educacionais modernas.',
        content: {
            blocks: [
                {
                    type: 'paragraph',
                    content: 'A inteligência artificial (IA) está revolucionando diversos setores, e a educação não é exceção. Instituições de ensino em todo o Brasil estão começando a implementar ferramentas e soluções baseadas em IA para otimizar processos administrativos, personalizar a experiência de aprendizagem e melhorar os resultados educacionais.'
                },
                {
                    type: 'paragraph',
                    content: 'Neste artigo, vamos explorar como essa tecnologia está transformando o cenário educacional e quais são as principais tendências para os próximos anos.'
                },
                {
                    type: 'heading',
                    content: 'Personalização do aprendizado'
                },
                {
                    type: 'paragraph',
                    content: 'Uma das aplicações mais promissoras da IA na educação é a capacidade de personalizar a experiência de aprendizagem para cada aluno. Sistemas inteligentes conseguem analisar o desempenho, identificar lacunas de conhecimento e adaptar o conteúdo de acordo com as necessidades individuais.'
                },
                {
                    type: 'paragraph',
                    content: 'Por exemplo, se um aluno está com dificuldade em determinado tópico de matemática, a plataforma pode oferecer exercícios adicionais, explicações alternativas ou recursos complementares específicos para aquela dificuldade.'
                },
                {
                    type: 'image',
                    url: 'https://via.placeholder.com/800x400?text=IA+na+Educacao',
                    alt: 'Inteligência Artificial na Educação',
                    caption: 'Sistemas de IA analisando padrões de aprendizagem'
                },
                {
                    type: 'heading',
                    content: 'Automação de tarefas administrativas'
                },
                {
                    type: 'paragraph',
                    content: 'Na área administrativa, a IA tem permitido automatizar tarefas repetitivas que anteriormente consumiam grande parte do tempo de gestores e professores. Desde a correção automatizada de avaliações até sistemas de matrícula inteligentes, essas soluções permitem que educadores foquem mais no que realmente importa: o processo de ensino-aprendizagem.'
                },
                {
                    type: 'heading',
                    content: 'O futuro da IA na educação brasileira'
                },
                {
                    type: 'paragraph',
                    content: 'Embora ainda estejamos nos estágios iniciais dessa revolução tecnológica no Brasil, o potencial de crescimento é imenso. Instituições que adotarem essas tecnologias de forma estratégica terão vantagens competitivas significativas nos próximos anos.'
                },
                {
                    type: 'paragraph',
                    content: 'Na Edunéxia, estamos comprometidos em desenvolver soluções de IA que atendam às necessidades específicas das instituições educacionais brasileiras, considerando nosso contexto cultural, social e econômico.'
                }
            ]
        },
        featured_image_url: 'https://via.placeholder.com/1200x600?text=IA+na+Educacao',
        author_id: '1',
        category_ids: ['1', '3'],
        status: 'published',
        meta_description: 'Descubra como a inteligência artificial está transformando a educação no Brasil e quais são as principais tendências para os próximos anos.',
        meta_keywords: 'inteligência artificial, educação, tecnologia educacional, personalização do aprendizado',
        created_at: '2023-05-10T14:30:00Z',
        updated_at: '2023-05-12T09:15:00Z',
        published_at: '2023-05-12T10:00:00Z'
    },
    {
        id: '2',
        title: 'Gestão financeira eficiente: 5 estratégias para instituições de ensino',
        slug: 'gestao-financeira-instituicoes-ensino',
        excerpt: 'Aprenda estratégias práticas para otimizar a gestão financeira da sua instituição de ensino e reduzir a inadimplência.',
        content: {
            blocks: [
                {
                    type: 'paragraph',
                    content: 'Uma gestão financeira sólida é essencial para a sustentabilidade de qualquer instituição de ensino. Com os desafios econômicos atuais, escolas e faculdades precisam otimizar seus processos financeiros para garantir sua saúde financeira e continuar oferecendo educação de qualidade.'
                },
                {
                    type: 'paragraph',
                    content: 'Neste artigo, apresentamos cinco estratégias comprovadas para melhorar a gestão financeira e reduzir a inadimplência em instituições educacionais.'
                },
                {
                    type: 'heading',
                    content: '1. Automatize os processos de cobrança'
                },
                {
                    type: 'paragraph',
                    content: 'A automação de cobranças não apenas reduz o trabalho manual, mas também diminui erros e atrasos nos pagamentos. Sistemas automatizados podem enviar lembretes de vencimento, oferecer opções de pagamento flexíveis e registrar todas as transações com precisão.'
                },
                {
                    type: 'heading',
                    content: '2. Implemente políticas de crédito claras'
                },
                {
                    type: 'paragraph',
                    content: 'Políticas de crédito bem definidas e comunicadas com transparência desde o processo de matrícula ajudam a estabelecer expectativas claras sobre pagamentos e consequências da inadimplência.'
                },
                {
                    type: 'image',
                    url: 'https://via.placeholder.com/800x400?text=Gestao+Financeira',
                    alt: 'Gestão Financeira Escolar',
                    caption: 'Dashboard financeiro da solução Edunéxia'
                },
                {
                    type: 'heading',
                    content: '3. Ofereça opções de pagamento flexíveis'
                },
                {
                    type: 'paragraph',
                    content: 'Diversificar as formas de pagamento e oferecer planos personalizados pode aumentar significativamente as taxas de pagamento em dia. Considere opções como débito automático, pagamento via PIX, parcelamento em cartão de crédito e planos de pagamento adaptados a diferentes perfis de responsáveis financeiros.'
                },
                {
                    type: 'heading',
                    content: '4. Utilize análise de dados para prever tendências'
                },
                {
                    type: 'paragraph',
                    content: 'Ferramentas de análise de dados permitem identificar padrões de pagamento, prever períodos de maior inadimplência e tomar medidas preventivas. Esses insights são valiosos para o planejamento financeiro de curto e longo prazo.'
                },
                {
                    type: 'heading',
                    content: '5. Invista em relacionamento com os responsáveis financeiros'
                },
                {
                    type: 'paragraph',
                    content: 'Manter uma comunicação aberta e respeitosa com os responsáveis financeiros é fundamental. Programas de fidelidade, descontos para pagamento antecipado e atendimento personalizado para negociação de débitos são estratégias que fortalecem esse relacionamento.'
                },
                {
                    type: 'paragraph',
                    content: 'Implementar estas estratégias requer um sistema financeiro integrado e robusto. A Edunéxia oferece uma solução completa de gestão financeira especialmente desenvolvida para instituições de ensino, com todas as funcionalidades necessárias para uma administração eficiente.'
                }
            ]
        },
        featured_image_url: 'https://via.placeholder.com/1200x600?text=Gestao+Financeira+Educacao',
        author_id: '2',
        category_ids: ['2'],
        status: 'published',
        meta_description: 'Conheça 5 estratégias essenciais para otimizar a gestão financeira da sua instituição de ensino e reduzir a inadimplência.',
        meta_keywords: 'gestão financeira, instituição de ensino, inadimplência, educação, finanças escolares',
        created_at: '2023-06-15T11:45:00Z',
        updated_at: '2023-06-18T16:30:00Z',
        published_at: '2023-06-18T17:00:00Z'
    },
    {
        id: '3',
        title: 'Case de Sucesso: Como o Colégio Horizonte reduziu em 70% o tempo de matrícula',
        slug: 'case-colegio-horizonte-matricula',
        excerpt: 'Saiba como o Colégio Horizonte transformou seu processo de matrículas utilizando a plataforma Edunéxia, melhorando a experiência de pais e gestores.',
        content: {
            blocks: [
                {
                    type: 'paragraph',
                    content: 'O Colégio Horizonte, instituição com mais de 25 anos de história e 1.200 alunos em São Paulo, enfrentava um grande desafio: o processo de matrícula e rematrícula era predominantemente manual, gerando filas, erros de documentação e sobrecarga da equipe administrativa.'
                },
                {
                    type: 'paragraph',
                    content: 'Neste estudo de caso, compartilhamos como a implementação do Sistema de Matrículas da Edunéxia transformou essa realidade, reduzindo em 70% o tempo do processo e melhorando significativamente a satisfação de pais e colaboradores.'
                },
                {
                    type: 'heading',
                    content: 'O desafio'
                },
                {
                    type: 'paragraph',
                    content: 'Durante os períodos de matrícula, o Colégio Horizonte enfrentava diversos problemas: longas filas de atendimento, documentação incompleta, erros de digitação de dados e dificuldade em acompanhar o status de cada matrícula. Isso resultava em um processo que durava, em média, 40 minutos por aluno e gerava grande insatisfação tanto para os pais quanto para a equipe administrativa.'
                },
                {
                    type: 'heading',
                    content: 'A solução'
                },
                {
                    type: 'paragraph',
                    content: 'Após analisar várias alternativas no mercado, o colégio optou pelo Sistema de Matrículas da Edunéxia devido à sua interface intuitiva, fluxo personalizado conforme as necessidades da instituição e integração com o sistema financeiro existente.'
                },
                {
                    type: 'image',
                    url: 'https://via.placeholder.com/800x400?text=Case+Colegio+Horizonte',
                    alt: 'Sistema de Matrículas no Colégio Horizonte',
                    caption: 'Interface do Sistema de Matrículas implementado no Colégio Horizonte'
                },
                {
                    type: 'heading',
                    content: 'Implementação e resultados'
                },
                {
                    type: 'paragraph',
                    content: 'A implementação foi realizada em três meses, incluindo a configuração do sistema, migração de dados, treinamento da equipe e testes. Os resultados foram impressionantes:'
                },
                {
                    type: 'paragraph',
                    content: '• Redução de 70% no tempo médio de matrícula (de 40 para 12 minutos)\n• Eliminação de 95% dos documentos físicos\n• Diminuição de 85% nos erros de preenchimento\n• Aumento de 25% na taxa de conversão de novos alunos\n• Economia de 120 horas de trabalho administrativo por período de matrícula'
                },
                {
                    type: 'paragraph',
                    content: '"A transformação foi incrível. Passamos de um processo burocrático e cansativo para um fluxo digital, ágil e com menos erros. Os pais agora podem iniciar o processo em casa e comparecer à escola apenas para finalizar detalhes específicos, o que melhorou muito a experiência para todos", relata Maria Campos, Diretora Administrativa do Colégio Horizonte.'
                },
                {
                    type: 'heading',
                    content: 'Conclusão'
                },
                {
                    type: 'paragraph',
                    content: 'O caso do Colégio Horizonte demonstra como a digitalização de processos administrativos pode transformar a experiência educacional não apenas para alunos, mas também para pais e equipe interna, gerando economia de recursos e melhorando a satisfação geral com a instituição.'
                }
            ]
        },
        featured_image_url: 'https://via.placeholder.com/1200x600?text=Case+Colegio+Horizonte',
        author_id: '3',
        category_ids: ['4', '2'],
        status: 'published',
        meta_description: 'Descubra como o Colégio Horizonte transformou seu processo de matrículas utilizando tecnologia, reduzindo em 70% o tempo e melhorando a experiência de pais e gestores.',
        meta_keywords: 'case de sucesso, matrícula escolar, transformação digital, gestão escolar, Colégio Horizonte',
        created_at: '2023-07-20T09:30:00Z',
        updated_at: '2023-07-22T14:45:00Z',
        published_at: '2023-07-22T15:00:00Z'
    },
    {
        id: '4',
        title: 'Educação híbrida: preparando sua instituição para o futuro do ensino',
        slug: 'educacao-hibrida-futuro-ensino',
        excerpt: 'Entenda como implementar um modelo de educação híbrida eficiente na sua instituição de ensino, combinando o melhor dos ambientes presencial e digital.',
        content: {
            blocks: [
                {
                    type: 'paragraph',
                    content: 'A educação híbrida não é mais apenas uma tendência, mas uma realidade consolidada no cenário educacional brasileiro e mundial. Combinando elementos do ensino presencial e remoto, esse modelo oferece flexibilidade e personalização sem abrir mão da interação social tão importante para o desenvolvimento dos estudantes.'
                },
                {
                    type: 'paragraph',
                    content: 'Neste artigo, exploramos as melhores práticas para implementar a educação híbrida na sua instituição de ensino e preparar-se para o futuro da educação.'
                },
                {
                    type: 'heading',
                    content: 'O que é educação híbrida?'
                },
                {
                    type: 'paragraph',
                    content: 'A educação híbrida é um modelo que integra atividades presenciais e remotas de forma planejada e complementar. Não se trata apenas de alternar dias na escola e em casa, mas de criar uma experiência educacional coesa que aproveita as vantagens de cada ambiente.'
                },
                {
                    type: 'image',
                    url: 'https://via.placeholder.com/800x400?text=Educacao+Hibrida',
                    alt: 'Educação Híbrida',
                    caption: 'Alunos interagindo em ambientes presenciais e digitais'
                },
                {
                    type: 'heading',
                    content: 'Estrutura tecnológica necessária'
                },
                {
                    type: 'paragraph',
                    content: 'Para implementar a educação híbrida com sucesso, é necessário investir em uma infraestrutura tecnológica adequada, que inclui:'
                },
                {
                    type: 'paragraph',
                    content: '• Plataforma de gestão de aprendizagem (LMS) intuitiva e completa\n• Sistemas de videoconferência de qualidade\n• Ferramentas de criação de conteúdo digital interativo\n• Acesso à internet de alta velocidade nas instalações da instituição\n• Suporte técnico eficiente para professores e alunos'
                },
                {
                    type: 'heading',
                    content: 'Capacitação de professores'
                },
                {
                    type: 'paragraph',
                    content: 'O sucesso da educação híbrida depende fundamentalmente da preparação dos professores. É essencial oferecer formação contínua em metodologias ativas, uso de tecnologias educacionais e design de experiências de aprendizagem engajadoras que funcionem tanto no ambiente presencial quanto no digital.'
                },
                {
                    type: 'heading',
                    content: 'Redesenho de espaços físicos'
                },
                {
                    type: 'paragraph',
                    content: 'Os espaços físicos precisam ser repensados para facilitar a transição entre atividades presenciais e remotas. Salas de aula flexíveis, com mobiliário modular e infraestrutura tecnológica incorporada, permitem diferentes configurações de trabalho e colaboração.'
                },
                {
                    type: 'heading',
                    content: 'Avaliação e acompanhamento'
                },
                {
                    type: 'paragraph',
                    content: 'Em um modelo híbrido, o sistema de avaliação precisa ser diversificado e contínuo. Ferramentas de análise de dados educacionais podem ajudar a acompanhar o progresso dos alunos nos diferentes ambientes e personalizar intervenções quando necessário.'
                },
                {
                    type: 'paragraph',
                    content: 'A plataforma Edunéxia oferece um conjunto completo de soluções para instituições que desejam implementar ou aprimorar seu modelo de educação híbrida, incluindo portal do aluno, sistema de gestão de conteúdo e ferramentas de comunicação integradas.'
                }
            ]
        },
        featured_image_url: 'https://via.placeholder.com/1200x600?text=Educacao+Hibrida+Futuro',
        author_id: '3',
        category_ids: ['3', '1'],
        status: 'published',
        meta_description: 'Aprenda a implementar um modelo de educação híbrida eficiente na sua instituição, combinando o melhor dos ambientes presencial e online.',
        meta_keywords: 'educação híbrida, ensino híbrido, futuro da educação, tecnologia educacional, blended learning',
        created_at: '2023-08-05T13:20:00Z',
        updated_at: '2023-08-08T10:15:00Z',
        published_at: '2023-08-08T11:00:00Z'
    },
    {
        id: '5',
        title: 'Inovações em avaliação: além das provas tradicionais',
        slug: 'inovacoes-avaliacao-educacional',
        excerpt: 'Conheça métodos inovadores de avaliação que vão além das provas tradicionais e proporcionam uma visão mais completa do desenvolvimento dos alunos.',
        content: {
            blocks: [
                {
                    type: 'paragraph',
                    content: 'A avaliação é uma parte fundamental do processo educacional, mas os métodos tradicionais nem sempre conseguem capturar todas as dimensões do aprendizado. Novas abordagens de avaliação estão emergindo, possibilitando uma visão mais holística e autêntica do desenvolvimento dos estudantes.'
                },
                {
                    type: 'paragraph',
                    content: 'Neste artigo, exploramos métodos inovadores de avaliação que podem ser implementados com o apoio da tecnologia educacional.'
                },
                {
                    type: 'heading',
                    content: 'Limitações das avaliações tradicionais'
                },
                {
                    type: 'paragraph',
                    content: 'Provas e testes padronizados têm seu valor, mas apresentam limitações significativas: frequentemente medem apenas a memorização de conteúdo, podem gerar ansiedade excessiva, e nem sempre refletem competências essenciais como criatividade, pensamento crítico e colaboração.'
                },
                {
                    type: 'image',
                    url: 'https://via.placeholder.com/800x400?text=Avaliacao+Inovadora',
                    alt: 'Métodos Inovadores de Avaliação',
                    caption: 'Alunos participando de processo de avaliação por projetos'
                },
                {
                    type: 'heading',
                    content: 'Avaliação baseada em projetos'
                },
                {
                    type: 'paragraph',
                    content: 'Um dos métodos mais promissores é a avaliação baseada em projetos, onde os alunos desenvolvem soluções para problemas complexos e reais. Esse tipo de avaliação permite observar múltiplas competências simultaneamente, desde o domínio do conteúdo até habilidades de pesquisa, trabalho em equipe e comunicação.'
                },
                {
                    type: 'paragraph',
                    content: 'Plataformas digitais facilitam a gestão desses projetos, permitindo acompanhamento contínuo, feedback em tempo real e documentação do processo.'
                },
                {
                    type: 'heading',
                    content: 'Portfólios digitais'
                },
                {
                    type: 'paragraph',
                    content: 'Os portfólios digitais permitem que os alunos colecionem e reflitam sobre suas melhores produções ao longo do tempo. Essa abordagem valoriza o processo de aprendizagem e não apenas o resultado final, além de estimular a metacognição e autodirecionamento.'
                },
                {
                    type: 'heading',
                    content: 'Avaliação formativa contínua'
                },
                {
                    type: 'paragraph',
                    content: 'Ferramentas digitais possibilitam a implementação eficiente de avaliações formativas frequentes e de baixo impacto. Questionários rápidos, sondagens e atividades interativas fornecem dados constantes sobre o progresso dos alunos, permitindo intervenções imediatas e personalizadas.'
                },
                {
                    type: 'heading',
                    content: 'Rubricas transparentes'
                },
                {
                    type: 'paragraph',
                    content: 'Rubricas bem construídas e compartilhadas antecipadamente com os estudantes esclarecem expectativas e critérios de avaliação. Sistemas digitais podem facilitar a criação, aplicação e visualização dessas rubricas, tornando o processo avaliativo mais transparente e justo.'
                },
                {
                    type: 'paragraph',
                    content: 'A Edunéxia oferece um módulo completo de avaliação que integra métodos tradicionais e inovadores, permitindo que instituições de ensino implementem um sistema avaliativo diversificado e alinhado com as demandas educacionais contemporâneas.'
                }
            ]
        },
        featured_image_url: 'https://via.placeholder.com/1200x600?text=Inovacoes+Avaliacao',
        author_id: '1',
        category_ids: ['1', '3'],
        status: 'draft',
        meta_description: 'Descubra métodos inovadores de avaliação educacional que vão além das provas tradicionais e proporcionam uma visão mais completa do desenvolvimento dos alunos.',
        meta_keywords: 'avaliação educacional, métodos de avaliação, portfólio digital, avaliação por projetos, rubricas',
        created_at: '2023-09-10T15:40:00Z',
        updated_at: '2023-09-10T15:40:00Z',
        published_at: null
    }
];
