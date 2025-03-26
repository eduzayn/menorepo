'use client'

export default function SolicitarCertificadoPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900">Solicitar Certificado</h2>
        <div className="mt-4">
          <p className="text-gray-600">
            Formulário de solicitação de certificado será exibido aqui.
          </p>
        </div>
      </div>

      {/* Requisitos para Certificação */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Requisitos para Certificação</h3>
        <div className="mt-4 space-y-2">
          <p className="text-gray-600">• Conclusão de todas as atividades</p>
          <p className="text-gray-600">• Média mínima 70%</p>
          <p className="text-gray-600">• Quitado integralmente</p>
          <p className="text-gray-600">• Documentação deferida</p>
          <p className="text-gray-600">• Tempo mínimo de curso atingido</p>
        </div>
      </div>
    </div>
  )
} 