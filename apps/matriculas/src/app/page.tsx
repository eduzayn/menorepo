import { Suspense } from 'react'
import { MatriculaForm } from '@/components/MatriculaForm'

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Módulo de Matrículas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Nova Matrícula</h2>
          <Suspense fallback={<div>Carregando...</div>}>
            <MatriculaForm />
          </Suspense>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Matrículas Recentes</h2>
          <Suspense fallback={<div>Carregando...</div>}>
            {/* TODO: Implementar lista de matrículas recentes */}
            <div className="text-gray-500">Em breve...</div>
          </Suspense>
        </div>
      </div>
    </main>
  )
} 