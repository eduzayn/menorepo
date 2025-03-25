'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PerfilConfig from '@/components/configuracoes/PerfilConfig'
import NotificacoesConfig from '@/components/configuracoes/NotificacoesConfig'
import ConfiguracoesGerais from '@/components/configuracoes/ConfiguracoesGerais'
import { UserIcon, BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

const tabs = [
  {
    id: 'perfil',
    label: 'Perfil',
    icon: UserIcon,
    component: PerfilConfig,
  },
  {
    id: 'notificacoes',
    label: 'Notificações',
    icon: BellIcon,
    component: NotificacoesConfig,
  },
  {
    id: 'geral',
    label: 'Geral',
    icon: Cog6ToothIcon,
    component: ConfiguracoesGerais,
  },
]

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('perfil')

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações do sistema
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="mt-8 space-y-4 bg-card p-6 rounded-lg border"
          >
            <div className="flex items-center gap-2 mb-6">
              <tab.icon className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">{tab.label}</h2>
            </div>
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 