import React from 'react';
import { PageHeader, Card } from '@edunexia/ui-components';

export default function ConfiguracoesPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <PageHeader
        title="Configurações"
        description="Esta é a página de configurações do módulo."
      />
      
      <div className="grid gap-6 mt-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Configurações Gerais</h2>
          <p>Esta é a página de configurações do módulo.</p>
        </Card>
      </div>
    </div>
  );
} 