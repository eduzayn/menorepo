# MainLayout

O componente `MainLayout` é um layout unificado para todos os módulos da plataforma Edunéxia, fornecendo uma estrutura consistente com sidebar, header, área de conteúdo e painel de detalhes opcional.

## Importação

```tsx
import { MainLayout } from '@edunexia/ui-components';
```

## Uso Básico

```tsx
<MainLayout
  title="Módulo de Comunicação"
  user={{ name: "João Silva", email: "joao@exemplo.com", roles: ["admin"] }}
  onLogout={() => handleLogout()}
>
  <div>Conteúdo principal</div>
</MainLayout>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `children` | `ReactNode` | - | Conteúdo principal a ser renderizado (obrigatório) |
| `title` | `string` | - | Título da página ou do módulo |
| `navigationItems` | `NavigationItem[]` | (itens padrão) | Itens personalizados para o menu de navegação |
| `sidebarContent` | `ReactNode` | - | Conteúdo personalizado para a sidebar |
| `headerContent` | `ReactNode` | - | Conteúdo adicional para o cabeçalho |
| `footer` | `ReactNode` | - | Conteúdo personalizado para o rodapé |
| `user` | `object` | - | Dados do usuário logado |
| `user.name` | `string` | - | Nome do usuário |
| `user.email` | `string` | - | Email do usuário |
| `user.avatar` | `string` | - | URL da imagem de avatar do usuário |
| `user.roles` | `string[]` | - | Funções/papéis do usuário no sistema |
| `renderNavigationItem` | `function` | - | Função para renderizar um item de navegação personalizado |
| `detailsPanel` | `ReactNode` | - | Painel de detalhes lateral |
| `showDetailsPanel` | `boolean` | `false` | Se o painel de detalhes deve ser exibido |
| `onLogout` | `() => void` | - | Função chamada ao clicar no botão de sair |
| `className` | `string` | `''` | Classes CSS adicionais para o layout |

## NavigationItem

Interface para itens de navegação:

```tsx
interface NavigationItem {
  name: string;       // Nome do item
  href: string;       // URL/rota do item
  icon: React.ElementType; // Componente de ícone
  admin?: boolean;    // Se o item requer privilégio de admin
}
```

## Exemplos

### Layout Básico

```tsx
<MainLayout
  title="Dashboard"
  user={{
    name: "Ana Silva",
    email: "ana@edunexia.com",
    avatar: "/avatars/ana.jpg"
  }}
  onLogout={() => signOut()}
>
  <h2>Bem-vindo ao Dashboard</h2>
  <p>Conteúdo principal da página aqui...</p>
</MainLayout>
```

### Com Itens de Navegação Personalizados

```tsx
import { Home, Users, Settings, Book, Calendar } from 'lucide-react';

const navigationItems = [
  { name: 'Início', href: '/dashboard', icon: Home },
  { name: 'Alunos', href: '/alunos', icon: Users },
  { name: 'Cursos', href: '/cursos', icon: Book },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Configurações', href: '/configuracoes', icon: Settings, admin: true }
];

<MainLayout
  title="Módulo Acadêmico"
  navigationItems={navigationItems}
  user={{
    name: "Carlos Mendes",
    email: "carlos@edunexia.com",
    roles: ["professor"]
  }}
>
  <div>Conteúdo principal...</div>
</MainLayout>
```

### Com Painel de Detalhes

```tsx
<MainLayout
  title="Chat - Atendimento"
  detailsPanel={
    <div className="p-4">
      <h3 className="font-medium">Detalhes do Aluno</h3>
      <div className="mt-4">
        <p><strong>Nome:</strong> Maria Oliveira</p>
        <p><strong>Matrícula:</strong> 2023001</p>
        <p><strong>Curso:</strong> Engenharia de Software</p>
        <p><strong>Período:</strong> 3º</p>
      </div>
    </div>
  }
  showDetailsPanel={true}
>
  <div className="chat-container">
    {/* Interface de chat */}
  </div>
</MainLayout>
```

### Com Renderização Personalizada de Item de Navegação

```tsx
<MainLayout
  title="Módulo Administrativo"
  renderNavigationItem={(item, isActive) => (
    <div 
      key={item.name}
      className={`
        p-3 rounded-lg mb-2 flex items-center
        ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}
      `}
    >
      <item.icon size={20} className="mr-3" />
      <span className="font-medium">{item.name}</span>
      {item.admin && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Admin</span>}
    </div>
  )}
>
  <div>Conteúdo principal...</div>
</MainLayout>
```

## Integração com React Router

```tsx
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { MainLayout } from '@edunexia/ui-components';

// Componente wrapper para usar com React Router
function AppLayout({ children }) {
  const location = useLocation();
  
  // Função personalizada para renderizar links do React Router
  const renderNavigationItem = (item, isActive) => (
    <Link
      key={item.name}
      to={item.href}
      className={`
        ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
        group flex items-center px-2 py-2 text-sm font-medium rounded-md
      `}
    >
      <item.icon className="mr-3 h-5 w-5" />
      {item.name}
    </Link>
  );
  
  return (
    <MainLayout
      renderNavigationItem={renderNavigationItem}
      user={currentUser}
      onLogout={handleLogout}
    >
      {children}
    </MainLayout>
  );
}

// Uso na aplicação
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/*" 
          element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/alunos" element={<Alunos />} />
                <Route path="/config" element={<Configuracoes />} />
              </Routes>
            </AppLayout>
          } 
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Notas de Implementação

- O componente filtra automaticamente os itens de navegação marcados como `admin: true` com base nos papéis do usuário
- A sidebar é responsiva e se oculta em dispositivos móveis
- O painel de detalhes é opcional e pode ser mostrado/ocultado conforme necessário
- O conteúdo do cabeçalho, rodapé e barra lateral podem ser totalmente personalizados 