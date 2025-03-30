import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout padrão da aplicação com Header e Footer
 * Pode ser usado de duas formas:
 * 1. Com children: <Layout><SeuComponente /></Layout>
 * 2. Como wrapper de rotas com Outlet: <Route element={<Layout />}>...</Route>
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
} 