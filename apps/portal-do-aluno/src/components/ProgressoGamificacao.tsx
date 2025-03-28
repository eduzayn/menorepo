'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Badge
} from '@edunexia/ui-components'
import { obterProgressoAluno, verificarConquistas } from '@/services/gamificacao'
import type { ProgressoAluno, Conquista } from '@/types/gamificacao'

interface ProgressoGamificacaoProps {
  alunoId: string
}

export function ProgressoGamificacao({ alunoId }: ProgressoGamificacaoProps) {
  const [progresso, setProgresso] = useState<ProgressoAluno | null>(null)
  const [conquistas, setConquistas] = useState<Conquista[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function carregarProgresso() {
      try {
        const [progressoData, conquistasData] = await Promise.all([
          obterProgressoAluno(alunoId),
          verificarConquistas(alunoId)
        ])
        setProgresso(progressoData)
        setConquistas(conquistasData)
      } catch (error) {
        console.error('Erro ao carregar progresso:', error)
      } finally {
        setIsLoading(false)
      }
    }

    carregarProgresso()
  }, [alunoId])

  if (isLoading) {
    return <div>Carregando progresso...</div>
  }

  if (!progresso) {
    return <div>Nenhum progresso encontrado</div>
  }

  const pontosParaProximoNivel = 1000 // Exemplo: 1000 pontos por nível
  const nivelAtual = Math.floor(progresso.pontos / pontosParaProximoNivel) + 1
  const progressoNivel = (progresso.pontos % pontosParaProximoNivel) / pontosParaProximoNivel * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nível {nivelAtual}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progresso.pontos} pontos</span>
              <span>{pontosParaProximoNivel - (progresso.pontos % pontosParaProximoNivel)} para o próximo nível</span>
            </div>
            <Progress value={progressoNivel} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conquistas.map((conquista) => (
              <div key={conquista.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="text-2xl">{conquista.icone}</div>
                <div>
                  <h3 className="font-semibold">{conquista.nome}</h3>
                  <p className="text-sm text-gray-500">{conquista.descricao}</p>
                  <Badge className="mt-1">{conquista.pontos} pontos</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Atividades Completas</h3>
              <p className="text-2xl font-bold">{progresso.atividadesCompletas}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tempo de Estudo</h3>
              <p className="text-2xl font-bold">{Math.floor(progresso.tempoEstudo / 60)}h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 