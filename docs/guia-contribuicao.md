<!-- cSpell:disable -->
# ✨ Guia de Contribuição para o Projeto Edunéxia

Bem-vindo ao repositório da **Edunéxia**! Este documento tem como objetivo orientar os colaboradores sobre boas práticas, padrões e diretrizes técnicas para contribuir com o projeto de forma eficaz e consistente.

---

## 🧠 Filosofia do Projeto

- **Modularidade sempre!** Cada funcionalidade é um módulo independente em `apps/`.
- **Reutilize código.** Tudo que for compartilhável vai em `packages/`.
- **Pense em escala.** Desde a UI até integrações e banco de dados.

---

## 📊 Estrutura do Projeto

```
edunexia-monorepo/
├── apps/                  # Módulos independentes
├── packages/              # Bibliotecas compartilhadas
├── package.json           # Workspaces do PNPM
├── tsconfig.json          # TypeScript global
└── README.md              # Documentação geral
```

---

## ⚙️ Tecnologias e Ferramentas

- **Monorepo:** PNPM Workspaces
- **Frontend:** React + TypeScript (Vite)
- **Backend:** Supabase
- **Deploy:** Vercel
- **Auth:** JWT + SSO (`packages/auth`)
- **UI:** Design System (`packages/ui-components`)
- **Banco:** `packages/database-schema`

---

## 🔧 Padrões de Código

- Use **ESLint**, **Prettier** e **Husky**.
- Arquivos: `kebab-case`, Componentes: `PascalCase`
- Tipagem estrita com TypeScript
- Comentários com **JSDoc** para funções complexas

---

## 💬 IA (Cursor)

- Sempre interaja com a IA em **português**.
- Dê contexto claro, indique o módulo e o objetivo.

---

## 🚪 Estrutura Recomendada por Módulo

```
apps/nome-do-modulo/
├── components/
├── pages/
├── services/
├── hooks/
├── types/
├── index.tsx
└── README.md
```

---

## 🚀 Processo de Contribuição

- O desenvolvimento é feito diretamente na branch principal (`main` ou `dev`).
- Evite criar múltiplas branches por módulo.
- Use **commits atômicos e semânticos**, com mensagens claras:

```bash
git commit -m "feat(matriculas): implementa fluxo de cadastro com validação"
git commit -m "fix(auth): corrige bug no token expirado"
git commit -m "chore: atualiza dependências do projeto"
```

- Teste localmente antes de dar push.
- Utilize mensagens no padrão `[módulo] resumo da alteração`.

**Importante:**
- **Não duplique componentes, rotas ou páginas já existentes**.
- Antes de criar um novo arquivo, verifique se algo similar já existe no projeto.
- A duplicidade pode gerar conflitos e comportamento inesperado no sistema.

---

## 🔹 Módulos Prioritários (Fase Atual)

- `apps/matriculas`
- `apps/portal-do-aluno`
- `apps/comunicacao`
- `apps/material-didatico`
- `apps/site-edunexia`
- `packages/auth`
- `packages/ui-components`

---

## 📄 Documentação

- Atualize o `README.md` do seu módulo
- Explique responsabilidades, endpoints, estrutura e fluxos

---

## 🚧 Boas Práticas Adicionais

- Use mensagens de commit claras (convenção: tipo: descrição)
- Teste antes de abrir PR
- Escreva código limpo e reutilizável
- Priorize performance e acessibilidade

---

Obrigado por contribuir com a Edunéxia! Vamos juntos construir o futuro da educação a distância 🌟 