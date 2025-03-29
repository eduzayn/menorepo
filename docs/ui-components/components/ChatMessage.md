# ChatMessage

O componente `ChatMessage` é utilizado para exibir mensagens em interfaces de chat, com suporte para diferentes tipos de conteúdo como texto, imagens e arquivos.

## Importação

```tsx
import { ChatMessage } from '@edunexia/ui-components';
```

## Uso Básico

```tsx
<ChatMessage
  content="Olá, como posso ajudar?"
  timestamp={new Date()}
  isOwn={false}
/>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `content` | `string` | - | Conteúdo da mensagem (obrigatório) |
| `type` | `'TEXT' \| 'IMAGE' \| 'FILE'` | `'TEXT'` | Tipo da mensagem |
| `timestamp` | `Date` | - | Data e hora da mensagem (obrigatório) |
| `isOwn` | `boolean` | `false` | Indica se a mensagem é do próprio usuário |
| `className` | `string` | `''` | Classes CSS adicionais |

## Exemplos

### Mensagem de Texto

```tsx
<ChatMessage
  content="Olá, como posso ajudar você hoje?"
  timestamp={new Date()}
  isOwn={false}
/>
```

### Mensagem de Imagem

```tsx
<ChatMessage
  content="https://exemplo.com/imagem.jpg"
  type="IMAGE"
  timestamp={new Date()}
  isOwn={true}
/>
```

### Mensagem de Arquivo

```tsx
<ChatMessage
  content="https://exemplo.com/documento.pdf"
  type="FILE"
  timestamp={new Date()}
  isOwn={false}
/>
```

### Mensagem do Próprio Usuário

```tsx
<ChatMessage
  content="Preciso de ajuda com minha matrícula"
  timestamp={new Date()}
  isOwn={true}
/>
```

## Conversação Completa

```tsx
import { ChatMessage } from '@edunexia/ui-components';

function Conversation() {
  const messages = [
    { id: 1, content: "Olá, como posso ajudar?", timestamp: new Date(2023, 6, 15, 10, 0), isOwn: false },
    { id: 2, content: "Preciso de informações sobre o curso de Ciência de Dados", timestamp: new Date(2023, 6, 15, 10, 2), isOwn: true },
    { id: 3, content: "Claro! O curso tem duração de 6 meses e inclui módulos de estatística, Python e machine learning.", timestamp: new Date(2023, 6, 15, 10, 5), isOwn: false },
    { id: 4, content: "https://exemplo.com/ciencia-dados-brochura.pdf", type: "FILE", timestamp: new Date(2023, 6, 15, 10, 6), isOwn: false },
  ];
  
  return (
    <div className="space-y-4 p-4">
      {messages.map(msg => (
        <ChatMessage
          key={msg.id}
          content={msg.content}
          type={msg.type || 'TEXT'}
          timestamp={msg.timestamp}
          isOwn={msg.isOwn}
        />
      ))}
    </div>
  );
}
```

## Notas de Implementação

- O componente utiliza cores diferentes para mensagens do próprio usuário (cor primária) e de outros (cor neutra)
- O alinhamento das mensagens varia de acordo com `isOwn`: à direita para mensagens próprias e à esquerda para as demais
- A timestamp da mensagem é formatada como HH:mm utilizando a biblioteca date-fns com localização para pt-BR
- O componente renderiza automaticamente o conteúdo de acordo com o tipo da mensagem (texto, imagem ou link para arquivo) 