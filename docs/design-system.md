# Design System - Edunéxia

## Visão Geral

O Design System da Edunéxia é um conjunto de componentes React reutilizáveis, construídos com TypeScript e Tailwind CSS. Ele está localizado em `packages/ui-components` e é compartilhado entre todos os módulos da plataforma.

## Estrutura de Componentes

```bash
packages/ui-components/src/components/
├── layout/              # Componentes de layout e estrutura
│   ├── Button.tsx      # Botões com animações e variantes
│   ├── Card.tsx        # Cards para conteúdo
│   └── Spinner.tsx     # Indicador de carregamento
├── form/               # Componentes de formulário
│   ├── Input.tsx       # Inputs com ícones e validação
│   ├── TextField.tsx   # Campo com label e feedback
│   ├── Textarea.tsx    # Área de texto expansível
│   └── Select.tsx      # Seleção com opções
├── dialog/             # Componentes de diálogo
│   └── Dialog.tsx      # Modais e popups
├── data-display/       # Componentes de exibição de dados
│   ├── Avatar.tsx      # Avatares de usuário
│   ├── Badge.tsx       # Badges de status
│   ├── Chip.tsx        # Chips para tags
│   └── Tooltip.tsx     # Tooltips informativos
├── navigation/         # Componentes de navegação
│   └── Command.tsx     # Menu de comandos
├── feedback/           # Componentes de feedback
│   ├── Toast.tsx       # Notificações temporárias
│   └── Alert.tsx       # Alertas informativos
├── data-table/         # Componentes de tabela
│   ├── Table.tsx       # Tabela principal
│   ├── TableHeader.tsx # Cabeçalho da tabela
│   ├── TableBody.tsx   # Corpo da tabela
│   └── TablePagination.tsx # Paginação
├── chat/               # Componentes de chat
│   ├── Chat.tsx        # Container de chat
│   ├── ChatMessage.tsx # Mensagens individuais
│   └── ChatInput.tsx   # Input de mensagem
└── upload/             # Componentes de upload
    ├── Upload.tsx      # Container de upload
    ├── UploadDropzone.tsx # Área de drop
    └── UploadProgress.tsx # Barra de progresso
```

## Tecnologias Utilizadas

- **React**: Componentes funcionais com TypeScript
- **Tailwind CSS**: Estilização e design responsivo
- **Shadcn UI**: Base de componentes acessíveis
- **Radix UI**: Componentes primitivos sem estilo
- **Zod**: Validação de formulários

## Como Usar

### Instalação

O pacote já está configurado no monorepo. Para usar em um módulo:

```typescript
import { Button, Card, Input } from '@repo/ui-components'
```

### Boas Práticas

1. **Componentes Server vs Client**
   - Prefira Server Components quando possível
   - Use 'use client' apenas para componentes que precisam de interatividade

2. **Acessibilidade**
   - Todos os componentes seguem as diretrizes WCAG
   - Incluem suporte a teclado e leitores de tela
   - Usam ARIA labels e roles apropriados

3. **Responsividade**
   - Implementação mobile-first
   - Breakpoints consistentes em todo o sistema
   - Adaptação automática para diferentes tamanhos de tela

4. **Performance**
   - Lazy loading para componentes grandes
   - Otimização de imagens
   - Minimização de re-renders

## Contribuindo

### Criando Novos Componentes

1. Escolha o diretório apropriado baseado na categoria
2. Crie o componente usando TypeScript
3. Implemente as props necessárias
4. Adicione documentação com JSDoc
5. Inclua testes unitários
6. Atualize o arquivo index.ts

### Exemplo de Componente

```typescript
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'rounded-md font-medium transition-colors',
          // Variantes
          variant === 'primary' && 'bg-primary text-white hover:bg-primary/90',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          // Tamanhos
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4',
          size === 'lg' && 'h-12 px-6 text-lg',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

## Manutenção

### Atualizando Componentes

1. Mantenha a compatibilidade com versões anteriores
2. Documente mudanças breaking
3. Atualize os testes
4. Verifique o impacto em todos os módulos

### Versionamento

- Seguimos Semantic Versioning (MAJOR.MINOR.PATCH)
- Breaking changes requerem bump de MAJOR
- Novas features requerem bump de MINOR
- Bug fixes requerem bump de PATCH

## Suporte

Para dúvidas ou problemas:
1. Consulte a documentação
2. Verifique os testes
3. Abra uma issue no repositório
4. Entre em contato com a equipe de design system 