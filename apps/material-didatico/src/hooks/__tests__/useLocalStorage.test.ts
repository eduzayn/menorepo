import { renderHook, act } from '@edunexia/test-config';
import { useLocalStorage } from '../useLocalStorage';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Configura o mock do localStorage antes de cada teste
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Limpa o mock antes de cada teste
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('deve inicializar com o valor padrão quando não há nada no localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'valorInicial'));
    
    // Verifica se o valor inicial está correto
    expect(result.current[0]).toBe('valorInicial');
    
    // Verifica se tentou buscar do localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('deve recuperar um valor existente do localStorage', () => {
    // Configura um valor pré-existente no localStorage
    localStorageMock.setItem('testKey', JSON.stringify('valorExistente'));
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'valorInicial'));
    
    // Verifica se o valor foi recuperado corretamente
    expect(result.current[0]).toBe('valorExistente');
    
    // Verifica se tentou buscar do localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('deve atualizar o valor no estado e no localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'valorInicial'));
    
    // Atualiza o valor
    act(() => {
      result.current[1]('novoValor');
    });
    
    // Verifica se o valor no estado foi atualizado
    expect(result.current[0]).toBe('novoValor');
    
    // Verifica se o valor foi salvo no localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('novoValor'));
  });

  it('deve lidar com valores complexos (objetos)', () => {
    const valorInicial = { nome: 'Teste', idade: 30 };
    const { result } = renderHook(() => useLocalStorage('testKey', valorInicial));
    
    // Verifica o valor inicial
    expect(result.current[0]).toEqual(valorInicial);
    
    // Atualiza para um novo objeto
    const novoValor = { nome: 'Novo Teste', idade: 35 };
    act(() => {
      result.current[1](novoValor);
    });
    
    // Verifica se o valor no estado foi atualizado
    expect(result.current[0]).toEqual(novoValor);
    
    // Verifica se o valor foi salvo no localStorage corretamente
    expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(novoValor));
  });

  it('deve lidar com erros ao acessar o localStorage', () => {
    // Simula um erro ao acessar o localStorage
    const errorMock = new Error('Erro de acesso ao localStorage');
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw errorMock;
    });
    
    // Captura o erro de console para não poluir os resultados do teste
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'valorPadrao'));
    
    // Verifica se retornou o valor padrão em caso de erro
    expect(result.current[0]).toBe('valorPadrao');
    
    // Verifica se o erro foi logado
    expect(consoleSpy).toHaveBeenCalledWith(errorMock);
    
    // Limpa o spy
    consoleSpy.mockRestore();
  });

  it('deve lidar com erros ao salvar no localStorage', () => {
    // Simula um erro ao salvar no localStorage
    const errorMock = new Error('Erro ao salvar no localStorage');
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw errorMock;
    });
    
    // Captura o erro de console para não poluir os resultados do teste
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'valorInicial'));
    
    // Tenta atualizar o valor
    act(() => {
      result.current[1]('novoValor');
    });
    
    // Verifica se o erro foi logado
    expect(consoleSpy).toHaveBeenCalledWith(errorMock);
    
    // Limpa o spy
    consoleSpy.mockRestore();
  });
}); 