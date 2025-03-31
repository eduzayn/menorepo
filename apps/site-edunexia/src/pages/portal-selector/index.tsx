import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@edunexia/auth';
import { MODULES } from '../../constants/modules';
import './portal-selector.css';

/**
 * Página dedicada ao seletor de portais
 * Mostra todos os portais que o usuário tem acesso
 */
const PortalSelectorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useAuth();
  
  // Redireciona para o login se não estiver autenticado
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
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
    return user?.permissions[permission]?.read;
  });
  
  if (isLoading) {
    return (
      <div className="portal-page loading">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }
  
  return (
    <div className="portal-page">
      <div className="portal-container">
        <div className="portal-header">
          <img 
            src="/logo-edunexia.svg" 
            alt="Edunéxia" 
            className="portal-logo"
          />
          <h1>Escolha seu portal</h1>
          <p className="portal-description">
            Bem-vindo(a), {user?.name}! Selecione o sistema que deseja acessar.
          </p>
        </div>
        
        <div className="portal-grid">
          {accessibleModules.length > 0 ? (
            accessibleModules.map((module) => (
              <button
                key={module.id}
                onClick={() => handlePortalSelect(module.route)}
                className="portal-card"
              >
                <div className="portal-icon-container">
                  <img src={module.icon} alt="" />
                </div>
                <div className="portal-details">
                  <span className="portal-title">{module.name}</span>
                  <span className="portal-subtitle">{module.description}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="no-portals">
              <p>Você não tem acesso a nenhum módulo.</p>
              <p>Entre em contato com o administrador do sistema.</p>
            </div>
          )}
        </div>
        
        <div className="portal-footer">
          <button onClick={handleLogout} className="logout-button">
            Sair do sistema
          </button>
        </div>
      </div>
      
      <div className="portal-info">
        <p>© {new Date().getFullYear()} Edunéxia - Todos os direitos reservados</p>
      </div>
    </div>
  );
};

export default PortalSelectorPage; 