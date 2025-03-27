import { useState, useEffect } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { useNotificationSound } from '../../hooks/useNotificationSound';
import { Icons } from '../ui/icons';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export function SoundSettings() {
  const { config, updateConfig } = useConfig();
  const { play } = useNotificationSound();
  const [volume, setVolume] = useState(config.soundVolume * 100);

  // Atualizar o volume local quando as configurações mudam
  useEffect(() => {
    setVolume(config.soundVolume * 100);
  }, [config.soundVolume]);

  // Atualizar as configurações quando o volume mudar
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  // Salvar o volume quando o usuário parar de arrastar o slider
  const handleVolumeCommit = () => {
    updateConfig({ soundVolume: volume / 100 });
  };

  // Alternar as notificações sonoras
  const toggleSoundEnabled = () => {
    updateConfig({ soundEnabled: !config.soundEnabled });
  };

  // Tocar um som de exemplo para testar o volume
  const playTestSound = () => {
    play('message');
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Configurações de Som</h3>
      
      <div className="space-y-6">
        {/* Habilitar/desabilitar sons */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Notificações sonoras</Label>
            <p className="text-sm text-gray-500">
              Ative para ouvir sons ao receber mensagens e chamadas
            </p>
          </div>
          <Switch
            checked={config.soundEnabled}
            onCheckedChange={toggleSoundEnabled}
          />
        </div>
        
        {/* Controle de volume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base">Volume</Label>
            <span className="text-sm text-gray-500">{volume}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icons.mic className="h-4 w-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              onMouseUp={handleVolumeCommit}
              onTouchEnd={handleVolumeCommit}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={!config.soundEnabled}
            />
            <Icons.bell className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        {/* Botão de teste */}
        <Button
          variant="outline"
          size="sm"
          onClick={playTestSound}
          disabled={!config.soundEnabled}
          className="mt-2"
        >
          <Icons.bell className="h-4 w-4 mr-2" />
          <span>Testar som</span>
        </Button>
      </div>
    </Card>
  );
} 