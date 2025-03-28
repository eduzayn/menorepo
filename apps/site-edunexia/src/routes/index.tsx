import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="sobre" element={<AboutPage />} />
        <Route path="contato" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes; 