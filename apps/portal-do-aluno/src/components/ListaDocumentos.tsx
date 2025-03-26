'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button
} from '@edunexia/ui-components'
import { listarDocumentos } from '@/services/documentos'
import type { Documento } from '@/types/documentos'

interface ListaDocumentosProps {
  alunoId: string
  onRefresh?: () => void
}

export function ListaDocumentos({ alunoId, onRefresh }: ListaDocumentosProps) {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    carregarDocumentos()
  }, [alunoId])

  async function carregarDocumentos() {
    try {
      setIsLoading(true)
      const data = await listarDocumentos(alunoId)
      setDocumentos(data)
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function getStatusColor(status: Documento['status']) {
    switch (status) {
      case 'APROVADO':
        return 'bg-green-500'
      case 'REJEITADO':
        return 'bg-red-500'
      case 'PENDENTE':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  function getStatusText(status: Documento['status']) {
    switch (status) {
      case 'APROVADO':
        return 'Aprovado'
      case 'REJEITADO':
        return 'Rejeitado'
      case 'PENDENTE':
        return 'Pendente'
      default:
        return 'Desconhecido'
    }
  }

  if (isLoading) {
    return <div>Carregando documentos...</div>
  }

  if (documentos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Nenhum documento encontrado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {documentos.map((documento) => (
        <Card key={documento.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{documento.nome}</CardTitle>
              <Badge className={getStatusColor(documento.status)}>
                {getStatusText(documento.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tipo: {documento.tipo}</span>
                <span>Enviado em: {new Date(documento.dataUpload).toLocaleDateString()}</span>
              </div>
              
              {documento.validacao && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Feedback da Validação:</h4>
                  <p className="text-sm text-gray-600">{documento.validacao.feedback}</p>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" asChild>
                  <a href={documento.url} target="_blank" rel="noopener noreferrer">
                    Visualizar
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 