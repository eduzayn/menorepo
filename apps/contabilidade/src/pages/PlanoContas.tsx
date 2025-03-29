import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableCell, 
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  TabItem,
  Alert
} from '@edunexia/ui-components';
import { useContabilidade } from '../hooks/useContabilidade';
import { ContaContabil } from '../types/contabilidade';

/**
 * Página de gerenciamento do Plano de Contas
 * Permite visualizar, adicionar, editar e organizar contas contábeis
 */
const PlanoContas: React.FC = () => {
  // Estados locais
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [contaAtual, setContaAtual] = useState<Partial<ContaContabil>>({
    codigo: '',
    nome: '',
    tipo: 'ativo',
    natureza: 'devedora',
    contaPai: null,
    nivel: 1,
    analitica: false
  });
  const [tabAtiva, setTabAtiva] = useState('estrutura');

  // Hooks do serviço de contabilidade
  const { usePlanoContas, useCriarContaContabil, useAtualizarContaContabil } = useContabilidade();
  
  // Consulta do plano de contas
  const { data: contas = [], isLoading, error } = usePlanoContas();
  
  // Mutations para criar e atualizar contas
  const criarContaMutation = useCriarContaContabil();
  const atualizarContaMutation = useAtualizarContaContabil();

  // Filtra contas com base nos critérios
  const contasFiltradas = contas.filter(conta => {
    const matchTipo = tipoFiltro === 'todos' || conta.tipo === tipoFiltro;
    const matchTexto = filtro === '' || 
      conta.codigo.includes(filtro) || 
      conta.nome.toLowerCase().includes(filtro.toLowerCase());
    return matchTipo && matchTexto;
  });

  // Organiza contas em estrutura hierárquica
  const contasHierarquicas = organizarContasHierarquicas(contasFiltradas);

  // Handler para abrir modal de criação de conta
  const handleNovaConta = () => {
    setContaAtual({
      codigo: '',
      nome: '',
      tipo: 'ativo',
      natureza: 'devedora',
      contaPai: null,
      nivel: 1,
      analitica: false
    });
    setModoEdicao(false);
    setModalAberto(true);
  };

  // Handler para editar conta existente
  const handleEditarConta = (conta: ContaContabil) => {
    setContaAtual({ ...conta });
    setModoEdicao(true);
    setModalAberto(true);
  };

  // Handler para salvar conta (criar ou atualizar)
  const handleSalvarConta = async () => {
    try {
      if (modoEdicao && contaAtual.id) {
        await atualizarContaMutation.mutateAsync({
          id: contaAtual.id,
          conta: contaAtual
        });
      } else {
        await criarContaMutation.mutateAsync(contaAtual as Omit<ContaContabil, 'id'>);
      }
      setModalAberto(false);
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
    }
  };

  // Renderiza contas em formato de árvore hierárquica
  const renderizarContasHierarquicas = (contas: any[], nivel = 0) => {
    return contas.map(conta => (
      <React.Fragment key={conta.id}>
        <TableRow 
          onClick={() => handleEditarConta(conta.dados)}
          className="cursor-pointer hover:bg-gray-100"
        >
          <TableCell className="font-mono">
            <div style={{ marginLeft: `${nivel * 20}px` }}>
              {conta.dados.codigo}
            </div>
          </TableCell>
          <TableCell>
            <div style={{ marginLeft: `${nivel * 20}px` }}>
              {conta.dados.nome}
            </div>
          </TableCell>
          <TableCell>{conta.dados.tipo}</TableCell>
          <TableCell>{conta.dados.natureza}</TableCell>
          <TableCell>{conta.dados.analitica ? 'Sim' : 'Não'}</TableCell>
        </TableRow>
        {conta.filhos && renderizarContasHierarquicas(conta.filhos, nivel + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plano de Contas</h1>
        <Button onClick={handleNovaConta}>Nova Conta</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento do Plano de Contas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs activeTab={tabAtiva} onChange={setTabAtiva}>
            <TabItem id="estrutura" label="Estrutura de Contas">
              <div className="mb-4 flex space-x-4">
                <div className="w-2/3">
                  <Input
                    placeholder="Buscar por código ou nome..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                </div>
                <div className="w-1/3">
                  <Select
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                  >
                    <option value="todos">Todos os tipos</option>
                    <option value="ativo">Ativo</option>
                    <option value="passivo">Passivo</option>
                    <option value="patrimonio_liquido">Patrimônio Líquido</option>
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                    <option value="custo">Custo</option>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <p>Carregando plano de contas...</p>
                </div>
              ) : error ? (
                <Alert type="error">
                  Erro ao carregar o plano de contas. Tente novamente.
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Natureza</TableCell>
                      <TableCell>Analítica</TableCell>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {renderizarContasHierarquicas(contasHierarquicas)}
                  </tbody>
                </Table>
              )}
            </TabItem>
            <TabItem id="importacao" label="Importação/Exportação">
              <div className="py-4">
                <Alert type="info">
                  Utilize esta área para importar modelos de plano de contas ou exportar seu plano atual.
                </Alert>
                
                <div className="flex space-x-4 mt-6">
                  <Button variant="outline">Importar Plano de Contas</Button>
                  <Button variant="outline">Exportar Plano de Contas</Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-2">Modelos Pré-definidos</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium">Plano Empresarial Básico</h4>
                        <p className="text-sm text-gray-600 mt-2">Modelo simplificado para empresas de pequeno porte.</p>
                        <Button variant="text" className="mt-4">Aplicar Modelo</Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium">Plano Educacional</h4>
                        <p className="text-sm text-gray-600 mt-2">Específico para instituições de ensino.</p>
                        <Button variant="text" className="mt-4">Aplicar Modelo</Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium">Modelo Fiscal Completo</h4>
                        <p className="text-sm text-gray-600 mt-2">Plano detalhado com contas fiscais.</p>
                        <Button variant="text" className="mt-4">Aplicar Modelo</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabItem>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal de criação/edição de conta */}
      <Dialog open={modalAberto} onClose={() => setModalAberto(false)}>
        <DialogTitle>
          {modoEdicao ? 'Editar Conta Contábil' : 'Nova Conta Contábil'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Código</label>
                <Input
                  value={contaAtual.codigo}
                  onChange={(e) => setContaAtual({...contaAtual, codigo: e.target.value})}
                  placeholder="Ex: 1.1.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <Select
                  value={contaAtual.tipo}
                  onChange={(e) => setContaAtual({...contaAtual, tipo: e.target.value})}
                >
                  <option value="ativo">Ativo</option>
                  <option value="passivo">Passivo</option>
                  <option value="patrimonio_liquido">Patrimônio Líquido</option>
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                  <option value="custo">Custo</option>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                value={contaAtual.nome}
                onChange={(e) => setContaAtual({...contaAtual, nome: e.target.value})}
                placeholder="Nome da conta"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Natureza</label>
                <Select
                  value={contaAtual.natureza}
                  onChange={(e) => setContaAtual({...contaAtual, natureza: e.target.value})}
                >
                  <option value="devedora">Devedora</option>
                  <option value="credora">Credora</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Analítica</label>
                <Select
                  value={contaAtual.analitica ? 'sim' : 'nao'}
                  onChange={(e) => setContaAtual({...contaAtual, analitica: e.target.value === 'sim'})}
                >
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Conta Pai</label>
              <Select
                value={contaAtual.contaPai || ''}
                onChange={(e) => setContaAtual({...contaAtual, contaPai: e.target.value || null})}
              >
                <option value="">Nenhuma (conta raiz)</option>
                {contas
                  .filter(conta => !conta.analitica && conta.id !== contaAtual.id)
                  .map(conta => (
                    <option key={conta.id} value={conta.id}>
                      {conta.codigo} - {conta.nome}
                    </option>
                  ))
                }
              </Select>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outline" onClick={() => setModalAberto(false)}>Cancelar</Button>
          <Button onClick={handleSalvarConta}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

/**
 * Função auxiliar para organizar contas em estrutura hierárquica
 */
function organizarContasHierarquicas(contas: ContaContabil[]) {
  const contasPorId: Record<string, any> = {};
  const raizes: any[] = [];

  // Primeiro passo: criar nós para todas as contas
  contas.forEach(conta => {
    contasPorId[conta.id] = {
      dados: conta,
      filhos: []
    };
  });

  // Segundo passo: organizar a hierarquia
  contas.forEach(conta => {
    if (conta.contaPai && contasPorId[conta.contaPai]) {
      contasPorId[conta.contaPai].filhos.push(contasPorId[conta.id]);
    } else {
      raizes.push(contasPorId[conta.id]);
    }
  });

  // Ordenar raízes por código
  raizes.sort((a, b) => a.dados.codigo.localeCompare(b.dados.codigo));
  
  // Ordenar filhos recursivamente
  const ordenarFilhos = (node: any) => {
    node.filhos.sort((a: any, b: any) => a.dados.codigo.localeCompare(b.dados.codigo));
    node.filhos.forEach(ordenarFilhos);
  };
  
  raizes.forEach(ordenarFilhos);
  
  return raizes;
}

export default PlanoContas; 