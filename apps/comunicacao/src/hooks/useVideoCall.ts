import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';

interface PeerConnection {
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
}

interface UseVideoCallOptions {
  conversaId?: string;
}

interface UseVideoCallResult {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCallActive: boolean;
  isCallIncoming: boolean;
  isScreenSharing: boolean;
  startCall: (participanteId: string) => Promise<void>;
  answerCall: () => Promise<void>;
  endCall: () => void;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => void;
  error: Error | null;
}

// Configuração de STUN servers para o WebRTC
const rtcConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export function useVideoCall({ conversaId }: UseVideoCallOptions = {}): UseVideoCallResult {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isCallIncoming, setIsCallIncoming] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [callParticipanteId, setCallParticipanteId] = useState<string | null>(null);

  const peerConnection = useRef<PeerConnection | null>(null);
  const screenStream = useRef<MediaStream | null>(null);
  const originalVideoSender = useRef<RTCRtpSender | null>(null);

  // Inicializa o WebRTC e os listeners
  useEffect(() => {
    if (!conversaId || !user) return;

    // Canal para sinalização de chamadas
    const channel = supabase
      .channel(`videocall:${conversaId}`)
      .on('broadcast', { event: 'offer' }, ({ payload }) => {
        if (payload.senderId !== user.id) {
          // Recebeu uma oferta de chamada
          setIsCallIncoming(true);
          setCallParticipanteId(payload.senderId);
          
          // Salva a oferta para ser usada quando responder a chamada
          sessionStorage.setItem('rtcOffer', JSON.stringify(payload.offer));
        }
      })
      .on('broadcast', { event: 'answer' }, async ({ payload }) => {
        if (payload.receiverId === user.id && peerConnection.current) {
          // Recebeu uma resposta para a oferta
          try {
            const answer = payload.answer;
            await peerConnection.current.connection.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro ao processar resposta de chamada'));
          }
        }
      })
      .on('broadcast', { event: 'ice-candidate' }, ({ payload }) => {
        if (payload.targetId === user.id && peerConnection.current && peerConnection.current.connection.remoteDescription) {
          // Recebeu um ICE candidate
          try {
            peerConnection.current.connection.addIceCandidate(
              new RTCIceCandidate(payload.candidate)
            );
          } catch (err) {
            setError(err instanceof Error ? err : new Error('Erro ao adicionar ICE candidate'));
          }
        }
      })
      .on('broadcast', { event: 'end-call' }, ({ payload }) => {
        if (payload.targetId === user.id || payload.senderId === callParticipanteId) {
          // A outra parte encerrou a chamada
          endCall();
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
      // Limpar a chamada se estiver ativa quando o componente for desmontado
      if (isCallActive) {
        endCall();
      }
    };
  }, [conversaId, user]);

  // Inicia uma chamada
  const startCall = useCallback(async (participanteId: string): Promise<void> => {
    if (!conversaId || !user) {
      throw new Error('Usuário ou conversa não definida');
    }

    try {
      // Obtém acesso à mídia local
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      // Cria a conexão WebRTC
      const pc = new RTCPeerConnection(rtcConfiguration);
      
      // Adiciona as trilhas locais à conexão
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Configura um canal de dados
      const dataChannel = pc.createDataChannel('chat');
      
      // Manipula eventos do peer connection
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          // Envia os ICE candidates para o outro peer
          supabase.channel(`videocall:${conversaId}`).send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: {
              senderId: user.id,
              targetId: participanteId,
              candidate,
            },
          });
        }
      };

      pc.ontrack = (event) => {
        // Recebeu trilhas de mídia remotas
        setRemoteStream(new MediaStream(event.streams[0].getTracks()));
      };

      // Armazena a conexão
      peerConnection.current = { connection: pc, dataChannel };
      
      // Cria uma oferta
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Envia a oferta para o outro peer
      supabase.channel(`videocall:${conversaId}`).send({
        type: 'broadcast',
        event: 'offer',
        payload: {
          senderId: user.id,
          receiverId: participanteId,
          offer,
        },
      });

      setIsCallActive(true);
      setCallParticipanteId(participanteId);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao iniciar chamada de vídeo'));
      throw err;
    }
  }, [conversaId, user]);

  // Responde a uma chamada
  const answerCall = useCallback(async (): Promise<void> => {
    if (!conversaId || !user || !callParticipanteId) {
      throw new Error('Dados de chamada incompletos');
    }

    try {
      // Recupera a oferta
      const offerJson = sessionStorage.getItem('rtcOffer');
      if (!offerJson) {
        throw new Error('Oferta de chamada não encontrada');
      }
      const offer = JSON.parse(offerJson);

      // Obtém acesso à mídia local
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      // Cria a conexão WebRTC
      const pc = new RTCPeerConnection(rtcConfiguration);
      
      // Adiciona as trilhas locais à conexão
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Manipula eventos do peer connection
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          // Envia os ICE candidates para o outro peer
          supabase.channel(`videocall:${conversaId}`).send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: {
              senderId: user.id,
              targetId: callParticipanteId,
              candidate,
            },
          });
        }
      };

      pc.ontrack = (event) => {
        // Recebeu trilhas de mídia remotas
        setRemoteStream(new MediaStream(event.streams[0].getTracks()));
      };

      // Armazena a conexão
      peerConnection.current = { connection: pc };
      
      // Define a oferta remota e cria uma resposta
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Envia a resposta para o outro peer
      supabase.channel(`videocall:${conversaId}`).send({
        type: 'broadcast',
        event: 'answer',
        payload: {
          senderId: user.id,
          receiverId: callParticipanteId,
          answer,
        },
      });

      setIsCallActive(true);
      setIsCallIncoming(false);
      sessionStorage.removeItem('rtcOffer');

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao responder chamada de vídeo'));
      throw err;
    }
  }, [conversaId, user, callParticipanteId]);

  // Inicia o compartilhamento de tela
  const startScreenShare = useCallback(async (): Promise<void> => {
    if (!peerConnection.current || !localStream) {
      throw new Error('Chamada não está ativa');
    }

    try {
      // Verifica se o navegador suporta compartilhamento de tela
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Seu navegador não suporta compartilhamento de tela');
      }

      // Captura o stream da tela
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      // Verifica se o usuário cancelou a seleção
      if (!stream || stream.getVideoTracks().length === 0) {
        throw new Error('Seleção de tela cancelada');
      }

      // Salva o stream da tela
      screenStream.current = stream;

      // Encontra o sender de vídeo atual
      const videoSender = peerConnection.current.connection.getSenders().find(
        sender => sender.track?.kind === 'video'
      );

      if (videoSender) {
        // Salva o sender original para restaurar mais tarde
        originalVideoSender.current = videoSender;
        
        // Obtém a trilha de vídeo da tela
        const screenTrack = stream.getVideoTracks()[0];
        
        if (!screenTrack) {
          throw new Error('Nenhuma trilha de vídeo disponível no compartilhamento de tela');
        }
        
        // Configura tratamento para quando o usuário parar o compartilhamento pelo navegador
        screenTrack.addEventListener('ended', () => {
          console.log('Usuário encerrou o compartilhamento de tela pelo navegador');
          stopScreenShare();
        });
        
        // Substitui a trilha de vídeo pelo stream da tela
        await videoSender.replaceTrack(screenTrack);

        // Atualiza o stream local para mostrar a tela sendo compartilhada
        const newLocalStream = new MediaStream([
          ...localStream.getAudioTracks(),
          screenTrack
        ]);
        setLocalStream(newLocalStream);

        setIsScreenSharing(true);
      } else {
        throw new Error('Não foi possível encontrar o emissor de vídeo');
      }
    } catch (err) {
      // Para todas as trilhas se houver falha
      if (screenStream.current) {
        screenStream.current.getTracks().forEach(track => track.stop());
        screenStream.current = null;
      }
      
      if (err instanceof Error) {
        // Não considera como erro quando o usuário cancela a seleção
        if (err.name === 'NotAllowedError' || err.message === 'Seleção de tela cancelada') {
          console.log('Usuário cancelou o compartilhamento de tela');
          return; // Retorna silenciosamente sem gerar erro
        }
        setError(err);
      } else {
        setError(new Error('Erro ao compartilhar tela'));
      }
      throw err;
    }
  }, [localStream]);

  // Para o compartilhamento de tela
  const stopScreenShare = useCallback(() => {
    if (!peerConnection.current || !localStream) {
      return;
    }

    try {
      // Interrompe as trilhas do stream de tela
      if (screenStream.current) {
        screenStream.current.getTracks().forEach(track => track.stop());
        screenStream.current = null;
      }

      // Encontra o sender de vídeo atual
      const videoSender = peerConnection.current.connection.getSenders().find(
        sender => sender.track?.kind === 'video'
      );

      // Restaura a trilha de vídeo original da câmera
      if (videoSender && originalVideoSender.current && originalVideoSender.current.track) {
        // Obtém a trilha original da câmera
        const originalVideoTrack = originalVideoSender.current.track;
        
        // Substitui de volta pela trilha da câmera
        videoSender.replaceTrack(originalVideoTrack).catch(err => {
          console.error('Erro ao restaurar vídeo da câmera:', err);
        });
        
        // Atualiza o stream local para mostrar a câmera novamente
        const newLocalStream = new MediaStream([
          ...localStream.getAudioTracks(),
          originalVideoTrack
        ]);
        setLocalStream(newLocalStream);
      } else {
        // Se não conseguir restaurar a trilha original, tenta obter novo stream da câmera
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then(stream => {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoSender && videoTrack) {
              videoSender.replaceTrack(videoTrack);
              
              // Atualiza o stream local
              const newLocalStream = new MediaStream([
                ...localStream.getAudioTracks(),
                videoTrack
              ]);
              setLocalStream(newLocalStream);
            }
          })
          .catch(err => {
            console.error('Erro ao recuperar vídeo da câmera:', err);
          });
      }

      setIsScreenSharing(false);
    } catch (err) {
      console.error('Erro ao parar compartilhamento de tela:', err);
      setError(err instanceof Error ? err : new Error('Erro ao parar compartilhamento de tela'));
    }
  }, [localStream]);

  // Encerra a chamada
  const endCall = useCallback(() => {
    // Se estiver compartilhando tela, pare
    if (isScreenSharing) {
      stopScreenShare();
    }

    // Notifica o outro peer que a chamada foi encerrada
    if (conversaId && user && callParticipanteId) {
      supabase.channel(`videocall:${conversaId}`).send({
        type: 'broadcast',
        event: 'end-call',
        payload: {
          senderId: user.id,
          targetId: callParticipanteId,
        },
      });
    }

    // Libera os recursos
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    if (peerConnection.current) {
      peerConnection.current.connection.close();
      peerConnection.current = null;
    }

    setIsCallActive(false);
    setIsCallIncoming(false);
    setCallParticipanteId(null);
    sessionStorage.removeItem('rtcOffer');
  }, [conversaId, user, callParticipanteId, localStream, remoteStream, isScreenSharing]);

  return {
    localStream,
    remoteStream,
    isCallActive,
    isCallIncoming,
    isScreenSharing,
    startCall,
    answerCall,
    endCall,
    startScreenShare,
    stopScreenShare,
    error,
  };
} 