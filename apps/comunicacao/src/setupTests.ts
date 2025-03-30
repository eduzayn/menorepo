// Importação da configuração central de testes
import '@edunexia/test-config/setup';

// Configurações específicas para o módulo de comunicação, se necessário

// Mock para navegador Web RTC
import { vi } from 'vitest';

// Mock de MediaStream e RTCPeerConnection para testes de chamadas de vídeo
const mockMediaStream = {
  getTracks: vi.fn().mockReturnValue([
    { kind: 'video', stop: vi.fn(), enabled: true },
    { kind: 'audio', stop: vi.fn(), enabled: true }
  ])
};

globalThis.MediaStream = vi.fn().mockImplementation(() => mockMediaStream); 