import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout padrão da aplicação com Header e Footer
 * Pode ser usado de duas formas:
 * 1. Com children: <Layout><SeuComponente /></Layout>
 * 2. Como wrapper de rotas com Outlet: <Route element={<Layout />}>...</Route>
 */
const Layout = ({ children }: LayoutProps) => {
  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Não foi possível carregar esta seção do site</h2>
        <p className="mb-6">Por favor, atualize a página ou tente novamente mais tarde</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Recarregar página
        </button>
      </div>
    }>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Layout; 