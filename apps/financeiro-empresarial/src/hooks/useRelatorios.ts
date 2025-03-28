import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import type { 
  CategoriaFinanceira, 
  ParametrosRelatorio,
  Pagamento,
  Cobranca,
  Comissao
} from '../types/financeiro';

interface ClientSupabase {
  supabase: any;
}

interface ResultadoConsulta<T> {
  dados: T[];
  total: number;
  erro?: string;
}

// Implementação futura: integrar com o serviço real de relatórios
// Por enquanto, esta é uma implementação simulada
const gerarRelatorioFinanceiro = async (
  client: ClientSupabase,
  parametros: ParametrosRelatorio
): Promise<ResultadoConsulta<any>> => {
  try {
    const { supabase } = client;
    const { 
      data_inicio, 
      data_fim, 
      tipo_relatorio,
      categorias,
      polo_id,
      curso_id,
      formato_saida,
      agrupar_por
    } = parametros;
    
    // Simulação de chamada de API
    console.log('Gerando relatório com parâmetros:', parametros);
    
    // Dados simulados para diferentes tipos de relatórios
    let dados: any[] = [];
    
    // Simular diferentes relatórios
    switch (tipo_relatorio) {
      case 'receitas':
        dados = Array.from({ length: 10 }, (_, i) => ({
          id: `rec-${i}`,
          data: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          categoria: ['mensalidade', 'matricula', 'taxa'][i % 3] as CategoriaFinanceira,
          descricao: `Pagamento ${i}`,
          valor: Math.random() * 1000 + 100,
          status: 'confirmado'
        }));
        break;
        
      case 'despesas':
        dados = Array.from({ length: 8 }, (_, i) => ({
          id: `desp-${i}`,
          data: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          categoria: ['salario', 'aluguel', 'servico', 'marketing'][i % 4] as CategoriaFinanceira,
          descricao: `Despesa ${i}`,
          valor: Math.random() * 800 + 200,
          status: 'confirmado'
        }));
        break;
        
      case 'fluxo_caixa':
        dados = Array.from({ length: 15 }, (_, i) => ({
          id: `flx-${i}`,
          data: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          entradas: Math.random() * 1500 + 500,
          saidas: Math.random() * 1000 + 200,
          saldo: 0, // será calculado abaixo
        }));
        // Calcular saldo
        dados = dados.map(item => ({
          ...item,
          saldo: item.entradas - item.saidas
        }));
        break;
        
      case 'inadimplencia':
        dados = Array.from({ length: 12 }, (_, i) => ({
          id: `inad-${i}`,
          aluno_id: `aluno-${i}`,
          matricula_id: `mat-${i}`,
          valor: Math.random() * 500 + 100,
          vencimento: format(new Date(Date.now() - (30 + i) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          dias_atraso: 30 + (i * 5),
          tipo: i % 2 === 0 ? 'mensalidade' : 'taxa'
        }));
        break;
        
      case 'comissoes':
        dados = Array.from({ length: 10 }, (_, i) => ({
          id: `com-${i}`,
          beneficiario_id: `benef-${i}`,
          beneficiario_tipo: i % 2 === 0 ? 'polo' : 'consultor',
          valor: Math.random() * 300 + 50,
          porcentagem: Math.random() * 10 + 5,
          status: ['pendente', 'pago', 'pendente'][i % 3],
          data_prevista: format(new Date(Date.now() + i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
        }));
        break;
        
      case 'dre':
        dados = [
          {
            periodo: format(new Date(data_inicio), 'MMMM/yyyy', { locale: ptBR }),
            receitas: 45000,
            despesas: 30000,
            lucro_bruto: 15000,
            impostos: 3000,
            lucro_liquido: 12000
          }
        ];
        break;
        
      default:
        dados = [];
    }
    
    // Filtrar por data início e fim
    if (data_inicio && data_fim) {
      dados = dados.filter((item) => {
        const dataItem = item.data || item.vencimento || item.data_prevista;
        return dataItem >= data_inicio && dataItem <= data_fim;
      });
    }
    
    // Filtrar por categorias se fornecidas
    if (categorias && categorias.length > 0) {
      dados = dados.filter((item) => (
        !item.categoria || categorias.includes(item.categoria)
      ));
    }
    
    // Filtrar por polo_id se fornecido
    if (polo_id) {
      dados = dados.filter((item) => (
        !item.polo_id || item.polo_id === polo_id
      ));
    }
    
    // Filtrar por curso_id se fornecido
    if (curso_id) {
      dados = dados.filter((item) => (
        !item.curso_id || item.curso_id === curso_id
      ));
    }
    
    // Retornar resultado simulado
    return {
      dados,
      total: dados.length
    };
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return {
      dados: [],
      total: 0,
      erro: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Hook para gerenciamento de relatórios financeiros
export function useRelatorios(clientSupabase: ClientSupabase) {
  const [parametros, setParametros] = useState<ParametrosRelatorio>({
    data_inicio: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    data_fim: format(new Date(), 'yyyy-MM-dd'),
    tipo_relatorio: 'fluxo_caixa',
    formato_saida: 'json'
  });
  
  // Consulta para obter dados do relatório
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['relatorio', parametros],
    queryFn: () => gerarRelatorioFinanceiro(clientSupabase, parametros),
    select: (data) => data.dados || [],
    enabled: !!clientSupabase.supabase
  });
  
  // Mutação para exportar relatório
  const exportarRelatorioMutation = useMutation({
    mutationFn: async (formato: 'excel' | 'pdf') => {
      if (!data || data.length === 0) {
        throw new Error('Não há dados para exportar');
      }
      
      const nomeArquivo = `relatorio_${parametros.tipo_relatorio}_${format(new Date(), 'yyyyMMdd')}`;
      
      if (formato === 'excel') {
        // Exportar para Excel
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
        XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
      } else if (formato === 'pdf') {
        // Exportar para PDF (implementação básica)
        const doc = new jsPDF();
        
        // Título
        doc.setFontSize(16);
        doc.text(`Relatório ${parametros.tipo_relatorio}`, 15, 15);
        
        // Subtítulo com período
        doc.setFontSize(12);
        doc.text(
          `Período: ${format(new Date(parametros.data_inicio), 'dd/MM/yyyy')} a ${format(new Date(parametros.data_fim), 'dd/MM/yyyy')}`,
          15, 25
        );
        
        // Cabeçalhos e dados
        const chaves = Object.keys(data[0]);
        let y = 40;
        
        // Cabeçalhos
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        chaves.forEach((chave, index) => {
          doc.text(chave, 15 + (index * 30), y);
        });
        
        // Dados
        doc.setFont('helvetica', 'normal');
        data.slice(0, 20).forEach((linha, linhaIndex) => {
          y += 10;
          chaves.forEach((chave, colunaIndex) => {
            let valor = linha[chave]?.toString() || '';
            // Limitar tamanho
            valor = valor.length > 15 ? valor.substring(0, 12) + '...' : valor;
            doc.text(valor, 15 + (colunaIndex * 30), y);
          });
        });
        
        // Se houver mais dados, indicar que foi truncado
        if (data.length > 20) {
          y += 15;
          doc.setFont('helvetica', 'italic');
          doc.text(`... mais ${data.length - 20} registros (exportação truncada)`, 15, y);
        }
        
        doc.save(`${nomeArquivo}.pdf`);
      }
      
      return { sucesso: true, formato };
    },
    onSuccess: (result) => {
      toast.success(`Relatório exportado com sucesso em formato ${result.formato}`);
    },
    onError: (error) => {
      toast.error(`Erro ao exportar relatório: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Atualizar parâmetros
  const atualizarParametros = useCallback((novosParametros: Partial<ParametrosRelatorio>) => {
    setParametros((parametrosAtuais) => ({
      ...parametrosAtuais,
      ...novosParametros
    }));
  }, []);
  
  // Exportar relatório
  const exportarRelatorio = useCallback((formato: 'excel' | 'pdf') => {
    exportarRelatorioMutation.mutate(formato);
  }, [exportarRelatorioMutation]);
  
  return {
    dadosRelatorio: data || [],
    isLoading,
    isError,
    error,
    parametros,
    atualizarParametros,
    exportarRelatorio,
    isExporting: exportarRelatorioMutation.isPending,
    refetch
  };
} 