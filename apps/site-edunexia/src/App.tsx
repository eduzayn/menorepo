import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { ApiProvider } from './contexts/ApiContext';
import { AuthProvider } from '@edunexia/auth';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes';

function App() {
  return (
    <ErrorBoundary>
      <ApiProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="edunexia-ui-theme">
            <Router>
              <ScrollToTop />
              <AppRoutes />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </ApiProvider>
    </ErrorBoundary>
  );
}

export default App; 