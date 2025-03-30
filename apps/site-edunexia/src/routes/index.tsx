import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import BlogPage from '../pages/BlogPage';
import BlogPostPage from '../pages/BlogPostPage';
import ContactPage from '../pages/ContactPage';
import { DynamicPage } from '../pages/DynamicPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/contato" element={<ContactPage />} />
      <Route path="/planos" element={<DynamicPage />} />
      <Route path="/pagina/:slug" element={<DynamicPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
} 