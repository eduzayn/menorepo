import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from '../components/badge';

describe('Badge Component', () => {
  it('deve renderizar o conteúdo do badge corretamente', () => {
    render(<Badge>Teste</Badge>);
    expect(screen.getByText('Teste')).toBeInTheDocument();
  });

  it('deve aplicar a variante padrão (default)', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-neutral-100');
    expect(badge).toHaveClass('text-neutral-800');
  });

  it('deve aplicar a variante primária quando informada', () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByText('Primary');
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-800');
  });

  it('deve aplicar a variante secundária quando informada', () => {
    render(<Badge variant="secondary">Secondary</Badge>);
    const badge = screen.getByText('Secondary');
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
  });

  it('deve aplicar a variante success quando informada', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });

  it('deve aplicar a variante danger quando informada', () => {
    render(<Badge variant="danger">Danger</Badge>);
    const badge = screen.getByText('Danger');
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-800');
  });

  it('deve aplicar a variante warning quando informada', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText('Warning');
    expect(badge).toHaveClass('bg-yellow-100');
    expect(badge).toHaveClass('text-yellow-800');
  });

  it('deve aplicar classes adicionais quando fornecidas', () => {
    render(<Badge className="custom-class">Com Classe</Badge>);
    const badge = screen.getByText('Com Classe');
    expect(badge).toHaveClass('custom-class');
  });

  it('deve renderizar com o tamanho padrão (md)', () => {
    render(<Badge>Tamanho Padrão</Badge>);
    const badge = screen.getByText('Tamanho Padrão');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('px-2.5');
    expect(badge).toHaveClass('py-0.5');
  });

  it('deve renderizar com o tamanho pequeno quando informado', () => {
    render(<Badge size="sm">Pequeno</Badge>);
    const badge = screen.getByText('Pequeno');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('px-2');
    expect(badge).toHaveClass('py-0.5');
  });

  it('deve renderizar com o tamanho grande quando informado', () => {
    render(<Badge size="lg">Grande</Badge>);
    const badge = screen.getByText('Grande');
    expect(badge).toHaveClass('text-sm');
    expect(badge).toHaveClass('px-3');
    expect(badge).toHaveClass('py-1');
  });
}); 