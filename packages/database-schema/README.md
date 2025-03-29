<!-- cSpell:disable -->
# @edunexia/database-schema

Definições de esquema e tipos do banco de dados para a plataforma Edunéxia.

## Descrição

Este pacote contém as definições de esquema do banco de dados utilizado pela Edunéxia, implementadas com Supabase e PostgreSQL. O objetivo é centralizar as definições de tabelas, campos, relacionamentos e tipos para garantir consistência em toda a plataforma.

## Instalação

```bash
pnpm add @edunexia/database-schema
```

## Estrutura

O pacote contém:

- Definições de tabelas e relacionamentos
- Tipos TypeScript gerados a partir do esquema do banco
- Scripts de migração para Supabase
- Funções de validação de esquema
- Helpers para queries comuns

## Uso

```typescript
import { Database, Tables, TablesInsert } from '@edunexia/database-schema';

// Tipo para toda a base de dados
type DbType = Database;

// Tipo para a tabela de usuários
type Usuario = Tables['usuarios'];

// Tipo para inserção na tabela de matrículas
type NovaMatricula = TablesInsert['matriculas'];

// Exemplo de uso com cliente Supabase
const obterAluno = async (id: string, supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase
    .from('alunos')
    .select('*, usuarios(*)')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};
```

## Organização do Banco de Dados

O esquema do banco é organizado nas seguintes categorias:

- **auth**: Tabelas relacionadas a autenticação e usuários
- **configuracoes**: Tabelas de configuração do sistema
- **academico**: Tabelas para cursos, disciplinas, matrículas
- **financeiro**: Tabelas para faturamento, pagamentos, boletos
- **comunicacao**: Tabelas para mensagens, notificações, etc.

## Desenvolvimento

### Atualização do Esquema

Para atualizar o esquema:

1. Modifique os arquivos SQL em `supabase/migrations/`
2. Execute `pnpm generate-types` para atualizar os tipos TypeScript
3. Atualize o arquivo `index.ts` com as novas definições, se necessário
4. Execute os testes para garantir compatibilidade

### Scripts

- `pnpm build`: Compila a biblioteca
- `pnpm generate-types`: Gera tipos TypeScript do esquema Supabase
- `pnpm test`: Executa os testes
- `pnpm lint`: Executa o ESLint

## Migrações

As migrações são versionadas e aplicadas sequencialmente:

```
supabase/
├── migrations/
│   ├── 20230101000000_initial_schema.sql
│   ├── 20230215000000_add_cursos_table.sql
│   └── ...
└── seed/
    └── seed_data.sql
```

### Executando Migrações Localmente

```bash
cd packages/database-schema
pnpm supabase:start
pnpm supabase:migration:up
```

## Integração com o Monorepo

Este pacote faz parte do monorepo da Edunéxia e segue os padrões estabelecidos. Para mais informações sobre como contribuir para o monorepo, consulte o [README principal](../../README.md). 
