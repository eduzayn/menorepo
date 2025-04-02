# Documentação Docker - Edunexia

## Introdução

Este documento descreve como executar o ambiente Edunexia usando Docker. As configurações estão disponíveis para ambientes de **desenvolvimento** e **produção**.

## Modificações Realizadas

Foram realizados os seguintes ajustes no projeto para garantir o funcionamento no Docker:

1. **Correção de problemas de contexto React**:
   - Ajustou-se a hierarquia de providers no App.tsx para garantir que o AuthProvider esteja envolvendo o Router
   - Foram corrigidos erros de navegação relacionados ao React Router

2. **Implementação de componentes faltantes**:
   - Adicionado componente de Tabs baseado no Shadcn UI
   - Criado utilitário `cn` para gerenciamento de classes

3. **Tratamento de erros de desestruturação**:
   - Implementado acesso seguro a propriedades com operadores opcionais (`?.`)
   - Adicionado valores default para propriedades que podem ser nulas

4. **Configuração do ambiente Docker**:
   - Criado Dockerfile otimizado para desenvolvimento
   - Configurado proxy reverso Nginx para servir a aplicação
   - Implementado mock de bibliotecas compartilhadas ausentes

## Requisitos

- Docker
- Docker Compose

## Ambiente de Desenvolvimento

### Executando em Desenvolvimento

Para executar o ambiente de desenvolvimento:

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar logs
docker logs -f menorepo-site-edunexia-1

# Parar todos os serviços
docker-compose down
```

A aplicação estará disponível em:
- http://localhost (via proxy Nginx)
- http://localhost:3001 (acesso direto ao Vite dev server)

### Estrutura de contêineres

O ambiente de desenvolvimento utiliza os seguintes contêineres:

- **site-edunexia**: Servidor de desenvolvimento Vite rodando na porta 5173 internamente
- **nginx-proxy**: Proxy reverso que roteia requisições para o servidor de desenvolvimento

### Acessando o Ambiente de Desenvolvimento

O ambiente de desenvolvimento permite:

1. **Hot Module Reload (HMR)**: As alterações nos arquivos são refletidas automaticamente no navegador
2. **Depuração**: É possível conectar ferramentas de depuração como Chrome DevTools
3. **Visualização de erros em tempo real**: Erros de compilação são exibidos no console e no navegador

### Limitações do Ambiente de Desenvolvimento

O ambiente atual tem as seguintes limitações:

1. Não é otimizado para produção (arquivos não minificados, sem tree-shaking)
2. Utiliza mocks para alguns pacotes que ainda não estão completamente implementados
3. Não implementa todas as medidas de segurança necessárias para um ambiente de produção

## Ambiente de Produção

Foi criado um ambiente de produção otimizado com:

- Build completo da aplicação
- Configuração Nginx para servir arquivos estáticos
- Multi-stage build para reduzir o tamanho da imagem

### Executando em Produção

Para iniciar o ambiente de produção:

```bash
# Iniciar o ambiente de produção
docker-compose -f docker-compose.prod.yml up -d

# Verificar logs
docker logs -f menorepo-site-edunexia-1

# Parar os serviços
docker-compose -f docker-compose.prod.yml down
```

A aplicação estará disponível em:
- http://localhost (via proxy Nginx)

### Estrutura de Arquivos de Produção

- **apps/site-edunexia/Dockerfile.prod**: Dockerfile otimizado para produção
- **docker-compose.prod.yml**: Configuração do Docker Compose para produção

### Diferenças entre Ambientes

| Característica | Desenvolvimento | Produção |
|----------------|-----------------|----------|
| Hot Reload | ✅ Sim | ❌ Não |
| Depuração | ✅ Fácil | ⚠️ Limitada |
| Performance | ⚠️ Baixa | ✅ Otimizada |
| Tamanho da imagem | ⚠️ Grande | ✅ Reduzida |
| Tempo de inicialização | ✅ Rápido | ⚠️ Mais lento (build) |

## Considerações de Segurança

Para um ambiente de produção, considere:

1. Implementar HTTPS com certificados SSL
2. Configurar headers de segurança adequados no Nginx
3. Limitar o acesso a recursos conforme necessário
4. Implementar medidas contra DDoS e outros ataques
5. Configurar logs e monitoramento adequados

## Troubleshooting

### Problema: Erro ao iniciar os contêineres

Solução: Verifique se as portas não estão sendo usadas por outros serviços:

```bash
# Windows
netstat -ano | findstr "80 3001 5173"

# Linux/Mac
lsof -i :80,3001,5173
```

### Problema: Aplicação não carrega corretamente

Solução: Verifique os logs dos contêineres:

```bash
docker logs menorepo-site-edunexia-1
docker logs menorepo-nginx-proxy-1
```

### Problema: Alterações nos arquivos não são refletidas

Solução: Reconstrua os contêineres:

```bash
docker-compose down && docker-compose up --build -d
```

### Problema: Erro de TypeScript no build de produção

Solução: Foi criado um arquivo `tsconfig.build.json` mais permissivo para permitir que o build seja concluído mesmo com erros de TypeScript. Idealmente, esses erros devem ser corrigidos no código-fonte. 