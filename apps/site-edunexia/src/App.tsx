import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import AppRoutes from './routes';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="edunexia-ui-theme">
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App; 