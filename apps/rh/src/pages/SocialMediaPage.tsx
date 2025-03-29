import React from 'react';
import { PageHeader, Card, Alert, Button, Icon } from '@edunexia/ui-components';

const SocialMediaPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        title="Integração com Redes Sociais"
        subtitle="Gerencie a integração do RH com redes sociais"
      />

      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center py-10">
          <Icon name="share-2" size={64} className="text-blue-500 mb-6" />
          
          <h2 className="text-2xl font-bold mb-3">
            Módulo em Desenvolvimento
          </h2>
          
          <p className="text-gray-600 max-w-xl mb-8">
            A integração com redes sociais está sendo desenvolvida e estará disponível em breve.
            Este módulo permitirá publicar vagas automaticamente no LinkedIn, Facebook e outras
            plataformas, além de monitorar a presença online da empresa.
          </p>
          
          <Alert 
            type="info" 
            title="Em breve!"
            className="max-w-lg mb-8"
          >
            Estamos trabalhando para disponibilizar esta funcionalidade na próxima atualização.
            Fique atento às novas versões.
          </Alert>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline"
              leftIcon="calendar"
            >
              Ver Cronograma
            </Button>
            
            <Button 
              variant="ghost"
              leftIcon="message-square"
            >
              Enviar Sugestões
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SocialMediaPage; 