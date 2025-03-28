import { useRef, useEffect, useCallback } from 'react';
import { useConfig } from '../contexts/ConfigContext';

type NotificationType = 'message' | 'call' | 'callEnd';

interface UseNotificationSoundOptions {
  overrideEnabled?: boolean;
  overrideVolume?: number;
}

export function useNotificationSound({ 
  overrideEnabled,
  overrideVolume
}: UseNotificationSoundOptions = {}) {
  // Obter configurações do usuário
  const { config } = useConfig();
  
  // Usar configurações do usuário a menos que sejam explicitamente substituídas
  const enabled = overrideEnabled !== undefined ? overrideEnabled : config.soundEnabled;
  const volumeLevel = overrideVolume !== undefined ? overrideVolume : config.soundVolume;
  
  // Referências para os elementos de áudio
  const messageAudioRef = useRef<HTMLAudioElement | null>(null);
  const callAudioRef = useRef<HTMLAudioElement | null>(null);
  const callEndAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Carregar os sons quando o componente montar
  useEffect(() => {
    if (!enabled) return;
    
    // Caminhos para os arquivos de som
    const messageSoundPath = '/sounds/message.js';
    const callSoundPath = '/sounds/call.js';
    const callEndSoundPath = '/sounds/call-end.js';
    
    // Configurar elementos de áudio
    messageAudioRef.current = new Audio(messageSoundPath);
    callAudioRef.current = new Audio(callSoundPath);
    callEndAudioRef.current = new Audio(callEndSoundPath);
    
    // Configurar volume
    if (messageAudioRef.current) messageAudioRef.current.volume = volumeLevel;
    if (callAudioRef.current) callAudioRef.current.volume = volumeLevel;
    if (callEndAudioRef.current) callEndAudioRef.current.volume = volumeLevel;
    
    // Configurar loops para chamadas (continuar tocando até ser atendido)
    if (callAudioRef.current) callAudioRef.current.loop = true;
    
    // Cleanup ao desmontar
    return () => {
      if (messageAudioRef.current) {
        messageAudioRef.current.pause();
        messageAudioRef.current = null;
      }
      if (callAudioRef.current) {
        callAudioRef.current.pause();
        callAudioRef.current = null;
      }
      if (callEndAudioRef.current) {
        callEndAudioRef.current.pause();
        callEndAudioRef.current = null;
      }
    };
  }, [enabled, volumeLevel]);
  
  // Função para reproduzir um som específico
  const play = useCallback((type: NotificationType) => {
    if (!enabled) return;
    
    // Se o documento está oculto (usuário em outra aba), tocar o som
    const shouldPlay = document.hidden || type === 'callEnd';
    
    if (!shouldPlay) return;
    
    switch (type) {
      case 'message':
        if (messageAudioRef.current) {
          messageAudioRef.current.currentTime = 0;
          messageAudioRef.current.play().catch(err => 
            console.error('Erro ao tocar som de notificação:', err)
          );
        }
        break;
        
      case 'call':
        if (callAudioRef.current) {
          callAudioRef.current.currentTime = 0;
          callAudioRef.current.play().catch(err => 
            console.error('Erro ao tocar som de chamada:', err)
          );
        }
        break;
        
      case 'callEnd':
        if (callEndAudioRef.current) {
          callEndAudioRef.current.currentTime = 0;
          callEndAudioRef.current.play().catch(err => 
            console.error('Erro ao tocar som de fim de chamada:', err)
          );
        }
        break;
    }
  }, [enabled]);
  
  // Função para parar um som específico
  const stop = useCallback((type: NotificationType) => {
    switch (type) {
      case 'message':
        if (messageAudioRef.current) {
          messageAudioRef.current.pause();
          messageAudioRef.current.currentTime = 0;
        }
        break;
        
      case 'call':
        if (callAudioRef.current) {
          callAudioRef.current.pause();
          callAudioRef.current.currentTime = 0;
        }
        break;
        
      case 'callEnd':
        if (callEndAudioRef.current) {
          callEndAudioRef.current.pause();
          callEndAudioRef.current.currentTime = 0;
        }
        break;
    }
  }, []);
  
  return { play, stop };
} 