'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@edunexia/ui-components'
import PerfilConfig from '../components/configuracoes/PerfilConfig'
import NotificacoesConfig from '../components/configuracoes/NotificacoesConfig'
import ConfiguracoesGerais from '../components/configuracoes/ConfiguracoesGerais'
import { IAConfig } from '../components/configuracoes/IAConfig'
import AutomacoesConfig from '../components/configuracoes/AutomacoesConfig'
import { UserIcon, BellIcon, Cog6ToothIcon, SparklesIcon, BoltIcon } from '@heroicons/react/24/outline'
import { IAProvider } from '../contexts/IAContext'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ProfileConfig } from '@/components/configuracoes/ProfileConfig'
import { AssistenteIAConfig } from '@/components/configuracoes/AssistenteIAConfig'
import { GeralConfig } from '@/components/configuracoes/GeralConfig'
import { CanaisConfig } from '@/components/configuracoes/CanaisConfig'
import { Configuracoes } from '../components/configuracoes/Configuracoes'

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
    id: 'ia',
    label: 'Assistente IA',
    icon: SparklesIcon,
    component: IAConfig,
  },
  {
    id: 'automacoes',
    label: 'Automações',
    icon: BoltIcon,
    component: AutomacoesConfig,
  },
  {
    id: 'geral',
    label: 'Geral',
    icon: Cog6ToothIcon,
    component: ConfiguracoesGerais,
  },
]

export default function ConfiguracoesPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('perfil')

  // Definir o tab ativo com base no parâmetro da URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Atualizar a URL quando o tab mudar
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    navigate(`/configuracoes?tab=${value}`)
  }

  return (
    <IAProvider>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações do sistema
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="canais">Canais</TabsTrigger>
            <TabsTrigger value="ia">Assistente IA</TabsTrigger>
            <TabsTrigger value="automacoes">Automações</TabsTrigger>
            <TabsTrigger value="geral">Geral</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <ProfileConfig />
          </TabsContent>
          
          <TabsContent value="notificacoes">
            <NotificacoesConfig />
          </TabsContent>
          
          <TabsContent value="canais">
            <CanaisConfig />
          </TabsContent>
          
          <TabsContent value="ia">
            <AssistenteIAConfig />
          </TabsContent>
          
          <TabsContent value="automacoes">
            <AutomacoesConfig />
          </TabsContent>
          
          <TabsContent value="geral">
            <GeralConfig />
          </TabsContent>
        </Tabs>
      </div>
    </IAProvider>
  )
} 