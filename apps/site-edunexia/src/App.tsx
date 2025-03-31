import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { ApiProvider } from './contexts/ApiContext';
import AuthProvider from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import AppRoutes from './routes';

// Para facilitar a depuração
console.log('Inicializando App com AuthProvider');

function App() {
  return (
    <ApiProvider>
      <ThemeProvider defaultTheme="light" storageKey="edunexia-ui-theme">
        <Router>
          <AuthProvider>
            <ScrollToTop />
            <AppRoutes />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ApiProvider>
  );
}

export default App; 