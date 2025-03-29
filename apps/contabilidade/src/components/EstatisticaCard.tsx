import React, { ReactNode } from 'react';
import { Card, CardContent } from '@edunexia/ui-components';

export interface EstatisticaCardProps {
  titulo: string;
  valor: string | number;
  icone: ReactNode;
  indicador?: 'positivo' | 'negativo' | 'neutro';
  descricao?: string;
  porcentagem?: number;
  className?: string;
}

/**
 * Componente para exibir estatísticas contábeis em cards
 */
export function EstatisticaCard({
  titulo,
  valor,
  icone,
  indicador = 'neutro',
  descricao,
  porcentagem,
  className = ''
}: EstatisticaCardProps) {
  // Definir as cores com base no indicador
  const cores = {
    positivo: {
      bg: 'bg-contabil-positivo-50',
      texto: 'text-contabil-positivo-700',
      borda: 'border-contabil-positivo-200',
      iconeBg: 'bg-contabil-positivo-100',
      iconeTexto: 'text-contabil-positivo'
    },
    negativo: {
      bg: 'bg-contabil-negativo-50',
      texto: 'text-contabil-negativo-700',
      borda: 'border-contabil-negativo-200',
      iconeBg: 'bg-contabil-negativo-100',
      iconeTexto: 'text-contabil-negativo'
    },
    neutro: {
      bg: 'bg-contabil-neutro-50',
      texto: 'text-contabil-neutro-700',
      borda: 'border-contabil-neutro-200',
      iconeBg: 'bg-contabil-neutro-100',
      iconeTexto: 'text-contabil-neutro'
    }
  };
  
  const corSelecionada = cores[indicador];
  
  return (
    <Card className={`${corSelecionada.bg} border ${corSelecionada.borda} ${className}`}>
      <CardContent className="p-4 flex items-center">
        <div className={`rounded-full p-3 ${corSelecionada.iconeBg} mr-4`}>
          <div className={corSelecionada.iconeTexto}>
            {icone}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{titulo}</h3>
          <div className="text-2xl font-bold">{valor}</div>
          
          {(descricao || porcentagem !== undefined) && (
            <div className="flex items-center mt-1 text-sm">
              {porcentagem !== undefined && (
                <span 
                  className={`mr-1 font-medium ${
                    porcentagem > 0 
                      ? 'text-contabil-positivo' 
                      : porcentagem < 0 
                        ? 'text-contabil-negativo' 
                        : 'text-gray-500'
                  }`}
                >
                  {porcentagem > 0 ? '+' : ''}{porcentagem}%
                </span>
              )}
              
              {descricao && (
                <span className="text-muted-foreground">{descricao}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 