import { useState, useEffect } from 'react';
import { Lead, LeadScore } from '../../types/comunicacao';
import { useLeadScoring } from '../../hooks/useLeadScoring';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { ChartBarIcon, PlusIcon, RefreshIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface ScoreCardProps {
  lead: Lead;
  compact?: boolean;
}

export function ScoreCard({ lead, compact = false }: ScoreCardProps) {
  const [activeTab, setActiveTab] = useState('sumario');
  const { 
    scores, 
    totalScore, 
    isLoading, 
    error, 
    fetchScores, 
    scoreLeadByCriteria,
    getLeadScoreClassification 
  } = useLeadScoring(lead.id);

  useEffect(() => {
    if (lead.id) {
      fetchScores(lead.id);
    }
  }, [lead.id]);

  const handleAutomaticScoring = async () => {
    try {
      await scoreLeadByCriteria(lead);
      toast.success('Pontuação calculada automaticamente');
    } catch (error) {
      toast.error('Erro ao calcular pontuação');
      console.error('Erro ao pontuar lead:', error);
    }
  };

  // Agrupar pontuações por categoria
  const scoresByCategory = scores.reduce((acc, score) => {
    if (!acc[score.categoria]) {
      acc[score.categoria] = [];
    }
    acc[score.categoria].push(score);
    return acc;
  }, {} as Record<string, LeadScore[]>);

  // Calcular total por categoria
  const categoryTotals = Object.entries(scoresByCategory).map(([categoria, scoresArray]) => ({
    categoria,
    total: scoresArray.reduce((sum, score) => sum + score.valor, 0)
  }));

  // Determinar a classificação do lead com base na pontuação
  const scoreClassification = getLeadScoreClassification(totalScore);
  
  // Cores para classificação
  const classificationColors = {
    'Baixo potencial': 'bg-gray-100 text-gray-800',
    'Médio potencial': 'bg-blue-100 text-blue-800',
    'Alto potencial': 'bg-green-100 text-green-800',
    'Lead premium': 'bg-purple-100 text-purple-800'
  };

  if (isLoading && !scores.length) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-red-600">
        Erro ao carregar pontuações: {error.message}
      </Card>
    );
  }

  // Versão compacta (para cards e listagens)
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ChartBarIcon className="h-4 w-4 text-indigo-500 mr-1" />
            <span className="text-sm font-medium text-gray-700">Score</span>
          </div>
          <Badge className={classificationColors[scoreClassification as keyof typeof classificationColors]}>
            {totalScore} pts
          </Badge>
        </div>
        <Progress value={Math.min(totalScore, 100)} className="h-1" />
      </div>
    );
  }

  // Versão completa (para tela de detalhes)
  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <ChartBarIcon className="h-5 w-5 text-indigo-500 mr-2" />
          Pontuação do Lead
        </h3>
        <div className="flex justify-between items-center mt-2">
          <div>
            <div className="text-3xl font-bold">{totalScore}</div>
            <div className="text-sm text-gray-500">pontos</div>
          </div>
          <Badge 
            className={`text-sm ${classificationColors[scoreClassification as keyof typeof classificationColors]}`}
          >
            {scoreClassification}
          </Badge>
        </div>
        <Progress value={Math.min(totalScore, 100)} className="h-2 mt-2" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="sumario" className="flex-1">Sumário</TabsTrigger>
          <TabsTrigger value="detalhes" className="flex-1">Detalhes</TabsTrigger>
        </TabsList>

        <TabsContent value="sumario">
          <div className="space-y-3">
            {categoryTotals.map(({ categoria, total }) => (
              <div key={categoria} className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">{formatCategoria(categoria)}</div>
                  <Progress value={Math.min(total, 30)} max={30} className="h-1.5 mt-1 w-24" />
                </div>
                <div className="text-sm font-semibold">{total} pts</div>
              </div>
            ))}

            {!scores.length && (
              <div className="text-center py-3 text-gray-500 text-sm">
                Nenhuma pontuação registrada para este lead
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={handleAutomaticScoring}
              disabled={isLoading}
            >
              <RefreshIcon className="h-4 w-4 mr-1" />
              Calcular automaticamente
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="detalhes">
          <div className="space-y-4">
            {Object.entries(scoresByCategory).map(([categoria, scoresArray]) => (
              <div key={categoria}>
                <h4 className="text-sm font-medium mb-2">{formatCategoria(categoria)}</h4>
                <div className="space-y-2">
                  {scoresArray.map((score) => (
                    <div key={score.id} className="flex justify-between bg-gray-50 p-2 rounded">
                      <div>
                        <div className="text-sm font-medium">{score.nome}</div>
                        <div className="text-xs text-gray-500">{score.descricao}</div>
                      </div>
                      <div className="font-semibold text-sm">{score.valor > 0 ? `+${score.valor}` : score.valor}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {!scores.length && (
              <div className="text-center py-6 text-gray-500 text-sm">
                Nenhuma pontuação registrada para este lead
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// Função auxiliar para formatar nomes de categorias
function formatCategoria(categoria: string): string {
  const categoriaMap: Record<string, string> = {
    'DEMOGRAFICO': 'Demográfico',
    'COMPORTAMENTAL': 'Comportamental',
    'ENGAJAMENTO': 'Engajamento',
    'INTERESSE': 'Interesse',
    'INTERACAO': 'Interação'
  };
  
  return categoriaMap[categoria] || categoria;
} 