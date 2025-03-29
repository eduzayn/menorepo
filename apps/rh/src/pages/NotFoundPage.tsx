import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon } from '@edunexia/ui-components';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <Icon name="alert-circle" size={64} className="text-red-500 mb-4" />
      
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
      
      <p className="text-gray-600 max-w-md mb-8">
        A página que você está procurando não existe ou foi movida.
        Verifique o endereço ou navegue para outra seção.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => navigate('/')}
          leftIcon="home"
        >
          Voltar ao Dashboard
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(-1)}
          leftIcon="arrow-left"
        >
          Voltar à página anterior
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage; 