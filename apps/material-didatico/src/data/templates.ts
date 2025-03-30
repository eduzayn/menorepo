import { Content, Block, BlockType } from '@/types/editor';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: 'aula' | 'disciplina' | 'avaliação' | 'projeto';
  structure: Omit<Content, 'metadata'> & { metadataTemplate?: Partial<Content['metadata']> };
  tags: string[];
}

function createUniqueId(): string {
  return `template-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function createBlock(type: BlockType, title: string, content: string = '', order: number): Block {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 5)}-${order}`,
    type,
    title,
    content,
    order,
    metadata: {}
  };
}

/**
 * Templates de aulas prontas para uso.
 */
export const AULA_TEMPLATES: Template[] = [
  {
    id: createUniqueId(),
    title: 'Aula Expositiva Padrão',
    description: 'Template básico para uma aula expositiva com introdução, desenvolvimento e conclusão.',
    category: 'aula',
    tags: ['expositiva', 'básico', 'geral'],
    structure: {
      blocks: [
        createBlock('text', 'Introdução', 'Apresente o tema da aula e os objetivos de aprendizagem.', 0),
        createBlock('text', 'Desenvolvimento', 'Explique os conceitos principais do tema.', 1),
        createBlock('text', 'Exemplos', 'Forneça exemplos práticos para ilustrar os conceitos.', 2),
        createBlock('activity', 'Atividade de Fixação', 'Crie exercícios para verificar a compreensão dos alunos.', 3),
        createBlock('text', 'Conclusão', 'Resuma os pontos principais e faça conexões com outros temas.', 4),
      ],
      metadataTemplate: {
        title: 'Nova Aula - [Insira o tema]',
        description: 'Aula para [objetivo principal]',
        education_level: 'superior',
        topic: '',
      }
    }
  },
  {
    id: createUniqueId(),
    title: 'Aula com Vídeo e Discussão',
    description: 'Template para aula que usa vídeo como recurso principal e promove discussão.',
    category: 'aula',
    tags: ['vídeo', 'discussão', 'participativo'],
    structure: {
      blocks: [
        createBlock('text', 'Introdução ao Tema', 'Breve contextualização do tema que será abordado no vídeo.', 0),
        createBlock('video', 'Vídeo Principal', 'Insira o URL do vídeo aqui.', 1),
        createBlock('text', 'Pontos para Reflexão', 'Liste os principais pontos que os alunos devem observar no vídeo.', 2),
        createBlock('activity', 'Perguntas para Discussão', 'Elabore perguntas que estimulem o debate sobre o conteúdo do vídeo.', 3),
        createBlock('text', 'Síntese', 'Sistematize as principais conclusões da discussão.', 4),
      ],
      metadataTemplate: {
        title: 'Aula com Vídeo - [Tema]',
        description: 'Análise e discussão sobre [tema] a partir de recursos audiovisuais',
        education_level: 'superior',
        topic: '',
      }
    }
  },
  {
    id: createUniqueId(),
    title: 'Estudo de Caso',
    description: 'Template para aulas baseadas em estudos de caso com análise e resolução de problemas.',
    category: 'aula',
    tags: ['estudo de caso', 'problema', 'análise'],
    structure: {
      blocks: [
        createBlock('text', 'Contextualização', 'Introduza o contexto geral do caso a ser estudado.', 0),
        createBlock('text', 'Apresentação do Caso', 'Descreva detalhadamente o caso ou problema a ser analisado.', 1),
        createBlock('text', 'Questões para Análise', 'Liste perguntas que orientam a análise do caso.', 2),
        createBlock('activity', 'Trabalho em Grupo', 'Instrução para trabalho em grupos para analisar o caso.', 3),
        createBlock('text', 'Teoria Aplicada', 'Apresente conceitos teóricos que ajudam a compreender o caso.', 4),
        createBlock('text', 'Resolução e Discussão', 'Espaço para compartilhamento de soluções e discussão.', 5),
        createBlock('activity', 'Avaliação da Aprendizagem', 'Como os alunos serão avaliados nesta atividade.', 6),
      ],
      metadataTemplate: {
        title: 'Estudo de Caso - [Nome do Caso]',
        description: 'Análise e resolução do caso [nome] aplicando [conceitos/teorias]',
        education_level: 'superior',
        topic: '',
      }
    }
  }
];

/**
 * Templates para avaliações e atividades.
 */
export const AVALIACAO_TEMPLATES: Template[] = [
  {
    id: createUniqueId(),
    title: 'Quiz de Verificação de Aprendizagem',
    description: 'Modelo para criação de quiz com diferentes tipos de questões.',
    category: 'avaliação',
    tags: ['quiz', 'avaliação', 'verificação'],
    structure: {
      blocks: [
        createBlock('text', 'Instruções', 'Explique como o quiz deve ser respondido e os critérios de avaliação.', 0),
        createBlock('quiz', 'Questões de Múltipla Escolha', '', 1),
        createBlock('quiz', 'Questões Verdadeiro ou Falso', '', 2),
        createBlock('quiz', 'Questões Dissertativas', '', 3),
        createBlock('text', 'Feedback', 'Orientações para interpretação dos resultados.', 4),
      ],
      metadataTemplate: {
        title: 'Quiz - [Tema]',
        description: 'Avaliação de conhecimentos sobre [tema]',
        education_level: 'superior',
        topic: '',
      }
    }
  },
  {
    id: createUniqueId(),
    title: 'Projeto Prático',
    description: 'Estrutura para proposta de projeto prático com todas as etapas necessárias.',
    category: 'projeto',
    tags: ['projeto', 'prática', 'entrega'],
    structure: {
      blocks: [
        createBlock('text', 'Contextualização', 'Explique o contexto e a relevância do projeto.', 0),
        createBlock('text', 'Objetivos', 'Liste os objetivos de aprendizagem do projeto.', 1),
        createBlock('text', 'Descrição do Projeto', 'Detalhe o que deve ser desenvolvido pelos alunos.', 2),
        createBlock('text', 'Requisitos', 'Liste os requisitos técnicos e acadêmicos para o projeto.', 3),
        createBlock('text', 'Etapas e Cronograma', 'Defina as etapas de desenvolvimento e prazos.', 4),
        createBlock('text', 'Recursos Necessários', 'Indique os recursos que os alunos precisarão para o projeto.', 5),
        createBlock('text', 'Critérios de Avaliação', 'Explique como o projeto será avaliado.', 6),
        createBlock('text', 'Entrega', 'Instruções detalhadas sobre como e onde entregar o projeto.', 7),
      ],
      metadataTemplate: {
        title: 'Projeto - [Nome do Projeto]',
        description: 'Projeto prático para desenvolvimento de [habilidades/competências]',
        education_level: 'superior',
        topic: '',
      }
    }
  }
];

/**
 * Templates para estruturas de disciplinas completas.
 */
export const DISCIPLINA_TEMPLATES: Template[] = [
  {
    id: createUniqueId(),
    title: 'Disciplina Padrão (15 semanas)',
    description: 'Estrutura completa para disciplina semestral com 15 semanas de duração.',
    category: 'disciplina',
    tags: ['semestral', 'completo', 'estrutura'],
    structure: {
      blocks: [
        createBlock('text', 'Ementa', 'Descreva os principais tópicos abordados na disciplina.', 0),
        createBlock('text', 'Objetivos', 'Liste os objetivos de aprendizagem da disciplina.', 1),
        createBlock('text', 'Bibliografia Básica', 'Liste as referências fundamentais para a disciplina.', 2),
        createBlock('text', 'Bibliografia Complementar', 'Indique leituras complementares para aprofundamento.', 3),
        createBlock('text', 'Metodologia', 'Explique a metodologia de ensino que será utilizada.', 4),
        createBlock('text', 'Sistema de Avaliação', 'Detalhe como os alunos serão avaliados.', 5),
        createBlock('text', 'Semana 1: Introdução', 'Planejamento da primeira semana de aula.', 6),
        // Semanas adicionais seriam adicionadas aqui
        createBlock('text', 'Semana 15: Encerramento', 'Planejamento da última semana de aula.', 20),
      ],
      metadataTemplate: {
        title: 'Disciplina - [Nome da Disciplina]',
        description: 'Plano de ensino para a disciplina de [nome]',
        education_level: 'superior',
        topic: '',
      }
    }
  }
];

/**
 * Todos os templates disponíveis combinados.
 */
export const ALL_TEMPLATES: Template[] = [
  ...AULA_TEMPLATES,
  ...AVALIACAO_TEMPLATES,
  ...DISCIPLINA_TEMPLATES
];

/**
 * Busca um template por ID.
 */
export function getTemplateById(id: string): Template | undefined {
  return ALL_TEMPLATES.find(template => template.id === id);
}

/**
 * Busca templates por categoria.
 */
export function getTemplatesByCategory(category: Template['category']): Template[] {
  return ALL_TEMPLATES.filter(template => template.category === category);
}

/**
 * Busca templates por tag.
 */
export function getTemplatesByTag(tag: string): Template[] {
  return ALL_TEMPLATES.filter(template => template.tags.includes(tag.toLowerCase()));
}

/**
 * Converte um template em um conteúdo utilizável.
 */
export function templateToContent(template: Template, customMetadata: Partial<Content['metadata']> = {}): Content {
  // Gera novos IDs para cada bloco para evitar conflitos
  const blocksWithNewIds = template.structure.blocks.map(block => ({
    ...block,
    id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }));

  return {
    metadata: {
      title: template.metadataTemplate?.title || '',
      description: template.metadataTemplate?.description || '',
      education_level: template.metadataTemplate?.education_level || 'superior',
      topic: template.metadataTemplate?.topic || '',
      ...customMetadata
    },
    blocks: blocksWithNewIds
  };
} 