import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription,
  Button, Tabs, TabsContent, TabsList, TabsTrigger,
  Form, FormField, Input, Select, DatePicker, Spinner
} from '@edunexia/ui-components';
import {
  FileTextIcon, DownloadIcon, PrinterIcon,
  BarChartIcon, PieChartIcon, ClipboardListIcon,
  FilePdfIcon, FileSpreadsheetIcon
} from 'lucide-react';

// Tipos de relatórios
interface RelatorioOption {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'financeiro' | 'fiscal' | 'gerencial';
  formato: ('pdf' | 'xlsx' | 'csv')[];
  periodoObrigatorio: boolean;
  filtrosAdicionais?: string[];
  icon: React.ReactNode;
}

// Lista de relatórios disponíveis
const RELATORIOS: RelatorioOption[] = [
  {
    id: 'balanco-patrimonial',
    nome: 'Balanço Patrimonial',
    descricao: 'Demonstrativo contábil que apresenta a posição patrimonial e financeira da empresa.',
    categoria: 'financeiro',
    formato: ['pdf', 'xlsx'],
    periodoObrigatorio: true,
    icon: <BarChartIcon className="w-5 h-5 text-blue-600" />
  },
  {
    id: 'dre',
    nome: 'DRE - Demonstração do Resultado do Exercício',
    descricao: 'Demonstrativo contábil que apresenta o resultado econômico da empresa em determinado período.',
    categoria: 'financeiro',
    formato: ['pdf', 'xlsx'],
    periodoObrigatorio: true,
    icon: <PieChartIcon className="w-5 h-5 text-green-600" />
  },
  {
    id: 'fluxo-caixa',
    nome: 'Fluxo de Caixa',
    descricao: 'Demonstrativo que apresenta a movimentação de entradas e saídas de recursos financeiros.',
    categoria: 'financeiro',
    formato: ['pdf', 'xlsx', 'csv'],
    periodoObrigatorio: true,
    filtrosAdicionais: ['centroCusto'],
    icon: <ClipboardListIcon className="w-5 h-5 text-violet-600" />
  },
  {
    id: 'livro-diario',
    nome: 'Livro Diário',
    descricao: 'Registra todos os lançamentos contábeis em ordem cronológica.',
    categoria: 'fiscal',
    formato: ['pdf', 'xlsx'],
    periodoObrigatorio: true,
    icon: <FileTextIcon className="w-5 h-5 text-red-600" />
  },
  {
    id: 'livro-razao',
    nome: 'Livro Razão',
    descricao: 'Agrupa os lançamentos contábeis por conta contábil.',
    categoria: 'fiscal',
    formato: ['pdf', 'xlsx'],
    periodoObrigatorio: true,
    filtrosAdicionais: ['conta'],
    icon: <FileTextIcon className="w-5 h-5 text-orange-600" />
  },
  {
    id: 'sped-contabil',
    nome: 'SPED Contábil',
    descricao: 'Arquivo digital do Sistema Público de Escrituração Digital para envio à Receita Federal.',
    categoria: 'fiscal',
    formato: ['pdf'],
    periodoObrigatorio: true,
    icon: <FilePdfIcon className="w-5 h-5 text-gray-600" />
  },
  {
    id: 'ecd',
    nome: 'ECD - Escrituração Contábil Digital',
    descricao: 'Arquivo digital para transmissão das obrigações acessórias.',
    categoria: 'fiscal',
    formato: ['pdf'],
    periodoObrigatorio: true,
    icon: <FilePdfIcon className="w-5 h-5 text-gray-600" />
  },
  {
    id: 'analise-custos',
    nome: 'Análise de Custos por Centro',
    descricao: 'Relatório detalhado de custos por centro de custo.',
    categoria: 'gerencial',
    formato: ['pdf', 'xlsx', 'csv'],
    periodoObrigatorio: true,
    filtrosAdicionais: ['centroCusto', 'categorias'],
    icon: <FileSpreadsheetIcon className="w-5 h-5 text-indigo-600" />
  },
  {
    id: 'apuracao-resultados',
    nome: 'Apuração de Resultados por Unidade',
    descricao: 'Demonstrativo de resultados separados por unidade de negócio.',
    categoria: 'gerencial',
    formato: ['pdf', 'xlsx'],
    periodoObrigatorio: true,
    filtrosAdicionais: ['unidade'],
    icon: <PieChartIcon className="w-5 h-5 text-teal-600" />
  }
];

/**
 * Página de Relatórios Contábeis
 * Permite gerar diferentes tipos de relatórios contábeis, financeiros e fiscais
 */
export default function RelatoriosContabeis() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<'financeiro' | 'fiscal' | 'gerencial'>('financeiro');
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<RelatorioOption | null>(null);
  const [formatoSelecionado, setFormatoSelecionado] = useState<'pdf' | 'xlsx' | 'csv'>('pdf');
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    conta: '',
    centroCusto: '',
    unidade: '',
    categorias: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtrar relatórios por categoria
  const relatoriosPorCategoria = RELATORIOS.filter(
    (relatorio) => relatorio.categoria === categoriaAtiva
  );
  
  // Selecionar um relatório
  const selecionarRelatorio = (relatorio: RelatorioOption) => {
    setRelatorioSelecionado(relatorio);
    // Reset formato para o primeiro disponível
    if (relatorio.formato.length > 0) {
      setFormatoSelecionado(relatorio.formato[0] as 'pdf' | 'xlsx' | 'csv');
    }
  };
  
  // Gerar relatório
  const gerarRelatorio = () => {
    if (!relatorioSelecionado) return;
    
    setIsLoading(true);
    
    // Simular uma chamada de API
    setTimeout(() => {
      console.log('Gerando relatório:', {
        relatorio: relatorioSelecionado.id,
        formato: formatoSelecionado,
        filtros
      });
      
      setIsLoading(false);
      
      // Aqui seria feito o download do arquivo ou a abertura em nova janela
      alert(`Relatório ${relatorioSelecionado.nome} gerado com sucesso no formato ${formatoSelecionado.toUpperCase()}!`);
    }, 1500);
  };
  
  // Verificar se o formulário está válido
  const isFormValid = () => {
    if (!relatorioSelecionado) return false;
    
    // Verificar se as datas são obrigatórias e estão preenchidas
    if (relatorioSelecionado.periodoObrigatorio && (!filtros.dataInicio || !filtros.dataFim)) {
      return false;
    }
    
    return true;
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios Contábeis</h1>
          <p className="text-muted-foreground">Gere relatórios financeiros, fiscais e gerenciais da instituição</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Painel Esquerdo - Seleção de Relatórios */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selecione o Relatório</CardTitle>
              <CardDescription>
                Escolha o tipo de relatório que deseja gerar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="financeiro" value={categoriaAtiva} onValueChange={(v) => setCategoriaAtiva(v as any)}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="financeiro">Financeiros</TabsTrigger>
                  <TabsTrigger value="fiscal">Fiscais</TabsTrigger>
                  <TabsTrigger value="gerencial">Gerenciais</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 space-y-2">
                  {relatoriosPorCategoria.map((relatorio) => (
                    <div 
                      key={relatorio.id} 
                      className={`p-3 rounded-md cursor-pointer flex items-start gap-3 transition-colors
                        ${relatorioSelecionado?.id === relatorio.id 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'hover:bg-muted/50 border border-transparent'}`}
                      onClick={() => selecionarRelatorio(relatorio)}
                    >
                      <div className="mt-1">{relatorio.icon}</div>
                      <div>
                        <h3 className="font-medium">{relatorio.nome}</h3>
                        <p className="text-sm text-muted-foreground">{relatorio.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Painel Direito - Filtros e Geração */}
        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {relatorioSelecionado 
                  ? `Configurar: ${relatorioSelecionado.nome}` 
                  : 'Configurar Relatório'}
              </CardTitle>
              <CardDescription>
                {relatorioSelecionado 
                  ? 'Defina os parâmetros para geração do relatório' 
                  : 'Selecione um relatório primeiro'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relatorioSelecionado ? (
                <Form onSubmit={gerarRelatorio}>
                  <div className="space-y-6">
                    {/* Período */}
                    {relatorioSelecionado.periodoObrigatorio && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Data Inicial" required>
                          <DatePicker 
                            value={filtros.dataInicio} 
                            onChange={(date) => setFiltros({ ...filtros, dataInicio: date })}
                          />
                        </FormField>
                        <FormField label="Data Final" required>
                          <DatePicker 
                            value={filtros.dataFim} 
                            onChange={(date) => setFiltros({ ...filtros, dataFim: date })}
                          />
                        </FormField>
                      </div>
                    )}
                    
                    {/* Filtros adicionais específicos */}
                    {relatorioSelecionado.filtrosAdicionais?.includes('conta') && (
                      <FormField label="Conta Contábil">
                        <Input 
                          value={filtros.conta} 
                          onChange={(e) => setFiltros({ ...filtros, conta: e.target.value })}
                          placeholder="Ex: 1.1.1.01.001 ou deixe em branco para todas"
                        />
                      </FormField>
                    )}
                    
                    {relatorioSelecionado.filtrosAdicionais?.includes('centroCusto') && (
                      <FormField label="Centro de Custo">
                        <Select 
                          value={filtros.centroCusto}
                          onChange={(value) => setFiltros({ ...filtros, centroCusto: value })}
                        >
                          <option value="">Todos os Centros de Custo</option>
                          <option value="ADM-001">ADM-001 - Administrativo</option>
                          <option value="FIN-002">FIN-002 - Financeiro</option>
                          <option value="CONT-002">CONT-002 - Contabilidade</option>
                          <option value="RH-001">RH-001 - Recursos Humanos</option>
                        </Select>
                      </FormField>
                    )}
                    
                    {relatorioSelecionado.filtrosAdicionais?.includes('unidade') && (
                      <FormField label="Unidade de Negócio">
                        <Select 
                          value={filtros.unidade}
                          onChange={(value) => setFiltros({ ...filtros, unidade: value })}
                        >
                          <option value="">Todas as Unidades</option>
                          <option value="MATRIZ">Matriz</option>
                          <option value="FILIAL-SP">Filial São Paulo</option>
                          <option value="FILIAL-RJ">Filial Rio de Janeiro</option>
                        </Select>
                      </FormField>
                    )}
                    
                    {relatorioSelecionado.filtrosAdicionais?.includes('categorias') && (
                      <FormField label="Categorias">
                        <Select 
                          value={filtros.categorias}
                          onChange={(value) => setFiltros({ ...filtros, categorias: value })}
                        >
                          <option value="">Todas as Categorias</option>
                          <option value="CUSTOS_FIXOS">Custos Fixos</option>
                          <option value="CUSTOS_VARIAVEIS">Custos Variáveis</option>
                          <option value="DESPESAS_ADM">Despesas Administrativas</option>
                          <option value="DESPESAS_VENDAS">Despesas com Vendas</option>
                        </Select>
                      </FormField>
                    )}
                    
                    {/* Formato de Exportação */}
                    <FormField label="Formato" required>
                      <div className="flex gap-2">
                        {relatorioSelecionado.formato.map((formato) => (
                          <Button
                            key={formato}
                            type="button"
                            variant={formatoSelecionado === formato ? "default" : "outline"}
                            onClick={() => setFormatoSelecionado(formato as 'pdf' | 'xlsx' | 'csv')}
                            className="flex gap-2 items-center"
                          >
                            {formato === 'pdf' && <FilePdfIcon className="w-4 h-4" />}
                            {formato === 'xlsx' && <FileSpreadsheetIcon className="w-4 h-4" />}
                            {formato === 'csv' && <FileTextIcon className="w-4 h-4" />}
                            {formato.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </FormField>
                    
                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-3 mt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => window.print()}
                      >
                        <PrinterIcon className="w-4 h-4 mr-2" />
                        Imprimir
                      </Button>
                      
                      <Button
                        type="submit"
                        disabled={isLoading || !isFormValid()}
                      >
                        {isLoading ? (
                          <>
                            <Spinner size="sm" className="mr-2" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Gerar Relatório
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Form>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileTextIcon className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum relatório selecionado</h3>
                  <p className="text-muted-foreground max-w-md">
                    Selecione um relatório na lista à esquerda para configurar os parâmetros de geração.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 