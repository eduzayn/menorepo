import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@edunexia/auth';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider moduleName="PORTAL_PARCEIRO">
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 