import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFullPortalUrl, getPortalByID } from '../../constants/portals';
import './redirect.css';

/**
 * Página de redirecionamento para o portal adequado após o login
 * Verifica permissões do usuário e redireciona para o portal correto
 */
const RedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, isLoading, hasAccess } = useAuth();
  const [countdown, setCountdown] = useState(3);
  const portalId = searchParams.get('portal') || '';
  
  useEffect(() => {
    // Se estiver carregando, não fazer nada ainda
    if (isLoading) return;
    
    // Se não tiver usuário autenticado, redirecionar para login
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Verificar se o portal foi especificado na URL
    if (portalId) {
      const portal = getPortalByID(portalId);
      
      // Verificar se o portal existe e o usuário tem acesso
      if (portal && hasAccess(portalId)) {
        // Iniciar contagem regressiva
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              // Redirecionar para o portal
              window.location.href = getFullPortalUrl(portalId);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      } else {
        // Se não tiver acesso ao portal especificado, mostrar seletor
        navigate('/portal-selector', { replace: true });
      }
    } else {
      // Se não tiver portal especificado, mostrar seletor
      navigate('/portal-selector', { replace: true });
    }
  }, [currentUser, isLoading, portalId, navigate, hasAccess]);
  
  // Se estiver carregando, mostrar tela de carregamento
  if (isLoading) {
    return (
      <div className="redirect-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Verificando suas credenciais...</p>
        </div>
      </div>
    );
  }
  
  // Se tudo estiver ok, mostrar tela de redirecionamento
  const portal = getPortalByID(portalId);
  
  return (
    <div className="redirect-page">
      <div className="redirect-container">
        <img 
          src="/logo-edunexia.svg" 
          alt="Edunéxia" 
          className="redirect-logo"
        />
        
        {portal ? (
          <>
            <h1>Redirecionando...</h1>
            <p className="redirect-message">
              Você será redirecionado para o {portal.name} em <span className="countdown">{countdown}</span> segundos.
            </p>
            <div className="portal-preview">
              <img src={portal.icon} alt="" className="portal-icon" />
              <span className="portal-name">{portal.name}</span>
            </div>
            <div className="redirect-actions">
              <button 
                onClick={() => window.location.href = getFullPortalUrl(portalId)}
                className="redirect-button"
              >
                Ir agora
              </button>
              <button 
                onClick={() => navigate('/portal-selector')}
                className="redirect-button outline"
              >
                Escolher outro portal
              </button>
            </div>
          </>
        ) : (
          <p className="redirect-error">Portal não encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default RedirectPage; 