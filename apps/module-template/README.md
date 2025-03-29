<!-- cSpell:disable -->
# Edunéxia - Módulo Template

Este é um template para a criação de novos módulos na plataforma Edunéxia. Use esta estrutura de arquivos e diretrizes para garantir consistência com o resto da plataforma.

## Visão Geral

Breve descrição do propósito deste módulo na plataforma Edunéxia.

## Estrutura do Módulo

```
apps/nome-do-modulo/
├── src/
│   ├── components/           # Componentes específicos do módulo
│   │   └── index.ts         
│   │
│   ├── contexts/             # Contextos específicos (se necessário)
│   │   └── index.ts
│   │
│   ├── hooks/                # Hooks específicos do módulo
│   │   └── index.ts
│   │
│   ├── pages/                # Páginas do módulo
│   │   └── index.ts
│   │
│   ├── services/             # Serviços específicos do módulo
│   │   └── index.ts
│   │
│   ├── utils/                # Utilitários específicos do módulo
│   │   └── index.ts
│   │
│   ├── types/                # Tipos e interfaces
│   │   └── index.ts
│   │
│   ├── routes.tsx            # Definição de rotas do módulo
│   └── index.tsx             # Ponto de entrada
│
├── package.json
└── README.md                 # Esta documentação
```

## Responsabilidades do Módulo

- Descreva as principais responsabilidades e funcionalidades
- Liste as integrações com outros módulos
- Explique os fluxos de negócios implementados

## Fluxos Principais

| Funcionalidade | Descrição | Permissões Necessárias |
|----------------|-----------|------------------------|
| Visualizar XXX | Descrição do fluxo | aluno, professor, admin |
| Editar YYY | Descrição do fluxo | professor, admin |
| Excluir ZZZ | Descrição do fluxo | admin |

## Integração com Outros Módulos

- **Módulo A**: Descrição da integração
- **Módulo B**: Descrição da integração

## Componentes Principais

- `ComponenteA`: Propósito e responsabilidade
- `ComponenteB`: Propósito e responsabilidade

## Páginas

- `/nome-do-modulo`: Página inicial do módulo
- `/nome-do-modulo/detalhe/:id`: Página de detalhes
- `/nome-do-modulo/editar/:id`: Formulário de edição

## Serviços

Os serviços de dados são implementados em `src/services/` e integram-se com a API da Edunéxia:

```typescript
// Exemplo de serviço
export async function buscarDados(client: ApiClient, filtro: FiltroInput): Promise<DadosResultado> {
  try {
    const { data, error } = await client.from('tabela')
      .select('*')
      .match(filtro);
      
    if (error) throw error;
    
    return { dados: data, error: null };
  } catch (error) {
    return {
      dados: null,
      error: client.handleError(error, 'servico.buscarDados')
    };
  }
}
```

## Hooks Personalizados

Este módulo implementa hooks personalizados para encapsular lógica específica:

```typescript
// Exemplo de hook
export function useMinhaFeature() {
  const { client } = useApi();
  const [dados, setDados] = useState<Dados[]>([]);
  
  // Lógica do hook
  
  return { dados };
}
```

## Dependências

- **Core Module**: Para layouts e hooks compartilhados
- **UI Components**: Para componentes de interface
- **API Client**: Para integração com backend

## Desenvolvimento

1. Clone o repositório
2. Instale as dependências com `pnpm`
3. Execute o módulo com `pnpm --filter @edunexia/nome-do-modulo dev`

### Ferramentas de Build

Este módulo utiliza **Vite** como ferramenta de build padrão, proporcionando:
- Hot Module Replacement (HMR) para desenvolvimento rápido e eficiente
- Otimização de build para produção com code splitting automático
- Suporte integrado para TypeScript, JSX, CSS e assets
- Aliases para importações mais limpas e organizadas
- Ambiente de desenvolvimento rápido com tempo de inicialização mínimo
- Configuração simplificada através do arquivo `vite.config.ts`

Para compilar o módulo para produção:
```bash
pnpm --filter @edunexia/nome-do-modulo build
```

Para visualizar a versão de produção localmente:
```bash
pnpm --filter @edunexia/nome-do-modulo preview
```

## Testes

Execute os testes com:

```bash
pnpm --filter @edunexia/nome-do-modulo test
```

## Padrões a Seguir

1. Use os contextos e hooks do Core sempre que possível
2. Siga o padrão de nomenclatura descrito na documentação
3. Documente novos componentes e funções com JSDoc
4. Mantenha a consistência com o restante da plataforma 
