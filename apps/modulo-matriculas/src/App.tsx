import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rotas serão adicionadas aqui */}
      </Route>
    </Routes>
  )
}

export default App 