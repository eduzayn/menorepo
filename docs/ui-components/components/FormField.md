# FormField

O componente `FormField` é um wrapper padronizado para campos de formulário que fornece uma estrutura consistente para labels, inputs, mensagens de erro e textos de ajuda.

## Importação

```tsx
import { FormField } from '@edunexia/ui-components';
```

## Uso Básico

```tsx
<FormField 
  name="email" 
  label="E-mail"
  required
>
  <Input type="email" placeholder="seu@email.com" />
</FormField>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `id` | `string` | `field-${name}` | ID do campo (se não fornecido, será gerado automaticamente) |
| `name` | `string` | - | Nome do campo (obrigatório) |
| `label` | `string` | - | Texto do rótulo do campo (obrigatório) |
| `error` | `string` | - | Mensagem de erro (opcional) |
| `helpText` | `string` | - | Texto de ajuda ou descrição (opcional) |
| `required` | `boolean` | `false` | Se o campo é obrigatório |
| `disabled` | `boolean` | `false` | Se o campo está desabilitado |
| `children` | `ReactNode` | - | Componente(s) filho(s) (geralmente um input, select, etc) |
| `className` | `string` | `''` | Classes CSS adicionais para o contêiner |

## Exemplos

### Campo com Mensagem de Ajuda

```tsx
<FormField 
  name="password" 
  label="Senha"
  helpText="A senha deve ter pelo menos 8 caracteres"
  required
>
  <Input type="password" />
</FormField>
```

### Campo com Mensagem de Erro

```tsx
<FormField 
  name="email" 
  label="E-mail"
  error={errors.email?.message}
  required
>
  <Input type="email" />
</FormField>
```

### Campo Desabilitado

```tsx
<FormField 
  name="username" 
  label="Nome de usuário"
  disabled
>
  <Input type="text" value="usuarioexistente" />
</FormField>
```

### Uso com React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { FormField, Input, Button } from '@edunexia/ui-components';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField 
        name="email" 
        label="E-mail"
        error={errors.email?.message}
        required
      >
        <Input {...register('email', { required: 'E-mail é obrigatório' })} type="email" />
      </FormField>
      
      <FormField 
        name="password" 
        label="Senha"
        error={errors.password?.message}
        required
      >
        <Input {...register('password', { required: 'Senha é obrigatória' })} type="password" />
      </FormField>
      
      <Button type="submit">Entrar</Button>
    </form>
  );
}
```

## Acessibilidade

O componente `FormField` implementa várias práticas recomendadas de acessibilidade:

- Associação explícita de labels com campos usando atributos `for` e `id`
- Uso de `aria-invalid` para indicar campos com erro
- Uso de `aria-describedby` para associar mensagens de erro e textos de ajuda aos campos
- Indicadores visuais para campos obrigatórios e desabilitados

## Notas de Implementação

- O componente clona automaticamente os elementos filhos para passar props como `id`, `name`, e atributos ARIA.
- A mensagem de erro tem prioridade sobre o texto de ajuda (apenas um deles será exibido, mesmo que ambos sejam fornecidos).
- O componente não inclui validação - essa responsabilidade fica a cargo da biblioteca de formulários usada (como React Hook Form). 