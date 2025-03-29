import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarItem,
  SidebarSection,
  Header,
  PageContainer,
  Avatar,
  Dropdown,
  DropdownItem,
  Button,
  Icon
} from '@edunexia/ui-components';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    // Implementar lógica de logout
    console.log('Logout realizado');
    // Redirecionar para tela de login
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar>
        <div className="p-4 mb-6">
          <h1 className="text-xl font-bold text-primary">Edunéxia RH</h1>
        </div>

        <SidebarSection title="Gestão">
          <SidebarItem
            icon="dashboard"
            label="Dashboard"
            active={isActive('/')}
            onClick={() => navigate('/')}
          />
          <SidebarItem
            icon="users"
            label="Colaboradores"
            active={isActive('/colaboradores')}
            onClick={() => navigate('/colaboradores')}
          />
          <SidebarItem
            icon="briefcase"
            label="Vagas"
            active={isActive('/vagas')}
            onClick={() => navigate('/vagas')}
          />
          <SidebarItem
            icon="user-plus"
            label="Candidatos"
            active={isActive('/candidatos')}
            onClick={() => navigate('/candidatos')}
          />
          <SidebarItem
            icon="clipboard-check"
            label="Avaliações"
            active={isActive('/avaliacoes')}
            onClick={() => navigate('/avaliacoes')}
          />
        </SidebarSection>

        <SidebarSection title="Sistema">
          <SidebarItem
            icon="settings"
            label="Configurações"
            active={isActive('/configuracoes')}
            onClick={() => navigate('/configuracoes')}
          />
          <SidebarItem
            icon="help-circle"
            label="Ajuda"
            onClick={() => window.open('https://suporte.edunexia.com.br', '_blank')}
          />
        </SidebarSection>
      </Sidebar>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Header */}
        <Header>
          <div className="flex items-center">
            <div className="hidden md:block">
              <Button variant="ghost" size="sm" leftIcon="search">
                Pesquisar...
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" aria-label="Notificações">
              <Icon name="bell" />
            </Button>

            <Dropdown
              trigger={
                <Avatar
                  src="https://i.pravatar.cc/150?img=3"
                  alt="Avatar do usuário"
                  size="sm"
                  className="cursor-pointer"
                />
              }
            >
              <div className="px-4 py-3 text-sm border-b">
                <div className="font-medium">Ana Silva</div>
                <div className="text-gray-500">ana.silva@edunexia.com.br</div>
              </div>
              <DropdownItem icon="user" onClick={() => console.log('Perfil')}>
                Meu Perfil
              </DropdownItem>
              <DropdownItem icon="settings" onClick={() => navigate('/configuracoes')}>
                Configurações
              </DropdownItem>
              <DropdownItem icon="log-out" onClick={handleLogout}>
                Sair
              </DropdownItem>
            </Dropdown>
          </div>
        </Header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-auto">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  );
}; 