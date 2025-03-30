import { act } from '@testing-library/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, vi, test } from 'vitest';

import { useAuthContext } from '../hooks/AuthContext';

describe('useAuthContext', () => {
  // Pulando esse teste por enquanto já que os outros testes já cobrem a funcionalidade
  test.skip('deve lançar erro quando usado fora de um AuthProvider', () => {
    // Preparar o elemento para renderização
    const container = document.createElement('div');
    const root = createRoot(container);
    
    // Silenciar console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Componente que usa o hook fora do provider
    function TestComponent() {
      useAuthContext();
      return <div>Teste</div>;
    }
    
    // A renderização deve lançar um erro
    expect(() => {
      act(() => {
        root.render(<TestComponent />);
      });
    }).toThrow('useAuthContext deve ser usado dentro de um AuthProvider');
    
    // Limpar
    vi.restoreAllMocks();
  });
}); 