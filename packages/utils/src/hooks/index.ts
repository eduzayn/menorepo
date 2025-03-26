import { useState, useEffect, useCallback, useRef } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { useScrollLock } from '../hooks/useScrollLock'
import { useWindowSize } from '../hooks/useWindowSize'

// Hook para gerenciar estado de loading
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)

  const startLoading = useCallback(() => setIsLoading(true), [])
  const stopLoading = useCallback(() => setIsLoading(false), [])

  return { isLoading, startLoading, stopLoading }
}

// Hook para gerenciar estado de erro
export function useError(initialState = null) {
  const [error, setError] = useState<string | null>(initialState)

  const setErrorMessage = useCallback((message: string) => setError(message), [])
  const clearError = useCallback(() => setError(null), [])

  return { error, setErrorMessage, clearError }
}

// Hook para gerenciar estado de sucesso
export function useSuccess(initialState = false) {
  const [isSuccess, setIsSuccess] = useState(initialState)

  const showSuccess = useCallback(() => setIsSuccess(true), [])
  const hideSuccess = useCallback(() => setIsSuccess(false), [])

  return { isSuccess, showSuccess, hideSuccess }
}

// Hook para gerenciar estado de confirmação
export function useConfirmation(initialState = false) {
  const [isConfirmed, setIsConfirmed] = useState(initialState)

  const confirm = useCallback(() => setIsConfirmed(true), [])
  const cancel = useCallback(() => setIsConfirmed(false), [])

  return { isConfirmed, confirm, cancel }
}

// Hook para gerenciar estado de modal
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)
  const { lockScroll, unlockScroll } = useScrollLock()

  const open = useCallback(() => {
    setIsOpen(true)
    lockScroll()
  }, [lockScroll])

  const close = useCallback(() => {
    setIsOpen(false)
    unlockScroll()
  }, [unlockScroll])

  return { isOpen, open, close }
}

// Hook para gerenciar estado de dropdown
export function useDropdown(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)
  const ref = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref, () => setIsOpen(false))

  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return { isOpen, toggle, ref }
}

// Hook para gerenciar estado de formulário
export function useForm<T extends Record<string, any>>(initialState: T) {
  const [values, setValues] = useState<T>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }, [])

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void>) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [values])

  const resetForm = useCallback(() => {
    setValues(initialState)
    setErrors({})
  }, [initialState])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setErrors,
  }
}

// Hook para gerenciar estado de paginação
export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [totalItems, setTotalItems] = useState(0)

  const totalPages = Math.ceil(totalItems / pageSize)

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)))
  }, [totalPages])

  const goToNextPage = useCallback(() => {
    goToPage(page + 1)
  }, [page, goToPage])

  const goToPreviousPage = useCallback(() => {
    goToPage(page - 1)
  }, [page, goToPage])

  const setTotal = useCallback((total: number) => {
    setTotalItems(total)
  }, [])

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setPageSize,
    setTotal,
  }
}

// Hook para gerenciar estado de busca
export function useSearch(initialValue = '') {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  return {
    searchTerm,
    debouncedSearchTerm,
    handleSearch,
  }
}

// Hook para gerenciar estado de ordenação
export function useSorting<T extends string>(initialField?: T, initialDirection: 'asc' | 'desc' = 'asc') {
  const [sortField, setSortField] = useState<T | undefined>(initialField)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialDirection)

  const handleSort = useCallback((field: T) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField])

  return {
    sortField,
    sortDirection,
    handleSort,
  }
}

// Hook para gerenciar estado de filtros
export function useFilters<T extends Record<string, any>>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters)
  const debouncedFilters = useDebounce(filters, 500)

  const updateFilter = useCallback((name: keyof T, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  return {
    filters,
    debouncedFilters,
    updateFilter,
    resetFilters,
  }
}

// Hook para gerenciar estado de seleção
export function useSelection<T extends string | number>(initialSelection: T[] = []) {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelection)

  const toggleItem = useCallback((item: T) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    )
  }, [])

  const selectAll = useCallback((items: T[]) => {
    setSelectedItems(items)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedItems([])
  }, [])

  return {
    selectedItems,
    toggleItem,
    selectAll,
    clearSelection,
  }
}

// Hook para gerenciar estado de upload
export function useUpload() {
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startUpload = useCallback(() => {
    setIsUploading(true)
    setError(null)
  }, [])

  const updateProgress = useCallback((value: number) => {
    setProgress(value)
  }, [])

  const completeUpload = useCallback(() => {
    setIsUploading(false)
    setProgress(100)
  }, [])

  const failUpload = useCallback((message: string) => {
    setIsUploading(false)
    setError(message)
  }, [])

  return {
    progress,
    isUploading,
    error,
    startUpload,
    updateProgress,
    completeUpload,
    failUpload,
  }
}

// Hook para gerenciar estado de tema
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    if (isDarkMode && theme === 'light') {
      setTheme('dark')
    } else if (!isDarkMode && theme === 'dark') {
      setTheme('light')
    }
  }, [isDarkMode, setTheme])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return {
    theme,
    toggleTheme,
  }
}

// Hook para gerenciar estado de responsividade
export function useResponsive() {
  const { width } = useWindowSize()

  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024
  const isDesktop = width >= 1024

  return {
    isMobile,
    isTablet,
    isDesktop,
  }
} 