'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const tiposNotificacao = [
  { id: 'nova_mensagem', label: 'Nova Mensagem' },
  { id: 'nova_conversa', label: 'Nova Conversa' },
  { id: 'mencao', label: 'Menção' },
  { id: 'atualizacao_status', label: 'Atualização de Status' },
]

const canaisNotificacao = [
  { id: 'email', label: 'Email' },
  { id: 'push', label: 'Push' },
  { id: 'sms', label: 'SMS' },
]

const diasSemana = [
  { id: '0', label: 'Domingo' },
  { id: '1', label: 'Segunda' },
  { id: '2', label: 'Terça' },
  { id: '3', label: 'Quarta' },
  { id: '4', label: 'Quinta' },
  { id: '5', label: 'Sexta' },
  { id: '6', label: 'Sábado' },
]

interface NotificacoesConfig {
  tipos: Record<string, boolean>
  canais: Record<string, boolean>
  horarioInicio: string
  horarioFim: string
  diasAtivos: string[]
}

export default function NotificacoesConfig() {
  const [config, setConfig] = useState<NotificacoesConfig>({
    tipos: {
      nova_mensagem: true,
      nova_conversa: true,
      mencao: true,
      atualizacao_status: false,
    },
    canais: {
      email: true,
      push: true,
      sms: false,
    },
    horarioInicio: '09:00',
    horarioFim: '18:00',
    diasAtivos: ['1', '2', '3', '4', '5'],
  })

  const handleTipoChange = (tipo: string, checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      tipos: {
        ...prev.tipos,
        [tipo]: checked,
      },
    }))
    toast.success('Configuração atualizada com sucesso')
  }

  const handleCanalChange = (canal: string, checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      canais: {
        ...prev.canais,
        [canal]: checked,
      },
    }))
    toast.success('Configuração atualizada com sucesso')
  }

  const handleHorarioChange = (tipo: 'inicio' | 'fim', valor: string) => {
    setConfig((prev) => ({
      ...prev,
      [tipo === 'inicio' ? 'horarioInicio' : 'horarioFim']: valor,
    }))
    toast.success('Configuração atualizada com sucesso')
  }

  const handleDiaChange = (dia: string) => {
    setConfig((prev) => {
      const diasAtivos = prev.diasAtivos.includes(dia)
        ? prev.diasAtivos.filter((d) => d !== dia)
        : [...prev.diasAtivos, dia]
      return {
        ...prev,
        diasAtivos,
      }
    })
    toast.success('Configuração atualizada com sucesso')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tipos de Notificação</h3>
        <p className="text-sm text-muted-foreground">
          Escolha quais tipos de notificação você deseja receber
        </p>
        <div className="mt-4 space-y-4">
          {tiposNotificacao.map((tipo) => (
            <div key={tipo.id} className="flex items-center space-x-2">
              <Switch
                id={`tipo-${tipo.id}`}
                checked={config.tipos[tipo.id]}
                onCheckedChange={(checked) => handleTipoChange(tipo.id, checked)}
              />
              <Label htmlFor={`tipo-${tipo.id}`}>{tipo.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Canais de Notificação</h3>
        <p className="text-sm text-muted-foreground">
          Escolha como você deseja receber as notificações
        </p>
        <div className="mt-4 space-y-4">
          {canaisNotificacao.map((canal) => (
            <div key={canal.id} className="flex items-center space-x-2">
              <Switch
                id={`canal-${canal.id}`}
                checked={config.canais[canal.id]}
                onCheckedChange={(checked) => handleCanalChange(canal.id, checked)}
              />
              <Label htmlFor={`canal-${canal.id}`}>{canal.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Horário de Notificações</h3>
        <p className="text-sm text-muted-foreground">
          Defina o período em que você deseja receber notificações
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="horario-inicio">Início</Label>
            <input
              type="time"
              id="horario-inicio"
              value={config.horarioInicio}
              onChange={(e) => handleHorarioChange('inicio', e.target.value)}
              className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2"
            />
          </div>
          <div>
            <Label htmlFor="horario-fim">Fim</Label>
            <input
              type="time"
              id="horario-fim"
              value={config.horarioFim}
              onChange={(e) => handleHorarioChange('fim', e.target.value)}
              className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Dias da Semana</h3>
        <p className="text-sm text-muted-foreground">
          Selecione os dias em que você deseja receber notificações
        </p>
        <div className="mt-4 space-y-4">
          {diasSemana.map((dia) => (
            <div key={dia.id} className="flex items-center space-x-2">
              <Switch
                id={`dia-${dia.id}`}
                checked={config.diasAtivos.includes(dia.id)}
                onCheckedChange={() => handleDiaChange(dia.id)}
              />
              <Label htmlFor={`dia-${dia.id}`}>{dia.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 