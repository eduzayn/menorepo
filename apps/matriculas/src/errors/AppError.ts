/**
 * Classe personalizada para erros da aplicação
 */
export class AppError extends Error {
  public readonly status: number
  public readonly originalError?: any

  constructor(message: string, originalError?: any, status = 400) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.originalError = originalError
  }
} 