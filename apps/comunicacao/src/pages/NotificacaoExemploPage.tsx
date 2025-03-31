import React from 'react';
import { Badge } from '../mock-components';

const NotificacaoExemploPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Exemplo de Notificação</h1>
      
      <div className="bg-white shadow rounded-lg p-4 flex items-start space-x-4">
        <Badge variant="success">Nova</Badge>
        <div>
          <h2 className="text-lg font-medium">Lembrete de Contato</h2>
          <p className="text-gray-600 mt-1">
            Lembrete para entrar em contato com o lead João Silva sobre o curso de marketing digital.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificacaoExemploPage; 