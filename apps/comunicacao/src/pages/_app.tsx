import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { ComunicacaoProvider } from '@/contexts/ComunicacaoContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePresenca } from '@/hooks/usePresenca';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function AppContent({ Component, pageProps }: AppProps) {
  usePresenca();

  return <Component {...pageProps} />;
}

export default function App(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ComunicacaoProvider>
          <AppContent {...props} />
          <Toaster richColors position="top-right" />
        </ComunicacaoProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
} 