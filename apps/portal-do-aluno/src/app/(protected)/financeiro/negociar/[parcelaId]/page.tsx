'use client'

import { useParams } from 'next/navigation'

export default function NegociarParcelaPage() {
  const params = useParams()
  const parcelaId = params.parcelaId

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900">Negociar Parcela</h2>
        <div className="mt-4">
          <p className="text-gray-600">
            Formulário de negociação para a parcela {parcelaId} será exibido aqui.
          </p>
        </div>
      </div>
    </div>
  )
} 