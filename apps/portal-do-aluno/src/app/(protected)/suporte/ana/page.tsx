'use client'

export default function ChatAnaPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900">Chat com a Professora Ana</h2>
        <div className="mt-4">
          <p className="text-gray-600">
            Interface do chat com a Prof. Ana (IA) será exibida aqui.
          </p>
        </div>
      </div>

      {/* Área do Chat */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="h-[500px] border rounded-lg p-4">
          <p className="text-gray-600 text-center">
            Área do chat será implementada aqui.
          </p>
        </div>
      </div>
    </div>
  )
} 