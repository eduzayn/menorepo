'use client'

import { useAuth } from '@edunexia/auth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900">Bem-vindo!</h2>
        <p className="mt-2 text-gray-600">
          Olá, {user?.email}! Aqui você pode gerenciar suas informações e atividades acadêmicas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Meus Cursos</h3>
          <p className="mt-2 text-gray-600">
            Acesse seus cursos e materiais de estudo.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Notas e Frequência</h3>
          <p className="mt-2 text-gray-600">
            Consulte suas notas e frequência nas disciplinas.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
          <p className="mt-2 text-gray-600">
            Acesse seus documentos acadêmicos.
          </p>
        </div>
      </div>
    </div>
  )
} 