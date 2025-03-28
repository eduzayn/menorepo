import React from 'react';
import { NotificacoesConfig } from '../components';
import { useAuth } from '../hooks/useAuth';

export const NotificacoesPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div>
      <NotificacoesConfig usuarioId={user.id} />
    </div>
  );
}; 