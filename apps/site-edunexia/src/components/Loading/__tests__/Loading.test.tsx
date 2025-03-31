import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../index';

describe('Loading', () => {
  it('renderiza corretamente com valores padrão', () => {
    render(<Loading />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('w-8', 'h-8', 'text-primary-500');
  });

  it('renderiza com mensagem personalizada', () => {
    render(<Loading message="Processando dados..." />);

    expect(screen.getByText('Processando dados...')).toBeInTheDocument();
  });

  it('renderiza com tamanho pequeno', () => {
    render(<Loading size="sm" />);

    expect(screen.getByRole('status')).toHaveClass('w-4', 'h-4');
  });

  it('renderiza com tamanho grande', () => {
    render(<Loading size="lg" />);

    expect(screen.getByRole('status')).toHaveClass('w-12', 'h-12');
  });

  it('renderiza com cor azul', () => {
    render(<Loading color="blue" />);

    expect(screen.getByRole('status')).toHaveClass('text-blue-500');
  });

  it('renderiza com cor verde', () => {
    render(<Loading color="green" />);

    expect(screen.getByRole('status')).toHaveClass('text-green-500');
  });

  it('renderiza com cor vermelha', () => {
    render(<Loading color="red" />);

    expect(screen.getByRole('status')).toHaveClass('text-red-500');
  });

  it('renderiza com cor primária por padrão quando cor é inválida', () => {
    render(<Loading color="invalid" />);

    expect(screen.getByRole('status')).toHaveClass('text-primary-500');
  });

  it('renderiza com animação de rotação', () => {
    render(<Loading />);

    expect(screen.getByRole('status')).toHaveClass('animate-spin');
  });
}); 