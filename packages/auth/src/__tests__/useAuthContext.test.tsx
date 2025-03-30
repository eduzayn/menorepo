import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useAuthContext } from '../hooks/AuthContext';

describe('useAuthContext', () => {
  it('deve lançar erro quando usado fora de um AuthProvider', () => {
    // Espionar console.error para evitar poluição nos logs de teste
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Testar se o hook lança erro quando usado sem provider
    expect(() => {
      // renderHook pode mostrar warnings no console, mas o teste deve passar
      // se o hook lançar um erro como esperado
      const { result } = renderHook(() => useAuthContext());
      
      // Este código não deve ser executado se o hook lançar erro
      if (result.error) {
        throw result.error;
      }
    }).toThrow('useAuthContext deve ser usado dentro de um AuthProvider');
    
    // Restaurar o console
    consoleSpy.mockRestore();
  });
}); 