import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@edunexia/auth';

// Página principal do módulo de comunicação
const ComunicacaoHome = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold">Módulo de Comunicação</h1>
    <p className="mt-2">Esta é a página principal do módulo de comunicação.</p>
  </div>
);

// Componente de layout principal
const AppRoutes = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Exibe um indicador de carregamento enquanto verifica a autenticação
  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          {/* Rotas autenticadas */}
          <Route path="/" element={<ComunicacaoHome />} />
          <Route path="/mensagens" element={<div>Mensagens</div>} />
          <Route path="/conversas" element={<div>Conversas</div>} />
          <Route path="/configuracoes" element={<div>Configurações</div>} />
          
          {/* Rota para qualquer caminho não encontrado */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        // Redireciona para a página de login se não estiver autenticado
        <Route path="*" element={<div>Por favor, faça login para acessar o módulo de comunicação.</div>} />
      )}
    </Routes>
  );
};

export default AppRoutes; 