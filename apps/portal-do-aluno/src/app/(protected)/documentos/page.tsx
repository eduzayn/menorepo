import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@edunexia/ui-components/components/ui/card'
import { UploadDocumento } from '@/components/UploadDocumento'
import { ListaDocumentos } from '@/components/ListaDocumentos'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DocumentosPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Meus Documentos</h1>

      <Card>
        <CardHeader>
          <CardTitle>Enviar Novo Documento</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando formulário...</div>}>
            <UploadDocumento alunoId={session.user.id} />
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos Enviados</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando documentos...</div>}>
            <ListaDocumentos alunoId={session.user.id} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
} 