import { describe, it, expect } from 'vitest';
import tailwindConfig from '../index';

describe('Tailwind Config', () => {
  it('deve exportar um objeto de configuração válido', () => {
    expect(tailwindConfig).toBeDefined();
    expect(tailwindConfig).toBeTypeOf('object');
  });

  it('deve conter as propriedades essenciais do Tailwind', () => {
    expect(tailwindConfig.theme).toBeDefined();
    expect(tailwindConfig.content).toBeDefined();
  });

  it('deve ter um tema configurado corretamente', () => {
    expect(tailwindConfig.theme).toBeTypeOf('object');
    expect(tailwindConfig.theme.extend).toBeTypeOf('object');
  });

  it('deve ter cores personalizadas definidas', () => {
    expect(tailwindConfig.theme.extend.colors).toBeDefined();
    expect(tailwindConfig.theme.extend.colors).toBeTypeOf('object');
  });
  
  it('deve ter uma paleta de cores primárias definida', () => {
    const colors = tailwindConfig.theme.extend.colors;
    expect(colors.primary).toBeDefined();
    
    // Verifica se a paleta primária tem variações
    if (typeof colors.primary === 'object') {
      // Se for objeto, deve ter tonalidades
      expect(Object.keys(colors.primary).length).toBeGreaterThan(0);
    } else {
      // Se for string direta, é um valor único
      expect(colors.primary).toBeTypeOf('string');
    }
  });

  it('deve ter plugins configurados', () => {
    expect(tailwindConfig.plugins).toBeDefined();
    expect(Array.isArray(tailwindConfig.plugins)).toBe(true);
  });
}); 