'use client'

import { useAuth } from '@edunexia/auth'

export default function PerfilPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900">Meu Perfil</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>
          {/* Outros campos do perfil serão adicionados aqui */}
        </div>
      </div>
    </div>
  )
} 