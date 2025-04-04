import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@pages': resolve(__dirname, './src/pages'),
      '@services': resolve(__dirname, './src/services'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@types': resolve(__dirname, './src/types'),
      '@styles': resolve(__dirname, './src/styles'),
      '@schemas': resolve(__dirname, './src/schemas'),
      '@lib': resolve(__dirname, './src/lib'),
    },
  },
  server: {
    port: 3002, // Porta dedicada para o módulo de matrículas
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: [
        '@edunexia/ui-components',
        '@edunexia/ui-components/components/ui',
        'react',
        'react-dom',
        'react-router-dom'
      ]
    },
    // Ignorar problemas de resolução de tsconfig externos
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Opções para o esbuild ignorar tsconfig problematicos
    minify: 'esbuild',
    target: 'es2015',
  },
  optimizeDeps: {
    esbuildOptions: {
      tsconfig: resolve(__dirname, 'tsconfig.json'),
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          jsx: 'react-jsx',
        }
      }
    }
  }
});
