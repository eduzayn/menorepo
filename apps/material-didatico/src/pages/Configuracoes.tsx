import { Button } from '@edunexia/ui-components'
import { Settings, User, Bell, Lock, Globe } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@edunexia/ui-components'

const configuracoes = [
  {
    id: 'perfil',
    titulo: 'Perfil',
    descricao: 'Gerencie suas informações pessoais e preferências',
    icone: User,
  },
  {
    id: 'notificacoes',
    titulo: 'Notificações',
    descricao: 'Configure suas preferências de notificação',
    icone: Bell,
  },
  {
    id: 'seguranca',
    titulo: 'Segurança',
    descricao: 'Gerencie sua senha e autenticação',
    icone: Lock,
  },
  {
    id: 'idioma',
    titulo: 'Idioma',
    descricao: 'Escolha o idioma da interface',
    icone: Globe,
  },
]

export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {configuracoes.map((config) => (
          <Card key={config.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <config.icone className="h-5 w-5 text-muted-foreground" />
                <CardTitle>{config.titulo}</CardTitle>
              </div>
              <CardDescription>{config.descricao}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Configurar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Preferências do Editor</CardTitle>
          </div>
          <CardDescription>
            Configure as preferências do editor de conteúdo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Auto-save</h4>
              <p className="text-sm text-muted-foreground">
                Salvar automaticamente as alterações
              </p>
            </div>
            <Button variant="outline">Configurar</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Tema do Editor</h4>
              <p className="text-sm text-muted-foreground">
                Escolha entre tema claro ou escuro
              </p>
            </div>
            <Button variant="outline">Configurar</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Atalhos de Teclado</h4>
              <p className="text-sm text-muted-foreground">
                Personalize os atalhos do editor
              </p>
            </div>
            <Button variant="outline">Configurar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 