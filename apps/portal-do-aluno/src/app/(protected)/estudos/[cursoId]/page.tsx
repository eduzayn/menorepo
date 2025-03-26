'use client'

import { useParams } from 'next/navigation'

export default function CursoDetalhesPage() {
  const params = useParams()
  const cursoId = params.cursoId

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900">Detalhes do Curso</h2>
        <div className="mt-4">
          <p className="text-gray-600">
            Detalhes do curso {cursoId} serão exibidos aqui.
          </p>
        </div>
      </div>

      {/* Lista de Aulas */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Aulas</h3>
        <div className="mt-4">
          <p className="text-gray-600">
            Lista de aulas do curso será exibida aqui.
          </p>
        </div>
      </div>
    </div>
  )
} 