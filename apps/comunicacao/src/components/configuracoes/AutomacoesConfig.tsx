import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import AtribuicaoAutomaticaConfig from './AtribuicaoAutomaticaConfig';
import WhatsAppIntegrationConfig from './WhatsAppIntegrationConfig';
import RespostasAutomaticasConfig from './RespostasAutomaticasConfig';
import AgendamentoMensagensConfig from './AgendamentoMensagensConfig';
import EventosGatilhosConfig from './EventosGatilhosConfig';
import ListasDistribuicaoConfig from '../campanhas/ListasDistribuicaoConfig';
import GerenciadorCampanhasConfig from '../campanhas/GerenciadorCampanhasConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useLocation, useNavigate } from 'react-router-dom';

interface TabItem {
  id: string;
  label: string;
  component: React.ReactNode;
}

export default function AutomacoesConfig() {
  const [activeTab, setActiveTab] = useState('atribuicao');
  const location = useLocation();
  const navigate = useNavigate();

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
      component: <RespostasAutomaticasConfig />
    },
    {
      id: 'agendamento',
      label: 'Agendamento',
      component: <AgendamentoMensagensConfig />
    },
    {
      id: 'eventos',
      label: 'Eventos e Gatilhos',
      component: <EventosGatilhosConfig />
    },
    {
      id: 'listas',
      label: 'Listas Distribuição',
      component: <ListasDistribuicaoConfig />
    },
    {
      id: 'campanhas',
      label: 'Gerenciador Campanhas',
      component: <GerenciadorCampanhasConfig />
    }
  ];

  // Detectar subtab da URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const subtabParam = searchParams.get('subtab');
    
    if (subtabParam && tabs.some(tab => tab.id === subtabParam)) {
      setActiveTab(subtabParam);
    }
  }, [location.search]);
  
  // Atualizar URL quando mudar de tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Manter o parâmetro tab=automacoes e atualizar subtab
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', 'automacoes');
    searchParams.set('subtab', value);
    
    navigate(`/configuracoes?${searchParams.toString()}`, { replace: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Automações</h2>
        <p className="text-muted-foreground">
          Configure automações para melhorar a eficiência da comunicação com seus alunos.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7 h-auto p-1">
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