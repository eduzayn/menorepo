import React from 'react';
import { PageHeader } from '@edunexia/ui-components';
import { Card } from '@edunexia/ui-components';
import { NotificationExample } from '../components/notificacoes';

export const NotificacaoExemploPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <PageHeader
        title="Exemplos de Notificações"
        subtitle="Demonstração do componente NotificationCard da biblioteca centralizada"
        backUrl="/comunicacao/notificacoes"
      />

      <div className="grid gap-6 mt-6">
        <Card>
          <NotificationExample />
        </Card>
      </div>
    </div>
  );
}; 