import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h3 className="text-lg font-medium text-foreground">Carregando...</h3>
        <p className="text-sm text-muted-foreground">Aguarde enquanto preparamos tudo para você</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 