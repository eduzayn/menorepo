import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@edunexia/ui-components';
import { 
  FolhaPagamento, FeriasRh, BeneficioRh, 
  IntegracaoRhResponse 
} from '../types/contabilidade';
import { format } from 'date-fns';
import { useContabilidade } from '../hooks/useContabilidade';
import * as contabilidadeUtils from '../utils/contabilidadeUtils';

// Interface para o contexto
interface ContabilidadeRhContextProps {
  // Estados
  mesAnoAtual: string;
  filtrosFerias: {
    dataInicio: string;
    dataFim: string;
    status: string;
  };
  relatorioSelecionado: string | null;
  
  // Dados
  dadosFolha: IntegracaoRhResponse | null;
  dadosFerias: IntegracaoRhResponse | null;
  dadosBeneficios: IntegracaoRhResponse | null;
  isLoading: boolean;
  
  // Ações
  setMesAnoAtual: (mesAno: string) => void;
  setFiltrosFerias: (filtros: {
    dataInicio?: string;
    dataFim?: string;
    status?: string;
  }) => void;
  sincronizarDados: () => Promise<void>;
  contabilizarFolha: () => Promise<void>;
  contabilizarFerias: () => Promise<void>;
  contabilizarBeneficios: () => Promise<void>;
  gerarRelatorio: (tipoRelatorio: string) => Promise<void>;
  
  // Utilitários
  formatarMoeda: (valor: number) => string;
  formatarData: (data: Date | string) => string;
  formatarPeriodo: (inicio: Date | string, fim: Date | string) => string;
  isLancamentoProcessado: (status: string) => boolean;
  formatarMesAno: (mesAno: string) => string;
}

// Cria o contexto
const ContabilidadeRhContext = createContext<ContabilidadeRhContextProps | undefined>(undefined);

// Provider para o contexto
export function ContabilidadeRhProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Hooks de contabilidade
  const { 
    useFolhaPagamento,
    useContabilizarFolha,
    useDadosFerias,
    useContabilizarProvisaoFerias,
    useDadosBeneficios,
    useContabilizarBeneficios,
    useRelatorioCustosPessoal
  } = useContabilidade();
  
  // Estados
  const [mesAnoAtual, setMesAnoAtual] = useState<string>(
    format(new Date(), 'yyyy-MM')
  );
  
  const [filtrosFerias, setFiltrosFerias] = useState({
    dataInicio: format(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), 'yyyy-MM-dd'),
    dataFim: format(new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0), 'yyyy-MM-dd'),
    status: 'pendente',
  });
  
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<string | null>(null);
  
  // Consultas e mutations
  const { 
    data: dadosFolha, 
    isLoading: isLoadingFolha, 
    refetch: refetchFolha 
  } = useFolhaPagamento(mesAnoAtual);
  
  const { 
    data: dadosFerias, 
    isLoading: isLoadingFerias, 
    refetch: refetchFerias 
  } = useDadosFerias(filtrosFerias);
  
  const { 
    data: dadosBeneficios, 
    isLoading: isLoadingBeneficios, 
    refetch: refetchBeneficios 
  } = useDadosBeneficios(mesAnoAtual);
  
  const { mutate: contabilizarFolhaMutation } = useContabilizarFolha();
  const { mutate: contabilizarFeriasMutation } = useContabilizarProvisaoFerias();
  const { mutate: contabilizarBeneficiosMutation } = useContabilizarBeneficios();
  const { mutate: gerarRelatorioMutation } = useRelatorioCustosPessoal();
  
  // Sincroniza todos os dados
  const sincronizarDados = async () => {
    try {
      await Promise.all([
        refetchFolha(),
        refetchFerias(),
        refetchBeneficios()
      ]);
      
      toast({
        title: "Dados atualizados",
        description: "As informações de RH foram sincronizadas com sucesso.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Contabilizar folha de pagamento
  const contabilizarFolha = async () => {
    if (!dadosFolha?.idEntidade) {
      toast({
        title: "Ação não permitida",
        description: "Não há dados de folha para contabilizar.",
        variant: "destructive"
      });
      return;
    }
    
    if (contabilidadeUtils.isLancamentoProcessado(dadosFolha.status)) {
      toast({
        title: "Ação não permitida",
        description: "Esta folha já foi contabilizada anteriormente.",
        variant: "destructive"
      });
      return;
    }
    
    contabilizarFolhaMutation({
      mesAno: mesAnoAtual,
      idFolha: dadosFolha.idEntidade
    }, {
      onSuccess: () => {
        refetchFolha();
        toast({
          title: "Folha contabilizada",
          description: `Folha de pagamento de ${contabilidadeUtils.formatarMesAno(mesAnoAtual)} contabilizada com sucesso.`,
          variant: "success"
        });
      },
      onError: () => {
        toast({
          title: "Erro na contabilização",
          description: "Não foi possível contabilizar a folha de pagamento.",
          variant: "destructive"
        });
      }
    });
  };
  
  // Contabilizar férias
  const contabilizarFerias = async () => {
    if (!dadosFerias?.data?.ferias?.length) {
      toast({
        title: "Ação não permitida",
        description: "Não há dados de férias para contabilizar.",
        variant: "destructive"
      });
      return;
    }
    
    if (contabilidadeUtils.isLancamentoProcessado(dadosFerias.status)) {
      toast({
        title: "Ação não permitida",
        description: "Estas férias já foram contabilizadas anteriormente.",
        variant: "destructive"
      });
      return;
    }
    
    contabilizarFeriasMutation(mesAnoAtual, {
      onSuccess: () => {
        refetchFerias();
        toast({
          title: "Férias contabilizadas",
          description: `Provisão de férias de ${contabilidadeUtils.formatarMesAno(mesAnoAtual)} contabilizada com sucesso.`,
          variant: "success"
        });
      },
      onError: () => {
        toast({
          title: "Erro na contabilização",
          description: "Não foi possível contabilizar as provisões de férias.",
          variant: "destructive"
        });
      }
    });
  };
  
  // Contabilizar benefícios
  const contabilizarBeneficios = async () => {
    if (!dadosBeneficios?.idEntidade) {
      toast({
        title: "Ação não permitida",
        description: "Não há dados de benefícios para contabilizar.",
        variant: "destructive"
      });
      return;
    }
    
    if (contabilidadeUtils.isLancamentoProcessado(dadosBeneficios.status)) {
      toast({
        title: "Ação não permitida",
        description: "Estes benefícios já foram contabilizados anteriormente.",
        variant: "destructive"
      });
      return;
    }
    
    contabilizarBeneficiosMutation({
      mesAno: mesAnoAtual,
      idPeriodo: dadosBeneficios.idEntidade
    }, {
      onSuccess: () => {
        refetchBeneficios();
        toast({
          title: "Benefícios contabilizados",
          description: `Benefícios de ${contabilidadeUtils.formatarMesAno(mesAnoAtual)} contabilizados com sucesso.`,
          variant: "success"
        });
      },
      onError: () => {
        toast({
          title: "Erro na contabilização",
          description: "Não foi possível contabilizar os benefícios.",
          variant: "destructive"
        });
      }
    });
  };
  
  // Gerar relatório
  const gerarRelatorio = async (tipoRelatorio: string) => {
    setRelatorioSelecionado(tipoRelatorio);
    
    const filtros = {
      mesAno: mesAnoAtual,
      tipo: tipoRelatorio,
      formato: 'pdf'
    };
    
    gerarRelatorioMutation(filtros, {
      onSuccess: (data) => {
        // Aqui poderia abrir o relatório em uma nova aba ou fazer download
        window.open(data.urlDownload, '_blank');
        toast({
          title: "Relatório gerado",
          description: "O relatório foi gerado com sucesso.",
          variant: "success"
        });
      },
      onError: () => {
        toast({
          title: "Erro ao gerar relatório",
          description: "Não foi possível gerar o relatório solicitado.",
          variant: "destructive"
        });
      },
      onSettled: () => {
        setRelatorioSelecionado(null);
      }
    });
  };
  
  // Atualizar filtros de férias com mesclagem parcial
  const atualizarFiltrosFerias = (novosFiltros: {
    dataInicio?: string;
    dataFim?: string;
    status?: string;
  }) => {
    setFiltrosFerias((filtrosAtuais) => ({
      ...filtrosAtuais,
      ...novosFiltros
    }));
  };
  
  // Estado de carregamento geral
  const isLoading = isLoadingFolha || isLoadingFerias || isLoadingBeneficios;
  
  // Valores do contexto
  const contextValue: ContabilidadeRhContextProps = {
    // Estados
    mesAnoAtual,
    filtrosFerias,
    relatorioSelecionado,
    
    // Dados
    dadosFolha,
    dadosFerias,
    dadosBeneficios,
    isLoading,
    
    // Ações
    setMesAnoAtual,
    setFiltrosFerias: atualizarFiltrosFerias,
    sincronizarDados,
    contabilizarFolha,
    contabilizarFerias,
    contabilizarBeneficios,
    gerarRelatorio,
    
    // Utilitários
    formatarMoeda: contabilidadeUtils.formatarMoeda,
    formatarData: contabilidadeUtils.formatarData, 
    formatarPeriodo: contabilidadeUtils.formatarPeriodo,
    isLancamentoProcessado: contabilidadeUtils.isLancamentoProcessado,
    formatarMesAno: contabilidadeUtils.formatarMesAno
  };
  
  return (
    <ContabilidadeRhContext.Provider value={contextValue}>
      {children}
    </ContabilidadeRhContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useContabilidadeRh() {
  const context = useContext(ContabilidadeRhContext);
  
  if (context === undefined) {
    throw new Error('useContabilidadeRh deve ser usado dentro de um ContabilidadeRhProvider');
  }
  
  return context;
} 