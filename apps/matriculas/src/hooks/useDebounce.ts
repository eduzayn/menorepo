import { useState, useEffect } from 'react';

/**
 * Hook para debounce de um valor
 * @param value Valor a ser debounceado
 * @param delay Tempo de delay em ms
 * @returns Valor debounceado
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura um timer que atualiza o valor debounceado após o delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar (ou o componente for desmontado)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 