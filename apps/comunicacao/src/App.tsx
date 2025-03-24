import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Pages
import ConversasPage from './pages/ConversasPage';
import LeadsPage from './pages/LeadsPage';
import CampanhasPage from './pages/CampanhasPage';
import RespostasRapidasPage from './pages/RespostasRapidasPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/conversas" replace />} />
          <Route path="/conversas" element={<ConversasPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/campanhas" element={<CampanhasPage />} />
          <Route path="/respostas-rapidas" element={<RespostasRapidasPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App; 