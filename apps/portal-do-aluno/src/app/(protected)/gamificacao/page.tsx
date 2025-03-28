'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@edunexia/ui-components/components/ui/card'
import { ProgressoGamificacao } from '@/components/ProgressoGamificacao'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function GamificacaoPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Gamificação</h1>

      <Card>
        <CardHeader>
          <CardTitle>Meu Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando progresso...</div>}>
            <ProgressoGamificacao alunoId={session.user.id} />
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como Ganhar Pontos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Completar Aulas</h3>
                <p className="text-sm text-gray-500">
                  Ganhe pontos assistindo aulas e completando exercícios
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Participar de Fóruns</h3>
                <p className="text-sm text-gray-500">
                  Interaja com outros alunos e professores nos fóruns de discussão
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Entregar Atividades</h3>
                <p className="text-sm text-gray-500">
                  Pontos extras por entregar atividades dentro do prazo
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Conquistas Diárias</h3>
                <p className="text-sm text-gray-500">
                  Complete desafios diários para ganhar pontos extras
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Participar de Eventos</h3>
                <p className="text-sm text-gray-500">
                  Eventos especiais com recompensas exclusivas
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Ajudar Outros Alunos</h3>
                <p className="text-sm text-gray-500">
                  Ganhe pontos ajudando seus colegas com dúvidas
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 