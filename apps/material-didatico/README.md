# Módulo de Material Didático - Edunéxia

Este módulo é responsável pela criação, edição, visualização e exportação de materiais didáticos na plataforma Edunéxia.

## Funcionalidades Implementadas

### 1. Editor de Conteúdo
- Editor flexível para diversos tipos de conteúdo (texto, vídeo, quiz, atividades, simulações)
- Criação e edição de materiais didáticos de forma estruturada
- Suporte a metadados (objetivos de aprendizagem, nível educacional, tags)
- Gerenciamento de disciplinas e tópicos

### 2. Exportação SCORM Completa
- Exportação de materiais para o formato SCORM 1.2 compatível com LMS
- Inclusão de manifesto SCORM com metadados completos
- Empacotamento de recursos em formato ZIP
- API SCORM para comunicação com LMS e rastreamento de progresso
- Preservação de estilos e recursos visuais no pacote exportado

### 3. Sugestões de IA
- Motor de sugestões de IA para geração de conteúdo
- Painel interativo de sugestões durante o processo de edição
- Modelo de sugestão personalizável para diferentes tipos de blocos
- Sistema de feedback para melhorar as sugestões ao longo do tempo
- Mecanismo de extração de tópicos para contextualização

### 4. Geração de PDFs
- Exportação de materiais para PDF utilizando jsPDF
- Formatação responsiva e preservação de estilos
- Inclusão de cabeçalhos, rodapés e numeração de páginas
- Suporte a imagens e tabelas no PDF gerado

## Arquitetura do Módulo

```
apps/material-didatico/
├── src/
│   ├── ai/                       # Serviços de IA para sugestões
│   │   ├── models/               # Modelos de IA para geração
│   │   └── suggestion-engine.ts  # Motor de sugestões
│   ├── components/               # Componentes React
│   │   ├── ai/                   # Componentes de IA
│   │   ├── disciplinas/          # Componentes de disciplinas
│   │   └── editor/               # Componentes do editor
│   ├── contexts/                 # Contextos React
│   │   └── index.ts              # Exportação dos contextos
│   ├── hooks/                    # Hooks personalizados
│   │   └── index.ts              # Exportação dos hooks
│   ├── pages/                    # Páginas do módulo
│   │   └── index.ts              # Exportação das páginas
│   ├── services/                 # Serviços e APIs
│   │   ├── export.ts             # Serviço de exportação (SCORM, PDF)
│   │   └── discipline.ts         # Serviço de gerenciamento de disciplinas
│   ├── types/                    # Definições de tipos
│   │   └── editor.ts             # Tipos para o editor
│   └── utils/                    # Utilitários
│       └── index.ts              # Exportação dos utilitários
├── package.json                  # Dependências do módulo
└── README.md                     # Documentação
```

## Como Utilizar

### Criação de Material Didático

```jsx
import { EditorWithSuggestions } from '@/components/editor/EditorWithSuggestions';
import { saveMaterial } from '@/services/discipline';

// Componente de exemplo
function CreateMaterial() {
  const initialContent = {
    metadata: {
      title: 'Novo Material',
      description: 'Descreva o material',
      // outros metadados...
    },
    blocks: []
  };

  const handleSave = async (content) => {
    await saveMaterial(content);
  };

  return (
    <EditorWithSuggestions 
      initialContent={initialContent}
      onSave={handleSave}
    />
  );
}
```

### Exportação SCORM

```javascript
import { exportToSCORM } from '@/services/export';

// Exemplo de uso
async function handleExportSCORM(content) {
  try {
    const scormUrl = await exportToSCORM(content);
    // Download ou exibição do link
  } catch (error) {
    console.error('Erro ao exportar SCORM:', error);
  }
}
```

### Utilização do Motor de Sugestões

```javascript
import { SuggestionEngine } from '@/ai/suggestion-engine';

// Obter instância do motor de sugestões
const suggestionEngine = SuggestionEngine.getInstance();

// Gerar sugestões
const suggestions = await suggestionEngine.generateSuggestions({
  contentTitle: 'Título do Material',
  currentBlocks: existingBlocks,
  topic: 'Matemática',
  educationLevel: 'Ensino Médio'
});
```

## Dependências

Este módulo utiliza as seguintes bibliotecas:
- jsPDF (^2.5.1) - Geração de PDFs
- JSZip (^3.10.1) - Empacotamento de arquivos para SCORM
- Pacotes compartilhados do monorepo
  - `@edunexia/ui-components` - Componentes de UI
  - `@edunexia/auth` - Autenticação
  - `@edunexia/database-schema` - Esquema de banco de dados
  - `@edunexia/api-client` - Cliente de API unificado
  - `@edunexia/core` - Componentes e layouts compartilhados

## Desenvolvimento Futuro

- Implementação de testes automatizados
- Suporte a mais formatos de exportação (xAPI, cmi5)
- Melhorias no motor de IA com modelos mais avançados
- Editor colaborativo em tempo real 