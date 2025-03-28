import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Loader2 } from 'lucide-react'

// Layout
const Layout = lazy(() => import('./components/layout/Layout'))

// Pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Cursos = lazy(() => import('./pages/Cursos'))
const Disciplinas = lazy(() => import('./pages/Disciplinas'))
const Templates = lazy(() => import('./pages/Templates'))
const Editor = lazy(() => import('./pages/Editor'))
const Publicacoes = lazy(() => import('./pages/Publicacoes'))
const Historico = lazy(() => import('./pages/Historico'))
const Configuracoes = lazy(() => import('./pages/Configuracoes'))

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="cursos" element={<Cursos />} />
          <Route path="disciplinas/:cursoId" element={<Disciplinas />} />
          <Route path="templates" element={<Templates />} />
          <Route path="editor/:id" element={<Editor />} />
          <Route path="publicacoes" element={<Publicacoes />} />
          <Route path="historico" element={<Historico />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App 