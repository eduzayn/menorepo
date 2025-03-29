import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { ApiProvider } from './lib/apiClient';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes';

function App() {
  return (
    <ErrorBoundary>
      <ApiProvider>
        <ThemeProvider defaultTheme="light" storageKey="edunexia-ui-theme">
          <Router>
            <ScrollToTop />
            <AppRoutes />
          </Router>
        </ThemeProvider>
      </ApiProvider>
    </ErrorBoundary>
  );
}

export default App; 