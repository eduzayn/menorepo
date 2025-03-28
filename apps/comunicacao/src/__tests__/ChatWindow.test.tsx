import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ChatWindow } from '../components/ChatWindow';
import { Conversa, Mensagem } from '../types/comunicacao';

// Mock para os componentes dependentes
vi.mock('../components/chat/VideoCall', () => ({
  VideoCall: () => <div data-testid="video-call">Video Call Mocked</div>
}));

// Mock para date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: () => 'há 5 minutos'
}));

vi.mock('date-fns/locale', () => ({
  ptBR: {}
}));

describe('ChatWindow', () => {
  // Mock dos dados
  const mockConversa: Conversa = {
    id: 'conv-1',
    titulo: 'Conversa Teste',
    participantes: [
      { id: 'user-1', nome: 'Usuário 1' },
      { id: 'user-2', nome: 'Usuário 2' }
    ],
    status: 'ATIVO',
    digitando: null,
    nao_lidas: 0,
    ultima_mensagem: { id: 'msg-1', conteudo: 'Olá', criado_at: new Date().toISOString() },
    criado_at: new Date().toISOString(),
    atualizado_at: new Date().toISOString(),
    usuario_id: 'user-1'
  };

  const mockMensagens: Mensagem[] = [
    {
      id: 'msg-1',
      conversa_id: 'conv-1',
      remetente_id: 'user-1',
      conteudo: 'Olá, tudo bem?',
      lida: true,
      criado_at: new Date().toISOString()
    },
    {
      id: 'msg-2',
      conversa_id: 'conv-1',
      remetente_id: 'user-2',
      conteudo: 'Tudo bem e você?',
      lida: false,
      criado_at: new Date().toISOString()
    }
  ];

  // Mock das funções
  const mockOnEnviarMensagem = vi.fn();
  const mockOnMarcarComoLida = vi.fn();
  const mockOnIndicarDigitando = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o cabeçalho com o título da conversa', () => {
    render(
      <ChatWindow
        conversa={mockConversa}
        mensagens={mockMensagens}
        onEnviarMensagem={mockOnEnviarMensagem}
        onMarcarComoLida={mockOnMarcarComoLida}
        onIndicarDigitando={mockOnIndicarDigitando}
      />
    );

    expect(screen.getByText('Conversa Teste')).toBeInTheDocument();
    expect(screen.getByText('2 participantes')).toBeInTheDocument();
    expect(screen.getByText('ATIVO')).toBeInTheDocument();
  });

  it('deve exibir as mensagens da conversa', () => {
    render(
      <ChatWindow
        conversa={mockConversa}
        mensagens={mockMensagens}
        onEnviarMensagem={mockOnEnviarMensagem}
        onMarcarComoLida={mockOnMarcarComoLida}
        onIndicarDigitando={mockOnIndicarDigitando}
      />
    );

    expect(screen.getByText('Olá, tudo bem?')).toBeInTheDocument();
    expect(screen.getByText('Tudo bem e você?')).toBeInTheDocument();
  });

  it('deve chamar onMarcarComoLida quando a conversa é selecionada', () => {
    render(
      <ChatWindow
        conversa={mockConversa}
        mensagens={mockMensagens}
        onEnviarMensagem={mockOnEnviarMensagem}
        onMarcarComoLida={mockOnMarcarComoLida}
        onIndicarDigitando={mockOnIndicarDigitando}
      />
    );

    expect(mockOnMarcarComoLida).toHaveBeenCalledTimes(1);
  });

  it('deve enviar mensagem quando o formulário é submetido', () => {
    render(
      <ChatWindow
        conversa={mockConversa}
        mensagens={mockMensagens}
        onEnviarMensagem={mockOnEnviarMensagem}
        onMarcarComoLida={mockOnMarcarComoLida}
        onIndicarDigitando={mockOnIndicarDigitando}
      />
    );

    const inputElement = screen.getByPlaceholderText('Digite sua mensagem...');
    fireEvent.change(inputElement, { target: { value: 'Nova mensagem de teste' } });
    
    const formElement = inputElement.closest('form');
    fireEvent.submit(formElement!);

    expect(mockOnEnviarMensagem).toHaveBeenCalledWith('Nova mensagem de teste');
    expect(inputElement).toHaveValue('');
  });

  it('deve indicar digitando quando o usuário está digitando', () => {
    render(
      <ChatWindow
        conversa={mockConversa}
        mensagens={mockMensagens}
        onEnviarMensagem={mockOnEnviarMensagem}
        onMarcarComoLida={mockOnMarcarComoLida}
        onIndicarDigitando={mockOnIndicarDigitando}
      />
    );

    const inputElement = screen.getByPlaceholderText('Digite sua mensagem...');
    fireEvent.change(inputElement, { target: { value: 'Digitando...' } });

    expect(mockOnIndicarDigitando).toHaveBeenCalledWith(true);

    fireEvent.blur(inputElement);

    expect(mockOnIndicarDigitando).toHaveBeenCalledWith(false);
  });

  it('não deve enviar mensagem quando o campo está vazio', () => {
    render(
      <ChatWindow
        conversa={mockConversa}
        mensagens={mockMensagens}
        onEnviarMensagem={mockOnEnviarMensagem}
        onMarcarComoLida={mockOnMarcarComoLida}
        onIndicarDigitando={mockOnIndicarDigitando}
      />
    );

    const formElement = screen.getByPlaceholderText('Digite sua mensagem...').closest('form');
    fireEvent.submit(formElement!);

    expect(mockOnEnviarMensagem).not.toHaveBeenCalled();
  });

  it('deve exibir o componente VideoCall quando o botão de chamada é clicado', () => {
    render(
      <ChatWindow
        conversa={mockConversa}
        mensagens={mockMensagens}
        onEnviarMensagem={mockOnEnviarMensagem}
        onMarcarComoLida={mockOnMarcarComoLida}
        onIndicarDigitando={mockOnIndicarDigitando}
      />
    );

    const buttonChamada = screen.getByText('Chamada');
    fireEvent.click(buttonChamada);

    expect(screen.getByTestId('video-call')).toBeInTheDocument();
  });

  it('deve mostrar indicador de digitação quando alguém está digitando', () => {
    const conversaComDigitacao = {
      ...mockConversa,
      digitando: 'user-2'
    };

    render(
      <ChatWindow
        conversa={conversaComDigitacao}
        mensagens={mockMensagens}
        onEnviarMensagem={mockOnEnviarMensagem}
        onMarcarComoLida={mockOnMarcarComoLida}
        onIndicarDigitando={mockOnIndicarDigitando}
      />
    );

    expect(screen.getByText('Usuário 2 está digitando...')).toBeInTheDocument();
  });
}); 