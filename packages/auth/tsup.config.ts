import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  tsconfig: 'tsconfig.build.json',
  external: [
    'react',
    'react-dom',
    'react-router-dom',
    '@supabase/supabase-js',
    '@tanstack/react-query',
    '@edunexia/api-client',
    '@edunexia/database-schema'
  ]
}); 