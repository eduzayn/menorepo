import { useState } from 'react'
import { Card, Input, Spinner } from '@repo/ui-components'
import { useComunicacao } from '@/contexts/ComunicacaoContext'
import { formatarData } from '@/utils/data'

export function ListaConversas() {
  const { conversas, conversaAtual, loading, selecionarConversa } = useComunicacao()
  const [termoBusca, setTermoBusca] = useState('')

  const conversasFiltradas = conversas.filter((conversa) =>
    conversa.titulo.toLowerCase().includes(termoBusca.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Input
          type="text"
          placeholder="Buscar conversa..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversasFiltradas.map((conversa) => (
          <Card
            key={conversa.id}
            onClick={() => selecionarConversa(conversa)}
            className={`cursor-pointer p-4 mb-2 hover:bg-gray-50 ${
              conversaAtual?.id === conversa.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{conversa.titulo}</h3>
                <p className="text-sm text-gray-500 mt-1">{conversa.ultima_mensagem}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">
                  {conversa.ultima_mensagem_at && formatarData(conversa.ultima_mensagem_at)}
                </span>
                {conversa.nao_lidas > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                    {conversa.nao_lidas}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <span className="capitalize">{conversa.canal}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{conversa.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 