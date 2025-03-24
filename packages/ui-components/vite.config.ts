import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@edunexia/ui-components',
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        '@headlessui/react',
        '@heroicons/react'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'class-variance-authority': 'cva',
          'clsx': 'clsx',
          'tailwind-merge': 'twMerge',
          '@headlessui/react': 'HeadlessUI',
          '@heroicons/react': 'HeroIcons'
        },
      },
    },
  },
}); 