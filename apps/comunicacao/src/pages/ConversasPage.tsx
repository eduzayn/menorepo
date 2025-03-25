import { ListaConversas } from '@/components/ListaConversas'
import { DetalhesConversa } from '@/components/DetalhesConversa'
import { EnvioMensagem } from '@/components/EnvioMensagem'
import { RespostasRapidas } from '@/components/RespostasRapidas'
import { useComunicacao } from '@/contexts/ComunicacaoContext'

export function ConversasPage() {
  const { conversaAtual, enviarMensagem } = useComunicacao()

  const handleRespostaRapida = (conteudo: string) => {
    if (conversaAtual) {
      enviarMensagem(conteudo, 'TEXTO')
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="w-1/3 border-r">
        <ListaConversas />
      </div>
      
      <div className="flex-1 flex flex-col">
        <DetalhesConversa />
        {conversaAtual && (
          <div>
            <div className="px-4 py-2">
              <RespostasRapidas onSelecionar={handleRespostaRapida} />
            </div>
            <EnvioMensagem />
          </div>
        )}
      </div>
    </div>
  )
} 