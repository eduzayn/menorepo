import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import AtribuicaoAutomaticaConfig from './AtribuicaoAutomaticaConfig';
import WhatsAppIntegrationConfig from './WhatsAppIntegrationConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface TabItem {
  id: string;
  label: string;
  component: React.ReactNode;
}

export default function AutomacoesConfig() {
  const [activeTab, setActiveTab] = useState('atribuicao');

  const tabs: TabItem[] = [
    {
      id: 'atribuicao',
      label: 'Atribuição Automática',
      component: <AtribuicaoAutomaticaConfig />
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      component: <WhatsAppIntegrationConfig />
    },
    {
      id: 'respostas',
      label: 'Respostas Automáticas',
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Respostas Automáticas</CardTitle>
            <CardDescription>
              Configure mensagens automáticas para diferentes situações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center text-gray-500">
              Esta funcionalidade estará disponível em breve.
            </div>
          </CardContent>
        </Card>
      )
    },
    {
      id: 'agendamento',
      label: 'Agendamento',
      component: (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Agendamento de Mensagens</CardTitle>
            <CardDescription>
              Configure horários para envio automático de mensagens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center text-gray-500">
              Esta funcionalidade estará disponível em breve.
            </div>
          </CardContent>
        </Card>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Automações</h2>
        <p className="text-muted-foreground">
          Configure automações para melhorar a eficiência da comunicação com seus alunos.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="py-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 