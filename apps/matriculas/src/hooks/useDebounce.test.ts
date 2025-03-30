import { renderHook, act } from '@edunexia/test-config';
import { useDebounce } from './useDebounce';
import { vi } from 'vitest';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve retornar o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('valor inicial', 500));
    
    expect(result.current).toBe('valor inicial');
  });

  it('deve manter o valor antigo até que o delay seja atingido', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'valor inicial', delay: 500 } }
    );
    
    // Atualiza o valor
    rerender({ value: 'novo valor', delay: 500 });
    
    // Valor ainda não deve ter mudado
    expect(result.current).toBe('valor inicial');
    
    // Avança o tempo parcialmente
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Valor ainda não deve ter mudado
    expect(result.current).toBe('valor inicial');
  });

  it('deve atualizar o valor após o delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'valor inicial', delay: 500 } }
    );
    
    // Atualiza o valor
    rerender({ value: 'novo valor', delay: 500 });
    
    // Avança o tempo para além do delay
    act(() => {
      vi.advanceTimersByTime(600);
    });
    
    // Valor deve ter sido atualizado
    expect(result.current).toBe('novo valor');
  });

  it('deve cancelar o timer anterior quando o valor mudar rapidamente', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'valor inicial', delay: 500 } }
    );
    
    // Primeira atualização
    rerender({ value: 'valor intermediário', delay: 500 });
    
    // Avança um pouco o tempo
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    // Segunda atualização antes do primeiro delay completar
    rerender({ value: 'valor final', delay: 500 });
    
    // Avança mais um pouco (ainda não completou o delay total)
    act(() => {
      vi.advanceTimersByTime(400);
    });
    
    // Valor ainda deve ser o inicial
    expect(result.current).toBe('valor inicial');
    
    // Completa o delay para o último valor
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    // Agora deve mostrar o valor final
    expect(result.current).toBe('valor final');
  });

  it('deve respeitar mudanças no tempo de delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'valor inicial', delay: 1000 } }
    );
    
    // Atualiza o valor e reduz o delay
    rerender({ value: 'novo valor', delay: 300 });
    
    // Avança o tempo para o novo delay
    act(() => {
      vi.advanceTimersByTime(400);
    });
    
    // Valor deve ter atualizado com o novo delay
    expect(result.current).toBe('novo valor');
  });
}); 