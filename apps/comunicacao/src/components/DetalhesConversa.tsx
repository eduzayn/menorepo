import { useEffect, useRef } from 'react'
import { Spinner } from '@repo/ui-components'
import { useComunicacao } from '@/contexts/ComunicacaoContext'
import { useAuth } from '@repo/auth'
import { formatarData } from '@/utils/data'

export function DetalhesConversa() {
  const { conversaAtual, mensagens, loading } = useComunicacao()
  const { user } = useAuth()
  const mensagensRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight
    }
  }, [mensagens])

  if (!conversaAtual) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Selecione uma conversa para começar
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h2 className="font-medium text-lg">{conversaAtual.titulo}</h2>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <span className="capitalize">{conversaAtual.canal}</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{conversaAtual.status}</span>
        </div>
      </div>

      <div ref={mensagensRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map((mensagem) => {
          const isUsuario = mensagem.remetente_id === user?.id
          return (
            <div
              key={mensagem.id}
              className={`flex ${isUsuario ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isUsuario
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <div className="text-sm break-words">{mensagem.conteudo}</div>
                <div
                  className={`text-xs mt-1 ${
                    isUsuario ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatarData(mensagem.criado_at)}
                  {mensagem.lida && isUsuario && (
                    <span className="ml-2">✓</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 