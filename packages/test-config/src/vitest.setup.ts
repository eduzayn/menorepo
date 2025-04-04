import '@testing-library/jest-dom';
import { expect, vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Estende os matchers do Vitest com os do jest-dom
expect.extend(matchers);

// Limpa automaticamente o DOM após cada teste
afterEach(() => {
  cleanup();
});

// Previne vazamento de memória do mock de timer
afterEach(() => {
  vi.restoreAllMocks();
  vi.resetAllMocks();
  
  // Restaura timers reais se algum mock de timer foi usado
  if (vi.isFakeTimers()) {
    vi.useRealTimers();
  }
});

// Configura o console.error para não exibir erros dos testes mas capturá-los
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('Warning: ReactDOM.render')) {
    return;
  }
  if (args[0]?.includes?.('Warning: An update to')) {
    return;
  }
  originalConsoleError(...args);
};

// Mock de APIs do navegador frequentemente usadas
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true
});

// Configuração global para o ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock para IntersectionObserver
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: []
}));

// Mock para matchMedia
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // Obsoleto, mas ainda usado em alguns códigos
  removeListener: vi.fn(), // Obsoleto
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock para document.createRange
document.createRange = () => {
  const range = new Range();
  range.getBoundingClientRect = vi.fn();
  
  // @ts-expect-error - Simplificação do mock para DOMRectList
  range.getClientRects = vi.fn(() => {
    return {
      item: () => null,
      length: 0,
      // Adicionando a implementação mínima necessária para DOMRectList
      [Symbol.iterator]: function* () { yield null; }
    };
  });
  
  return range;
}; 