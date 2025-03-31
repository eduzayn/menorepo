import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MODULES } from '../../constants/modules';
import './portal-selector.css';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { BookOpen, GraduationCap, MessageSquare, CreditCard, BarChart, Settings, Layout, LogOut } from 'lucide-react';

/**
 * Página dedicada ao seletor de portais
 * Mostra todos os portais que o usuário tem acesso
 */
const PortalSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useAuth();
  
  // Redireciona para o login se não estiver autenticado
  React.useEffect(() => {
    console.log('PortalSelector - Auth state:', { user, isLoading });
    
    if (!isLoading && !user) {
      console.log('Usuário não autenticado, redirecionando para login');
      navigate('/login', { replace: true });
    } else if (!isLoading && user) {
      console.log('Usuário autenticado no seletor de portais:', user.name);
    }
  }, [user, isLoading, navigate]);
  
  const handlePortalSelect = (route: string) => {
    navigate(route);
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };
  
  // Obtém módulos que o usuário tem acesso
  const accessibleModules = MODULES.filter(module => {
    const permission = module.requiredPermission;
    return user?.permissions?.[permission]?.read;
  });
  
  // Definindo a interface para os cards de módulos
  interface ModuleCard {
    id: string;
    title: string;
    description: string;
    url: string;
    icon: React.ReactNode;
    color: string;
    category: string;
  }

  const modules: ModuleCard[] = [
    {
      id: 'matriculas',
      title: 'Sistema de Matrículas',
      description: 'Gerencie todo o processo de matrículas e rematrículas de alunos.',
      url: '/matriculas',
      icon: <GraduationCap size={24} />,
      color: 'bg-blue-100 text-blue-600',
      category: 'acadêmico'
    },
    {
      id: 'portal-do-aluno',
      title: 'Portal do Aluno',
      description: 'Portal completo para interação dos alunos com os serviços acadêmicos.',
      url: '/portal-do-aluno',
      icon: <BookOpen size={24} />,
      color: 'bg-purple-100 text-purple-600',
      category: 'acadêmico'
    },
    {
      id: 'material-didatico',
      title: 'Material Didático',
      description: 'Acesse e gerencie todo o conteúdo pedagógico digital.',
      url: '/material-didatico',
      icon: <BookOpen size={24} />,
      color: 'bg-green-100 text-green-600',
      category: 'acadêmico'
    },
    {
      id: 'comunicacao',
      title: 'Comunicação',
      description: 'Centralize e gerencie toda a comunicação com alunos e responsáveis.',
      url: '/comunicacao',
      icon: <MessageSquare size={24} />,
      color: 'bg-pink-100 text-pink-600',
      category: 'administrativo'
    },
    {
      id: 'financeiro',
      title: 'Gestão Financeira',
      description: 'Controle completo das finanças da instituição e mensalidades.',
      url: '/financeiro',
      icon: <CreditCard size={24} />,
      color: 'bg-yellow-100 text-yellow-600',
      category: 'administrativo'
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      description: 'Visualize e extraia dados estratégicos para tomada de decisão.',
      url: '/relatorios',
      icon: <BarChart size={24} />,
      color: 'bg-red-100 text-red-600',
      category: 'administrativo'
    },
    {
      id: 'dashboard',
      title: 'Dashboard Central',
      description: 'Visualização centralizada de todos os indicadores e métricas.',
      url: '/dashboard',
      icon: <Layout size={24} />,
      color: 'bg-indigo-100 text-indigo-600',
      category: 'gestão'
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      description: 'Configure todos os parâmetros e personalizações do sistema.',
      url: '/configuracoes',
      icon: <Settings size={24} />,
      color: 'bg-gray-100 text-gray-600',
      category: 'gestão'
    },
  ];

  // Função para agrupar os módulos por categoria
  const getModulesByCategory = (category: string) => {
    return modules.filter(module => module.category === category);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-800 mb-8 text-center">
          Central de Módulos Edunéxia
        </h1>
        
        {user && (
          <p className="text-lg text-gray-600 mb-2 text-center">
            Bem-vindo(a), <strong>{user.name}</strong>!
          </p>
        )}
        
        <p className="text-lg text-gray-600 mb-12 text-center">
          Escolha o módulo que deseja acessar e gerencie todos os aspectos da sua instituição educacional.
        </p>
        
        <Tabs defaultValue="acadêmico" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="acadêmico">Acadêmico</TabsTrigger>
            <TabsTrigger value="administrativo">Administrativo</TabsTrigger>
            <TabsTrigger value="gestão">Gestão</TabsTrigger>
          </TabsList>
          
          {/* Módulos Acadêmicos */}
          <TabsContent value="acadêmico" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getModulesByCategory('acadêmico').map(module => (
                <div
                  key={module.id}
                  onClick={() => handlePortalSelect(module.url)}
                  className="flex flex-col border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-4`}>
                    {module.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-gray-600">{module.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Módulos Administrativos */}
          <TabsContent value="administrativo" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getModulesByCategory('administrativo').map(module => (
                <div
                  key={module.id}
                  onClick={() => handlePortalSelect(module.url)}
                  className="flex flex-col border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-4`}>
                    {module.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-gray-600">{module.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Módulos de Gestão */}
          <TabsContent value="gestão" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getModulesByCategory('gestão').map(module => (
                <div
                  key={module.id}
                  onClick={() => handlePortalSelect(module.url)}
                  className="flex flex-col border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-4`}>
                    {module.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-gray-600">{module.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Informações Importantes
          </h2>
          <p className="text-gray-600 mb-4">
            Cada módulo possui funcionalidades específicas e dedicadas para suas respectivas áreas.
            Ao acessar um módulo, você será redirecionado para o ambiente apropriado.
          </p>
          <p className="text-gray-600">
            Caso precise de ajuda, entre em contato com o suporte técnico pelo e-mail
            <a href="mailto:suporte@edunexia.com.br" className="text-primary-600 hover:underline ml-1">
              suporte@edunexia.com.br
            </a>
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={handleLogout} 
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Sair do sistema
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortalSelectorPage; 