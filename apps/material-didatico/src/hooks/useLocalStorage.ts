import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Estado para armazenar o valor
  // Passe a função inicial para useState para que seja executada apenas uma vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Tenta pegar do localStorage pelo key
      const item = window.localStorage.getItem(key)
      // Parse o JSON armazenado ou retorne initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Se houver erro, retorna initialValue
      console.error(error)
      return initialValue
    }
  })

  // Retorna uma versão empacotada da função setStoredValue que persiste
  // o novo valor no localStorage.
  const setValue = (value: T) => {
    try {
      // Permite que o valor seja uma função para ter a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Salva o estado
      setStoredValue(valueToStore)
      // Salva no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
} 