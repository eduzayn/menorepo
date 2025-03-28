/**
 * Funções utilitárias para manipulação de dados no armazenamento local
 */

const STORAGE_PREFIX = 'edunexia_portal_aluno_';

/**
 * Salva um valor no localStorage com um prefixo específico do portal do aluno
 * @param key Chave para armazenamento
 * @param value Valor a ser armazenado
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
  } catch (error) {
    console.error(`Erro ao salvar no localStorage: ${key}`, error);
  }
}

/**
 * Recupera um valor do localStorage
 * @param key Chave para recuperação
 * @param defaultValue Valor padrão se não encontrado
 * @returns Valor armazenado ou valor padrão
 */
export function getFromStorage<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const serializedValue = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error(`Erro ao recuperar do localStorage: ${key}`, error);
    return defaultValue;
  }
}

/**
 * Remove um valor do localStorage
 * @param key Chave para remoção
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error(`Erro ao remover do localStorage: ${key}`, error);
  }
}

/**
 * Limpa todos os dados do portal do aluno no localStorage
 */
export function clearPortalStorage(): void {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Erro ao limpar localStorage do portal', error);
  }
} 