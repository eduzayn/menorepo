import { Routes, Route } from 'react-router-dom';
import { ConversasPage } from './pages/ConversasPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ConversasPage />} />
    </Routes>
  );
} 