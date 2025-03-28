import { useState, KeyboardEvent } from 'react'
import { Button, Textarea } from '@repo/ui-components'
import { useComunicacao } from '@/contexts/ComunicacaoContext'
import type { Enums } from '@/types/database'

type TipoMensagem = Enums<'comunicacao_tipo_mensagem'>

export function EnvioMensagem() {
  const { conversaAtual, enviarMensagem } = useComunicacao()
  const [mensagem, setMensagem] = useState('')

  const handleEnviar = async () => {
    if (!mensagem.trim()) return

    await enviarMensagem(mensagem.trim(), 'TEXTO')
    setMensagem('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  if (!conversaAtual) return null

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="flex-1 resize-none"
          rows={1}
        />
        <Button
          onClick={handleEnviar}
          disabled={!mensagem.trim()}
          className="self-end"
        >
          Enviar
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Pressione Enter para enviar ou Shift + Enter para nova linha
      </p>
    </div>
  )
} 