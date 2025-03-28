'use client'

import { useAuth } from '@edunexia/auth'

export default function CredenciaisPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Carteirinha Digital */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900">Carteirinha Digital</h2>
        <div className="mt-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-900">{user?.email}</h3>
                <p className="text-sm text-gray-500">Matrícula: 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico Escolar */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900">Histórico Escolar</h2>
        <div className="mt-4">
          <p className="text-gray-600">
            Seu histórico escolar será exibido aqui.
          </p>
        </div>
      </div>
    </div>
  )
} 