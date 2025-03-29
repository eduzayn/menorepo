import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Definição de aliases para caminhos
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  
  // Configurações do servidor de desenvolvimento
  server: {
    port: 3005, // Porta para o módulo de contabilidade
    open: false, // Não abrir automaticamente o navegador
    cors: true, // Habilitar CORS
  },
  
  // Configurações de build
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Otimizações para produção
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          'edunexia-core': ['@edunexia/core', '@edunexia/utils', '@edunexia/ui-components'],
        },
      },
    },
  },
}); 