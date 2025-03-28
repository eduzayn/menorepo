import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Páginas
import DashboardPage from './pages/dashboard';
import ReceberPage from './pages/receber';
import PagarPage from './pages/pagar';
import RelatoriosPage from './pages/relatorios';
import TaxasPage from './pages/taxas';
import CobrancasPage from './pages/cobrancas';
import NovaCobrancaPage from './pages/cobrancas/nova';

// Páginas placeholders para rotas futuras
const ComissoesPage = () => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">Comissões e Repasses</h1>
    <p className="text-gray-600">Esta funcionalidade está em desenvolvimento.</p>
  </div>
);

const ConfiguracoesPage = () => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">Configurações do Sistema</h1>
    <p className="text-gray-600">Esta funcionalidade está em desenvolvimento.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="receber" element={<ReceberPage />} />
          <Route path="pagar" element={<PagarPage />} />
          <Route path="relatorios" element={<RelatoriosPage />} />
          <Route path="taxas" element={<TaxasPage />} />
          <Route path="cobrancas" element={<CobrancasPage />} />
          <Route path="cobrancas/nova" element={<NovaCobrancaPage />} />
          <Route path="comissoes" element={<ComissoesPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
} 