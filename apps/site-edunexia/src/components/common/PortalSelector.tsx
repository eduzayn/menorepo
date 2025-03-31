import React, { useEffect, useRef } from 'react';
import { PORTAL_OPTIONS, PortalConfig, canAccessPortal } from '../../constants/portals';
import './PortalSelector.css';

interface PortalSelectorProps {
  onClose: () => void;
  onSelect: (portal: string) => void;
  userRoles?: string[]; // Adicionando prop opcional para papéis de usuário
}

/**
 * Componente que exibe um seletor de portais para navegação no ecossistema Edunexia
 */
const PortalSelector: React.FC<PortalSelectorProps> = ({ onClose, onSelect, userRoles = [] }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Filtrar portais baseado nas permissões do usuário
  const filteredPortals = React.useMemo(() => {
    // Se o usuário for admin, mostrar todos os portais
    const isAdmin = userRoles.includes('admin') || userRoles.includes('institution_admin');
    
    if (isAdmin) {
      return PORTAL_OPTIONS;
    }
    
    // Caso contrário, filtrar portais acessíveis
    return PORTAL_OPTIONS.filter(portal => canAccessPortal(portal.id, userRoles));
  }, [userRoles]);

  // Manipulador de teclas para acessibilidade
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Foco na primeira opção ao abrir
    const firstButton = modalRef.current?.querySelector('button');
    if (firstButton) {
      (firstButton as HTMLButtonElement).focus();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Manipulador de clique fora do modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Renderiza um card de portal
  const renderPortalCard = (portal: PortalConfig) => {
    return (
      <button
        key={portal.id}
        onClick={() => onSelect(portal.id)}
        className="portal-option"
        aria-label={`Acessar ${portal.name}`}
      >
        <div className="portal-icon">
          <img src={portal.icon} alt="" aria-hidden="true" />
        </div>
        <div className="portal-info">
          <span className="portal-name">{portal.name}</span>
          {portal.description && <span className="portal-description">{portal.description}</span>}
        </div>
      </button>
    );
  };

  return (
    <div 
      className="portal-selector-overlay" 
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portal-selector-title"
    >
      <div className="portal-selector-modal" ref={modalRef}>
        <div className="modal-header">
          <h3 id="portal-selector-title">Selecione seu Portal</h3>
          <button 
            onClick={onClose}
            className="close-button"
            aria-label="Fechar seletor de portais"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        
        <div className="portal-options">
          {filteredPortals.length > 0 ? (
            filteredPortals.map(renderPortalCard)
          ) : (
            <div className="no-portals-message">
              Você não tem permissão para acessar nenhum portal.
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortalSelector; 