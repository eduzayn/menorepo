import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-5xl font-bold text-red-500 mb-4">401</div>
      <h1 className="text-2xl font-bold mb-4">Acesso Não Autorizado</h1>
      <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta página.</p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Voltar para o Início
      </button>
    </div>
  );
};

export default UnauthorizedPage; 