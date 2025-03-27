import { useState, useEffect } from 'react';
import { useIA } from '../../contexts/IAContext';
import { Icons } from '../ui/icons';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export function IAConfig() {
  const {
    iaAtiva,
    setIaAtiva,
    modoAutomatico,
    setModoAutomatico,
    nivelConfianca,
    setNivelConfianca,
    carregando,
    salvarConfiguracoes,
  } = useIA();

  const [localNivelConfianca, setLocalNivelConfianca] = useState(nivelConfianca);
  const [configuracaoSalva, setConfiguracaoSalva] = useState(true);

  // Sincronizar estados locais com o contexto
  useEffect(() => {
    setLocalNivelConfianca(nivelConfianca);
  }, [nivelConfianca]);

  // Detectar mudanças na configuração
  useEffect(() => {
    setConfiguracaoSalva(false);
  }, [iaAtiva, modoAutomatico, localNivelConfianca]);

  const handleSalvar = async () => {
    // Atualizar o valor de nível de confiança no contexto
    setNivelConfianca(localNivelConfianca);
    
    // Salvar configurações
    await salvarConfiguracoes();
    setConfiguracaoSalva(true);
    toast.success('Configurações de IA salvas com sucesso');
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">Assistente de IA</h3>
          <p className="text-sm text-gray-500">
            Configure como o assistente virtual deve funcionar durante os atendimentos
          </p>
        </div>
        {!carregando && !configuracaoSalva && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSalvar}
            className="text-sm"
          >
            <Icons.check className="h-4 w-4 mr-1" />
            Salvar alterações
          </Button>
        )}
      </div>

      {carregando ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Ativar/desativar IA */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Ativar assistente de IA</Label>
              <p className="text-sm text-gray-500">
                Habilita sugestões automáticas e respostas durante atendimentos
              </p>
            </div>
            <Switch
              checked={iaAtiva}
              onCheckedChange={setIaAtiva}
            />
          </div>

          {/* Modo automático */}
          <div className={`flex items-center justify-between ${!iaAtiva ? 'opacity-50' : ''}`}>
            <div className="space-y-0.5">
              <Label className="text-base">Modo automático</Label>
              <p className="text-sm text-gray-500">
                Permite que a IA responda automaticamente mensagens simples
              </p>
            </div>
            <Switch
              checked={modoAutomatico}
              onCheckedChange={setModoAutomatico}
              disabled={!iaAtiva}
            />
          </div>

          {/* Nível de confiança */}
          <div className={`space-y-2 ${!iaAtiva || !modoAutomatico ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <Label className="text-base">Nível de confiança para respostas automáticas</Label>
              <span className="text-sm text-gray-500">{localNivelConfianca}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Baixo</span>
              <input
                type="range"
                min="50"
                max="95"
                value={localNivelConfianca}
                onChange={(e) => setLocalNivelConfianca(Number(e.target.value))}
                disabled={!iaAtiva || !modoAutomatico}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500">Alto</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Um nível mais alto exige maior certeza da IA antes de responder automaticamente
            </p>
          </div>

          {/* Alerta sobre modo automático */}
          {iaAtiva && modoAutomatico && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Icons.bell className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No modo automático, o assistente responderá mensagens com confiança acima de {localNivelConfianca}% 
                    sem intervenção humana. Use com cautela em atendimentos sensíveis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
} 