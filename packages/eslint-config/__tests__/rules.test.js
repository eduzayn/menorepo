import { describe, it, expect } from 'vitest';
import baseConfig from '../index';
import reactConfig from '../react';
import nextConfig from '../next';
import viteConfig from '../vite';

describe('ESLint Configs', () => {
  describe('Base Config', () => {
    it('deve exportar um objeto de configuração válido', () => {
      expect(baseConfig).toBeDefined();
      expect(baseConfig).toBeTypeOf('object');
      expect(baseConfig.rules).toBeDefined();
      expect(baseConfig.extends).toBeInstanceOf(Array);
    });

    it('deve ter regras importantes definidas', () => {
      expect(baseConfig.rules).toHaveProperty('no-console');
      expect(baseConfig.rules).toHaveProperty('import/order');
      expect(baseConfig.rules).toHaveProperty('@typescript-eslint/no-unused-vars');
    });
  });

  describe('React Config', () => {
    it('deve exportar um objeto de configuração válido', () => {
      expect(reactConfig).toBeDefined();
      expect(reactConfig).toBeTypeOf('object');
      expect(reactConfig.extends).toBeInstanceOf(Array);
    });

    it('deve estender a configuração base', () => {
      const extendsList = reactConfig.extends || [];
      expect(extendsList.some(ext => ext.includes('plugin:react/') || ext.includes('plugin:react-hooks/'))).toBe(true);
    });
  });

  describe('Next.js Config', () => {
    it('deve exportar um objeto de configuração válido', () => {
      expect(nextConfig).toBeDefined();
      expect(nextConfig).toBeTypeOf('object');
    });
  });

  describe('Vite Config', () => {
    it('deve exportar um objeto de configuração válido', () => {
      expect(viteConfig).toBeDefined();
      expect(viteConfig).toBeTypeOf('object');
    });
  });
}); 