import React, { useState } from 'react';
import { useAuth } from '@edunexia/auth';
import PortalSelector from './PortalSelector';
import './PortalNavbar.css';

interface PortalNavbarProps {
  portalId: string;
  portalName: string;
  portalIcon: string;
}

/**
 * Barra de navegação comum para todos os portais
 * Inclui acesso ao seletor de portais e informações do usuário
 */
const PortalNavbar: React.FC<PortalNavbarProps> = ({ portalId, portalName, portalIcon }) => {
  const [showPortalSelector, setShowPortalSelector] = useState(false);
  const { currentUser, logout } = useAuth();
  
  const handleOpenPortalSelector = () => {
    setShowPortalSelector(true);
  };
  
  const handleClosePortalSelector = () => {
    setShowPortalSelector(false);
  };
  
  const handlePortalSelect = (selectedPortalId: string) => {
    if (selectedPortalId !== portalId) {
      // Redirecionar para o portal selecionado via URL de redirecionamento
      window.location.href = `/redirect?portal=${selectedPortalId}`;
    }
    setShowPortalSelector(false);
  };
  
  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };
  
  return (
    <>
      <nav className="portal-navbar">
        <div className="portal-navbar-container">
          <div className="portal-navbar-brand">
            <button 
              className="portal-selector-button"
              onClick={handleOpenPortalSelector}
              aria-label="Trocar de portal"
            >
              <img src={portalIcon} alt="" className="portal-icon" />
              <span className="portal-name">{portalName}</span>
              <span className="portal-selector-chevron">▼</span>
            </button>
          </div>
          
          <div className="portal-navbar-actions">
            {currentUser && (
              <div className="user-profile">
                <span className="user-name">{currentUser.fullName}</span>
                <button 
                  className="logout-button"
                  onClick={handleLogout}
                  aria-label="Sair do sistema"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {showPortalSelector && (
        <PortalSelector
          onClose={handleClosePortalSelector}
          onSelect={handlePortalSelect}
        />
      )}
    </>
  );
};

export default PortalNavbar; 