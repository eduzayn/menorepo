import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Setup básico para os testes

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock para localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock global fetch
global.fetch = vi.fn();

// Console warning override para reduzir ruído em testes
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  // Filtrar warnings irrelevantes para testes
  const isReactWarning = args[0] && typeof args[0] === 'string' && args[0].includes('React');
  if (!isReactWarning) {
    originalConsoleWarn(...args);
  }
}; 