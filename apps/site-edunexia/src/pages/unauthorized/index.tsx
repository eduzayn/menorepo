import React from 'react';
import { useNavigate } from 'react-router-dom';
import './unauthorized.css';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-content">
          <h1>Acesso Não Autorizado</h1>
          <p>
            Você não tem permissão para acessar esta área.
            Entre em contato com o administrador do sistema se acredita que isso é um erro.
          </p>
          <button 
            className="back-button"
            onClick={() => navigate('/portal-selector')}
          >
            Voltar ao Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 