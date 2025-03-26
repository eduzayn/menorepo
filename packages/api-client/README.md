# API Client - Edunéxia

Um cliente unificado para todas as interações com a API do Supabase na plataforma Edunéxia.

## Características

- **Cliente Centralizado**: Uma única abstração para interagir com o Supabase
- **Tratamento de Erros**: Padronização do tratamento de erros em toda a aplicação
- **React Query**: Integração com React Query para caching e revalidação automática
- **Tipagem Forte**: Tipagem completa com TypeScript para melhor experiência de desenvolvimento

## Instalação

Este pacote já está disponível automaticamente para todos os aplicativos da Edunéxia como parte do monorepo.

## Como Usar

### Configuração

```tsx
// Em seu arquivo principal (ex: _app.tsx, App.tsx)
import { ApiProvider, createApiClient } from '@edunexia/api-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Criar cliente de API
const apiClient = createApiClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  enableLogging: process.env.NODE_ENV === 'development'
});

// Criar client do React Query
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider client={apiClient}>
        <Component {...pageProps} />
      </ApiProvider>
    </QueryClientProvider>
  );
}
```

### Usando Hooks

```tsx
import { useQuery, useMutation } from '@edunexia/api-client';
import { listarDisciplinas, criarDisciplina } from '@edunexia/api-client';

function MinhasPagina() {
  // Carregar dados com cache
  const { data, isLoading, error } = useQuery(
    ['disciplinas'], 
    (api) => listarDisciplinas(api)
  );

  // Criar nova disciplina
  const mutation = useMutation(
    'criar-disciplina',
    (novaDisciplina, api) => criarDisciplina(api, novaDisciplina),
    {
      onSuccess: () => {
        // Invalidar cache para recarregar dados
        queryClient.invalidateQueries(['disciplinas']);
      }
    }
  );

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h1>Disciplinas</h1>
      <ul>
        {data?.disciplinas.map(disciplina => (
          <li key={disciplina.id}>{disciplina.title}</li>
        ))}
      </ul>
      <button 
        onClick={() => mutation.mutate({ 
          title: 'Nova Disciplina',
          description: 'Descrição...',
          duration: '10h',
          status: 'active',
          authorId: 'user-id'
        })}
      >
        Adicionar
      </button>
    </div>
  );
}
```

### Acesso Direto ao Cliente

```tsx
import { useApi } from '@edunexia/api-client';

function MeuComponente() {
  const { client } = useApi();
  
  const handleOperation = async () => {
    try {
      // Acesso direto ao cliente Supabase
      const { data, error } = await client.supabase
        .from('tabela_personalizada')
        .select('*');
        
      // Ou usando o método executeOperation para tratamento de erros consistente
      const result = await client.executeOperation('operacao.personalizada', async () => {
        // Lógica personalizada aqui
        return { sucesso: true };
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  return <button onClick={handleOperation}>Executar</button>;
}
```

## Serviços Disponíveis

Este pacote inclui diversos serviços prontos para uso:

- **Auth**: `signIn`, `signOut`, `getCurrentUser`
- **Documentos**: `uploadDocumento`, `listarDocumentos`, `validarDocumentoIA`
- **Matrículas**: `criarMatricula`, `obterMatricula`, `listarMatriculasPorAluno`, `atualizarStatusMatricula`
- **Disciplinas**: `criarDisciplina`, `listarDisciplinas`, `obterDisciplina`, `atualizarDisciplina`, `removerDisciplina`
- **Comunicação**: `enviarMensagem`, `listarMensagensRecebidas`, `listarMensagensEnviadas`, `marcarComoLida`

## Benefícios

1. **Consistência**: Tratamento padronizado de erros e responses
2. **Performance**: Cache automático e revalidação inteligente
3. **DX**: Melhor experiência para desenvolvedores com tipos e documentação
4. **Manutenção**: Atualizações em um único lugar afetam todos os apps

## Contribuindo

Para adicionar novos serviços:

1. Crie um arquivo em `src/services/[nome-do-servico].ts`
2. Exporte-o em `src/services/index.ts`
3. Atualize esta documentação com os novos métodos 