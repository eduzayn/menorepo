import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useVideoCall } from '../hooks/useVideoCall';

// Mock do supabase
vi.mock('../services/supabase', () => ({
  supabase: {
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      unsubscribe: vi.fn()
    })
  }
}));

// Mock do hook useAuth
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

// Mock da API de mídia do navegador
const mockMediaStream = {
  getTracks: vi.fn().mockReturnValue([
    { kind: 'video', stop: vi.fn(), enabled: true },
    { kind: 'audio', stop: vi.fn(), enabled: true }
  ]),
  getVideoTracks: vi.fn().mockReturnValue([
    { kind: 'video', stop: vi.fn(), enabled: true, addEventListener: vi.fn() }
  ]),
  getAudioTracks: vi.fn().mockReturnValue([
    { kind: 'audio', stop: vi.fn(), enabled: true }
  ])
};

const mockScreenStream = {
  getTracks: vi.fn().mockReturnValue([
    { kind: 'video', stop: vi.fn(), enabled: true }
  ]),
  getVideoTracks: vi.fn().mockReturnValue([
    { kind: 'video', stop: vi.fn(), enabled: true, addEventListener: vi.fn() }
  ]),
  getAudioTracks: vi.fn().mockReturnValue([])
};

// Mock da API navigator.mediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue(mockMediaStream),
    getDisplayMedia: vi.fn().mockResolvedValue(mockScreenStream)
  },
  writable: true
});

// Mock da RTCPeerConnection
const mockPeerConnection = {
  addTrack: vi.fn(),
  createDataChannel: vi.fn(),
  onicecandidate: null,
  ontrack: null,
  close: vi.fn(),
  getSenders: vi.fn().mockReturnValue([
    { track: { kind: 'video' }, replaceTrack: vi.fn().mockResolvedValue(undefined) }
  ]),
  createOffer: vi.fn().mockResolvedValue({ type: 'offer', sdp: 'test-sdp' }),
  setLocalDescription: vi.fn().mockResolvedValue(undefined),
  setRemoteDescription: vi.fn().mockResolvedValue(undefined),
  createAnswer: vi.fn().mockResolvedValue({ type: 'answer', sdp: 'test-sdp' })
};

globalThis.RTCPeerConnection = vi.fn().mockImplementation(() => mockPeerConnection);
globalThis.RTCSessionDescription = vi.fn().mockImplementation((desc) => desc);

describe('useVideoCall Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('deve inicializar com valores padrão', () => {
    const { result } = renderHook(() => useVideoCall({ conversaId: 'test-conversa' }));
    
    expect(result.current.localStream).toBeNull();
    expect(result.current.remoteStream).toBeNull();
    expect(result.current.isCallActive).toBe(false);
    expect(result.current.isCallIncoming).toBe(false);
    expect(result.current.isScreenSharing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.startCall).toBe('function');
    expect(typeof result.current.answerCall).toBe('function');
    expect(typeof result.current.endCall).toBe('function');
    expect(typeof result.current.startScreenShare).toBe('function');
    expect(typeof result.current.stopScreenShare).toBe('function');
  });

  test('deve iniciar uma chamada com sucesso', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useVideoCall({ conversaId: 'test-conversa' }));
    
    result.current.startCall('test-participant');
    await waitForNextUpdate();
    
    expect(result.current.isCallActive).toBe(true);
    expect(result.current.localStream).not.toBeNull();
    expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    expect(mockPeerConnection.addTrack).toHaveBeenCalled();
  });

  test('deve compartilhar a tela com sucesso', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useVideoCall({ conversaId: 'test-conversa' }));
    
    // Primeiro, inicia uma chamada
    result.current.startCall('test-participant');
    await waitForNextUpdate();
    
    // Depois, compartilha a tela
    result.current.startScreenShare();
    await waitForNextUpdate();
    
    expect(result.current.isScreenSharing).toBe(true);
    expect(global.navigator.mediaDevices.getDisplayMedia).toHaveBeenCalled();
    
    // Verifica se a trilha foi substituída
    const senders = mockPeerConnection.getSenders();
    expect(senders[0].replaceTrack).toHaveBeenCalled();
  });

  test('deve parar o compartilhamento de tela', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useVideoCall({ conversaId: 'test-conversa' }));
    
    // Inicia uma chamada
    result.current.startCall('test-participant');
    await waitForNextUpdate();
    
    // Compartilha a tela
    result.current.startScreenShare();
    await waitForNextUpdate();
    
    // Para o compartilhamento
    result.current.stopScreenShare();
    
    expect(result.current.isScreenSharing).toBe(false);
    
    // Verifica se a trilha foi substituída de volta
    const senders = mockPeerConnection.getSenders();
    expect(senders[0].replaceTrack).toHaveBeenCalledTimes(2);
  });

  test('deve lidar com o erro quando o navegador não suporta compartilhamento de tela', async () => {
    // Remove temporariamente getDisplayMedia para simular navegadores sem suporte
    const originalGetDisplayMedia = global.navigator.mediaDevices.getDisplayMedia;
    global.navigator.mediaDevices.getDisplayMedia = undefined;
    
    const { result, waitForNextUpdate } = renderHook(() => useVideoCall({ conversaId: 'test-conversa' }));
    
    // Primeiro, inicia uma chamada
    result.current.startCall('test-participant');
    await waitForNextUpdate();
    
    // Tenta compartilhar a tela
    try {
      result.current.startScreenShare();
      await waitForNextUpdate();
    } catch (e) {
      // Esperado falhar
    }
    
    expect(result.current.isScreenSharing).toBe(false);
    expect(result.current.error).not.toBeNull();
    expect(result.current.error.message).toBe('Seu navegador não suporta compartilhamento de tela');
    
    // Restaura getDisplayMedia
    global.navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
  });

  test('deve encerrar a chamada e limpar os recursos', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useVideoCall({ conversaId: 'test-conversa' }));
    
    // Inicia uma chamada
    result.current.startCall('test-participant');
    await waitForNextUpdate();
    
    // Compartilha a tela
    result.current.startScreenShare();
    await waitForNextUpdate();
    
    // Encerra a chamada
    result.current.endCall();
    
    expect(result.current.isCallActive).toBe(false);
    expect(result.current.isScreenSharing).toBe(false);
    expect(result.current.localStream).toBeNull();
    expect(result.current.remoteStream).toBeNull();
    expect(mockPeerConnection.close).toHaveBeenCalled();
  });
}); 