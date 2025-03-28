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

interface ConfiguracoesGerais {
  tema: 'light' | 'dark' | 'system'
  autoArquivar: boolean
  diasParaArquivar: number
  confirmacaoAntesEnvio: boolean
  exibirPreview: boolean
  notificarLeitura: boolean
  idioma: string
}

const idiomas = [
  { id: 'pt-BR', label: 'Português (Brasil)' },
  { id: 'en-US', label: 'English (US)' },
  { id: 'es', label: 'Español' },
]

export default function ConfiguracoesGerais() {
  const [config, setConfig] = useState<ConfiguracoesGerais>({
    tema: 'system',
    autoArquivar: true,
    diasParaArquivar: 30,
    confirmacaoAntesEnvio: true,
    exibirPreview: true,
    notificarLeitura: false,
    idioma: 'pt-BR',
  })

  const handleBooleanChange = (
    campo: keyof Pick<
      ConfiguracoesGerais,
      | 'autoArquivar'
      | 'confirmacaoAntesEnvio'
      | 'exibirPreview'
      | 'notificarLeitura'
    >,
    valor: boolean
  ) => {
    setConfig((prev) => ({ ...prev, [campo]: valor }))
    toast.success('Configuração atualizada com sucesso')
  }

  const handleTemaChange = (valor: 'light' | 'dark' | 'system') => {
    setConfig((prev) => ({ ...prev, tema: valor }))
    toast.success('Tema atualizado com sucesso')
  }

  const handleDiasChange = (valor: string) => {
    const dias = parseInt(valor)
    if (!isNaN(dias) && dias > 0) {
      setConfig((prev) => ({ ...prev, diasParaArquivar: dias }))
      toast.success('Dias para arquivar atualizados com sucesso')
    }
  }

  const handleIdiomaChange = (valor: string) => {
    setConfig((prev) => ({ ...prev, idioma: valor }))
    toast.success('Idioma atualizado com sucesso')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Aparência</h3>
        <p className="text-sm text-muted-foreground">
          Personalize a aparência do sistema
        </p>
        <div className="mt-4">
          <Label htmlFor="tema">Tema</Label>
          <Select
            value={config.tema}
            onValueChange={(valor: 'light' | 'dark' | 'system') =>
              handleTemaChange(valor)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Arquivamento Automático</h3>
        <p className="text-sm text-muted-foreground">
          Configure o arquivamento automático de conversas
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-arquivar"
              checked={config.autoArquivar}
              onCheckedChange={(checked) =>
                handleBooleanChange('autoArquivar', checked)
              }
            />
            <Label htmlFor="auto-arquivar">Arquivar automaticamente</Label>
          </div>

          {config.autoArquivar && (
            <div>
              <Label htmlFor="dias-arquivar">Dias para arquivar</Label>
              <input
                type="number"
                id="dias-arquivar"
                min="1"
                value={config.diasParaArquivar}
                onChange={(e) => handleDiasChange(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Mensagens</h3>
        <p className="text-sm text-muted-foreground">
          Configure as opções de mensagens
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="confirmacao-envio"
              checked={config.confirmacaoAntesEnvio}
              onCheckedChange={(checked) =>
                handleBooleanChange('confirmacaoAntesEnvio', checked)
              }
            />
            <Label htmlFor="confirmacao-envio">
              Confirmar antes de enviar mensagens
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="exibir-preview"
              checked={config.exibirPreview}
              onCheckedChange={(checked) =>
                handleBooleanChange('exibirPreview', checked)
              }
            />
            <Label htmlFor="exibir-preview">
              Exibir preview de links e arquivos
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="notificar-leitura"
              checked={config.notificarLeitura}
              onCheckedChange={(checked) =>
                handleBooleanChange('notificarLeitura', checked)
              }
            />
            <Label htmlFor="notificar-leitura">
              Notificar quando a mensagem for lida
            </Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Idioma</h3>
        <p className="text-sm text-muted-foreground">
          Escolha o idioma do sistema
        </p>
        <div className="mt-4">
          <Select value={config.idioma} onValueChange={handleIdiomaChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o idioma" />
            </SelectTrigger>
            <SelectContent>
              {idiomas.map((idioma) => (
                <SelectItem key={idioma.id} value={idioma.id}>
                  {idioma.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
} 