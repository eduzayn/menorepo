import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Componente que captura erros em componentes filhos e exibe uma UI de fallback
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o estado para que o próximo render mostre a UI de fallback
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Você também pode registrar o erro em um serviço de relatório de erros
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback personalizada
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-lg w-full text-center">
            <h1 className="text-4xl font-extrabold text-red-600 mb-6">Oops!</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Algo deu errado
            </h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-2">
                Ocorreu um erro inesperado. Nossa equipe foi notificada.
              </p>
              <p>Tente recarregar a página ou voltar para a página inicial.</p>
            </div>
            <div className="max-w-xs mx-auto overflow-hidden bg-gray-100 rounded-lg p-4 mb-6">
              <details className="text-left">
                <summary className="text-gray-700 font-medium cursor-pointer mb-2">
                  Detalhes técnicos
                </summary>
                <pre className="text-xs text-red-800 overflow-auto p-2 bg-red-50 rounded">
                  {this.state.error?.toString()}
                </pre>
              </details>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Recarregar página
              </button>
              <a
                href="/"
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Voltar para a home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 