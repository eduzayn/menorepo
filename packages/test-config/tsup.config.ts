import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  skipNodeModulesBundle: true,
  ignoreWatch: ['**/.turbo', '**/dist', '**/node_modules', '**/.git'],
  onSuccess: 'echo Build completed successfully!',
  external: [
    'react',
    'react-dom',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    'vitest',
    'jest',
    'ts-jest',
    '@edunexia/core',
    '@edunexia/api-client',
    '@edunexia/auth',
    '@babel/preset-typescript',
    'lightningcss',
    /node_modules/
  ],
  noExternal: [],
  treeshake: true,
}); 