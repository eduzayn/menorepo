import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { ErrorBoundary } from '../components/ErrorBoundary';

export function DefaultLayout() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default DefaultLayout; 