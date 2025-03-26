import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, ChevronRight, ChevronDown, BrainCircuit, Info } from 'lucide-react';
import { AISuggestion } from '@/ai/suggestion-engine';

interface BlockInfo {
  type: string;
  content: string;
  title?: string;
}

interface SuggestionPanelProps {
  title?: string;
  description?: string;
  currentBlocks: BlockInfo[];
  topic?: string;
  educationLevel?: string;
  onSuggestionSelect: (suggestion: AISuggestion) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

// Mock de sugestões de IA para demonstração
const MOCK_SUGGESTIONS: AISuggestion[] = [
  {
    type: 'text',
    blockType: 'text',
    title: 'Introdução à Inteligência Artificial',
    confidence: 0.92,
    preview: "A inteligência artificial (IA) é um campo da ciência da computação que busca desenvolver sistemas capazes de realizar tarefas que normalmente exigiriam inteligência humana.",
    reasoning: "Sugerido com base no título do material que menciona IA.",
    content: "A inteligência artificial (IA) é um campo da ciência da computação que busca desenvolver sistemas capazes de realizar tarefas que normalmente exigiriam inteligência humana."
  },
  {
    type: 'block',
    blockType: 'video',
    title: 'Vídeo: Principais aplicações de IA',
    confidence: 0.85,
    preview: "Um vídeo introdutório sobre as aplicações modernas de IA em diversas áreas.",
    reasoning: "Vídeos ajudam a engajar estudantes visuais.",
    content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    type: 'block',
    blockType: 'quiz',
    title: 'Quiz de verificação de aprendizado',
    confidence: 0.78,
    preview: "Teste seu conhecimento com este quiz rápido sobre os conceitos fundamentais de IA.",
    reasoning: "Quizzes ajudam a consolidar o aprendizado.",
    content: "Teste seu conhecimento com este quiz rápido sobre os conceitos fundamentais de IA."
  }
];

export function SuggestionPanel({
  title,
  description,
  currentBlocks,
  topic,
  educationLevel,
  onSuggestionSelect,
  isMinimized,
  onToggleMinimize
}: SuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  // Efeito para simular carregamento de sugestões
  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoading(true);
      // Simulando uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuggestions(MOCK_SUGGESTIONS);
      setIsLoading(false);
    };

    loadSuggestions();
  }, [title, currentBlocks.length]);

  const toggleSuggestion = (id: string) => {
    if (expandedSuggestion === id) {
      setExpandedSuggestion(null);
    } else {
      setExpandedSuggestion(id);
    }
  };

  if (isMinimized) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <Button 
          variant="outline" 
          onClick={onToggleMinimize}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
            Sugestões de IA
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-gray-50 overflow-hidden">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold flex items-center">
            <BrainCircuit className="h-5 w-5 mr-2 text-purple-600" />
            Sugestões de IA
          </h3>
          <Button variant="ghost" size="sm" onClick={onToggleMinimize}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Sugestões personalizadas para enriquecer seu material didático
        </p>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-2" />
            <p className="text-sm text-gray-500">Gerando sugestões inteligentes...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="border rounded-md overflow-hidden bg-white"
              >
                <div 
                  className="p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-start"
                  onClick={() => toggleSuggestion(`${index}`)}
                >
                  <div>
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {suggestion.blockType} • {Math.round(suggestion.confidence * 100)}% confiança
                    </p>
                  </div>
                  {expandedSuggestion === `${index}` ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                {expandedSuggestion === `${index}` && (
                  <div className="px-3 pb-3 pt-0">
                    <div className="mb-3 text-sm bg-gray-50 p-2 rounded border text-gray-700">
                      {suggestion.preview}
                    </div>
                    
                    <div className="flex items-start mb-3 text-xs text-gray-500">
                      <Info className="h-3 w-3 mr-1 mt-0.5" />
                      <div>{suggestion.reasoning}</div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-1"
                      onClick={() => onSuggestionSelect(suggestion)}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Aplicar sugestão
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 