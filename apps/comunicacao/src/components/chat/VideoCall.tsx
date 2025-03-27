import React, { useRef, useEffect, useState } from 'react';
import { useVideoCall } from '../../hooks/useVideoCall';
import { useNotificationSound } from '../../hooks/useNotificationSound';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Icons } from '../ui/icons';
import { toast } from 'sonner';

interface VideoCallProps {
  conversaId: string;
  participanteId: string;
  onClose: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ conversaId, participanteId, onClose }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { play, stop } = useNotificationSound();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  
  const {
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
  } = useVideoCall({ conversaId });

  // Configura os streams de vídeo quando disponíveis
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
    
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  // Reproduz som quando há uma chamada recebida
  useEffect(() => {
    if (isCallIncoming) {
      play('call');
    } else {
      stop('call');
    }
  }, [isCallIncoming, play, stop]);

  // Inicia a chamada automaticamente quando o componente é montado, a menos que seja uma chamada recebida
  useEffect(() => {
    if (!isCallActive && !isCallIncoming) {
      startCall(participanteId).catch(err => {
        console.error('Erro ao iniciar chamada:', err);
      });
    }
  }, []);

  // Manipula erros
  useEffect(() => {
    if (error) {
      console.error('Erro na chamada de vídeo:', error);
    }
  }, [error]);

  // Encerra a chamada quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (isCallActive) {
        endCall();
      }
      // Garante que qualquer som de chamada seja interrompido
      stop('call');
    };
  }, [isCallActive, endCall, stop]);

  // Função de encerramento que também toca o som de fim de chamada
  const handleEndCall = () => {
    play('callEnd');
    endCall();
    onClose();
  };

  // Manipula o compartilhamento de tela
  const handleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        stopScreenShare();
        toast.success('Compartilhamento de tela finalizado');
      } else {
        await startScreenShare();
        toast.success('Compartilhando tela');
      }
    } catch (err) {
      console.error('Erro no compartilhamento de tela:', err);
      toast.error('Não foi possível compartilhar a tela');
    }
  };

  // Manipula o estado do microfone
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Manipula o estado da câmera
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Renderiza diferente baseado no estado da chamada
  const renderCallContent = () => {
    if (isCallIncoming) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <h3 className="text-lg font-semibold mb-4">Chamada recebida</h3>
          <div className="flex space-x-4">
            <Button 
              variant="default" 
              onClick={() => {
                stop('call'); // Para o som de chamada
                answerCall();
              }}
              className="flex items-center bg-green-500 hover:bg-green-600"
            >
              <Icons.phone className="mr-2 h-4 w-4" /> Atender
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                stop('call'); // Para o som de chamada
                play('callEnd'); // Toca som de fim de chamada
                endCall();
                onClose();
              }}
              className="flex items-center"
            >
              <Icons.phoneOff className="mr-2 h-4 w-4" /> Recusar
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 relative">
          {/* Vídeo remoto (tela principal) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover rounded-t-lg ${!remoteStream ? 'hidden' : ''}`}
          />
          
          {!remoteStream && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-t-lg">
              <div className="text-white">Aguardando conexão...</div>
            </div>
          )}
          
          {/* Vídeo local (pequeno no canto) */}
          <div className="absolute bottom-4 right-4 w-1/4 h-1/4 border-2 border-white rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {isScreenSharing && (
              <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-sm">
                Compartilhando
              </div>
            )}
          </div>
        </div>
        
        {/* Controles */}
        <div className="p-4 bg-gray-100 rounded-b-lg flex items-center justify-center space-x-4">
          <Button
            variant="destructive"
            onClick={handleEndCall}
            className="rounded-full p-3"
            title="Encerrar chamada"
          >
            <Icons.phoneOff className="h-5 w-5" />
          </Button>
          
          <Button
            variant="secondary"
            onClick={toggleAudio}
            className={`rounded-full p-3 ${!audioEnabled ? 'bg-red-100' : ''}`}
            title={audioEnabled ? "Desativar microfone" : "Ativar microfone"}
          >
            {audioEnabled ? 
              <Icons.mic className="h-5 w-5" /> : 
              <Icons.micOff className="h-5 w-5" />
            }
          </Button>
          
          <Button
            variant="secondary"
            onClick={toggleVideo}
            className={`rounded-full p-3 ${!videoEnabled ? 'bg-red-100' : ''}`}
            title={videoEnabled ? "Desativar câmera" : "Ativar câmera"}
          >
            {videoEnabled ? 
              <Icons.camera className="h-5 w-5" /> : 
              <Icons.cameraOff className="h-5 w-5" />
            }
          </Button>

          <Button
            variant="secondary"
            onClick={handleScreenShare}
            className={`rounded-full p-3 ${isScreenSharing ? 'bg-green-100' : ''}`}
            title={isScreenSharing ? "Parar compartilhamento" : "Compartilhar tela"}
            disabled={!isCallActive}
          >
            {isScreenSharing ? 
              <Icons.monitorOff className="h-5 w-5" /> : 
              <Icons.monitor className="h-5 w-5" />
            }
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      {renderCallContent()}
    </Card>
  );
}; 