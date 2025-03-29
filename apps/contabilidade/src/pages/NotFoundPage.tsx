import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@edunexia/ui-components';
import { FileQuestionIcon, HomeIcon } from 'lucide-react';

/**
 * Página 404 - Não Encontrado
 * Exibida quando o usuário acessa uma rota inválida no módulo
 */
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <FileQuestionIcon className="w-20 h-20 text-muted-foreground mb-6" />
      
      <h1 className="text-4xl font-bold mb-2">Página não encontrada</h1>
      
      <p className="text-xl text-muted-foreground mb-8">
        A página que você está tentando acessar não existe no módulo de contabilidade.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/" className="flex items-center">
            <HomeIcon className="w-4 h-4 mr-2" />
            Ir para o Dashboard
          </Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link to="/plano-de-contas" className="flex items-center">
            Plano de Contas
          </Link>
        </Button>
      </div>
    </div>
  );
} 