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

// Re-exporta as funções e utilitários do testing-library para uso nos testes
export * from '@testing-library/react';
export * from '@testing-library/user-event';

// Re-exporta o vi para facilitar a criação de mocks
export { vi }; 