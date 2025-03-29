import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell, 
  Pagination,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@edunexia/ui-components';
import { formatCurrency, formatDate } from '../utils/formatters';

export interface ColunaTabelaContabil<T> {
  campo: keyof T | string;
  titulo: string;
  renderizador?: (valor: any, item: T) => React.ReactNode;
  ordenavel?: boolean;
  alinhamento?: 'left' | 'center' | 'right';
  largura?: string;
}

export interface TabelaContabilProps<T> {
  titulo?: string;
  dados: T[];
  colunas: ColunaTabelaContabil<T>[];
  chave: keyof T;
  paginacao?: {
    paginaAtual: number;
    totalPaginas: number;
    totalItens: number;
    itensPorPagina: number;
    onMudarPagina: (novaPagina: number) => void;
  };
  ordenacao?: {
    campo: string;
    ordem: 'asc' | 'desc';
    onOrdenar: (campo: string, ordem: 'asc' | 'desc') => void;
  };
  carregando?: boolean;
  vazio?: React.ReactNode;
  acoes?: (item: T) => React.ReactNode;
  onClickLinha?: (item: T) => void;
  className?: string;
}

/**
 * Componente reutilizável para tabelas de dados contábeis com suporte a paginação e ordenação
 */
export function TabelaContabil<T>({
  titulo,
  dados,
  colunas,
  chave,
  paginacao,
  ordenacao,
  carregando = false,
  vazio = <p className="text-center py-8 text-gray-500">Nenhum registro encontrado</p>,
  acoes,
  onClickLinha,
  className = ''
}: TabelaContabilProps<T>) {
  // Renderizar célula com base no tipo de dado
  const renderizarCelula = (item: T, coluna: ColunaTabelaContabil<T>) => {
    // Se o campo for uma string com notação de ponto, acessar propriedades aninhadas
    let valor: any;
    
    if (typeof coluna.campo === 'string' && coluna.campo.includes('.')) {
      const caminhoProps = coluna.campo.split('.');
      valor = caminhoProps.reduce((obj, prop) => obj && obj[prop], item as any);
    } else {
      valor = typeof coluna.campo === 'string' 
        ? (item as any)[coluna.campo] 
        : item[coluna.campo as keyof T];
    }

    // Se houver renderizador personalizado, usá-lo
    if (coluna.renderizador) {
      return coluna.renderizador(valor, item);
    }

    // Renderização padrão baseada no tipo de dado
    if (valor === null || valor === undefined) {
      return '-';
    }

    if (typeof valor === 'boolean') {
      return valor ? 'Sim' : 'Não';
    }

    if (typeof valor === 'number') {
      // Assumir que números com valores maiores são monetários
      return valor > 100 ? formatCurrency(valor) : valor.toString();
    }

    if (valor instanceof Date || (typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}/))) {
      return formatDate(valor);
    }

    return valor.toString();
  };

  // Determinar alinhamento com base no tipo de dado
  const getAlinhamento = (coluna: ColunaTabelaContabil<T>) => {
    if (coluna.alinhamento) return coluna.alinhamento;
    
    // Alinhamento padrão por tipo de dado se não especificado
    if (typeof coluna.campo === 'string' && ['valor', 'total', 'montante', 'preco'].some(term => 
      coluna.campo.toString().toLowerCase().includes(term))) {
      return 'right';
    }
    
    if (typeof coluna.campo === 'string' && ['data', 'date', 'dt'].some(term => 
      coluna.campo.toString().toLowerCase().includes(term))) {
      return 'center';
    }
    
    return 'left';
  };

  // Manipular clique em cabeçalho para ordenação
  const handleOrdenarClick = (campo: string) => {
    if (!ordenacao) return;
    
    const novoCampo = campo;
    const novaOrdem = ordenacao.campo === campo && ordenacao.ordem === 'asc' ? 'desc' : 'asc';
    
    ordenacao.onOrdenar(novoCampo, novaOrdem);
  };

  // Renderizar indicador de ordenação
  const renderizarIndicadorOrdenacao = (campo: string) => {
    if (!ordenacao || ordenacao.campo !== campo) return null;
    
    return (
      <span className="ml-1">
        {ordenacao.ordem === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // Definir largura de coluna
  const getLarguraColuna = (coluna: ColunaTabelaContabil<T>) => {
    if (coluna.largura) return coluna.largura;
    
    // Larguras padrão por tipo se não especificado
    if (typeof coluna.campo === 'string') {
      const campoStr = coluna.campo.toString().toLowerCase();
      
      if (['data', 'date', 'dt'].some(term => campoStr.includes(term))) {
        return '120px';
      }
      
      if (['id', 'codigo', 'status'].some(term => campoStr.includes(term))) {
        return '100px';
      }
      
      if (['valor', 'total', 'montante', 'preco'].some(term => campoStr.includes(term))) {
        return '150px';
      }
    }
    
    return 'auto';
  };

  return (
    <Card className={className}>
      {titulo && (
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">{titulo}</CardTitle>
        </CardHeader>
      )}
      
      <CardContent>
        {carregando ? (
          <div className="py-8 text-center">
            <span className="text-primary">Carregando...</span>
          </div>
        ) : dados.length === 0 ? (
          vazio
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {colunas.map((coluna) => (
                    <TableHead 
                      key={coluna.campo.toString()} 
                      className={`text-${getAlinhamento(coluna)}`}
                      style={{ width: getLarguraColuna(coluna) }}
                      onClick={coluna.ordenavel && ordenacao ? () => handleOrdenarClick(coluna.campo.toString()) : undefined}
                      role={coluna.ordenavel && ordenacao ? "button" : undefined}
                    >
                      {coluna.titulo}
                      {coluna.ordenavel && ordenacao && renderizarIndicadorOrdenacao(coluna.campo.toString())}
                    </TableHead>
                  ))}
                  {acoes && <TableHead style={{ width: '120px' }}>Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.map((item) => (
                  <TableRow 
                    key={String(item[chave])}
                    className={onClickLinha ? 'cursor-pointer hover:bg-gray-50' : ''}
                    onClick={onClickLinha ? () => onClickLinha(item) : undefined}
                  >
                    {colunas.map((coluna) => (
                      <TableCell 
                        key={`${String(item[chave])}-${coluna.campo.toString()}`}
                        className={`text-${getAlinhamento(coluna)}`}
                      >
                        {renderizarCelula(item, coluna)}
                      </TableCell>
                    ))}
                    {acoes && (
                      <TableCell className="text-right">
                        {acoes(item)}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      {paginacao && (
        <CardFooter className="flex justify-between items-center border-t pt-4">
          <div className="text-sm text-gray-500">
            Exibindo {(paginacao.paginaAtual - 1) * paginacao.itensPorPagina + 1} a {' '}
            {Math.min(paginacao.paginaAtual * paginacao.itensPorPagina, paginacao.totalItens)} de {' '}
            {paginacao.totalItens} registros
          </div>
          <Pagination
            currentPage={paginacao.paginaAtual}
            totalPages={paginacao.totalPaginas}
            onPageChange={paginacao.onMudarPagina}
          />
        </CardFooter>
      )}
    </Card>
  );
} 