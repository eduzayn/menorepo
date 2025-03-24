# Módulo de Autenticação - Edunéxia

Este módulo é responsável por gerenciar a autenticação unificada da plataforma Edunéxia, fornecendo funcionalidades de login, registro, recuperação de senha e gerenciamento de sessões.

## 🚀 Tecnologias

- React + TypeScript
- React Router DOM
- Supabase Auth
- Tailwind CSS
- Vite

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Preencha as variáveis no arquivo `.env` com suas credenciais do Supabase

## 🛠️ Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
yarn dev
```

O servidor estará disponível em `http://localhost:3000`

## 📝 Scripts Disponíveis

- `yarn dev`: Inicia o servidor de desenvolvimento
- `yarn build`: Gera o build de produção
- `yarn preview`: Visualiza o build de produção localmente
- `yarn lint`: Executa a verificação de linting

## 🔐 Funcionalidades

- Login com email/senha
- Registro de novos usuários
- Recuperação de senha
- Verificação de email
- Gerenciamento de perfil
- Gerenciamento de sessões ativas

## 🏗️ Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── hooks/         # Hooks personalizados
├── layouts/       # Layouts da aplicação
├── lib/           # Configurações e utilitários
├── pages/         # Páginas da aplicação
└── routes/        # Configuração de rotas
```

## 🔒 Segurança

- Autenticação via Supabase
- Proteção de rotas
- Validação de inputs
- Sanitização de dados
- Proteção contra CSRF

## 📄 Documentação

Para mais informações sobre a integração com outros módulos e APIs, consulte a documentação completa em `docs/`.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../../LICENSE) para mais detalhes. 