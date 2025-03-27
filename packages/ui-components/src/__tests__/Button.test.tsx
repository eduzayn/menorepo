import { describe, it, expect } from 'vitest';
import { render, screen } from '@edunexia/test-config';
import { Button } from '../components/button';

describe('Button', () => {
  it('renderiza o botão corretamente', () => {
    render(<Button>Clique aqui</Button>);
    const buttonElement = screen.getByText('Clique aqui');
    expect(buttonElement).toBeInTheDocument();
  });

  it('aplica a variante correta com base na prop', () => {
    render(<Button variant="destructive">Botão destrutivo</Button>);
    const buttonElement = screen.getByText('Botão destrutivo');
    expect(buttonElement).toHaveClass('bg-destructive');
    expect(buttonElement).toHaveClass('text-destructive-foreground');
  });

  it('aplica o tamanho correto com base na prop', () => {
    render(<Button size="lg">Botão grande</Button>);
    const buttonElement = screen.getByText('Botão grande');
    expect(buttonElement).toHaveClass('h-11');
    expect(buttonElement).toHaveClass('px-8');
  });

  it('passa props adicionais para o elemento button', () => {
    render(<Button disabled data-testid="botao-teste">Botão desabilitado</Button>);
    const buttonElement = screen.getByTestId('botao-teste');
    expect(buttonElement).toBeDisabled();
  });

  it('pode ser estilizado através da propriedade className', () => {
    render(<Button className="teste-classe-personalizada">Botão com classe</Button>);
    const buttonElement = screen.getByText('Botão com classe');
    expect(buttonElement).toHaveClass('teste-classe-personalizada');
  });

  it('encaminha corretamente a ref para o elemento nativo', () => {
    const refCallback = vi.fn();
    render(<Button ref={refCallback}>Botão com ref</Button>);
    expect(refCallback).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('utiliza valores padrão para variant e size quando não são fornecidos', () => {
    render(<Button>Botão padrão</Button>);
    const buttonElement = screen.getByText('Botão padrão');
    expect(buttonElement).toHaveClass('bg-primary');
    expect(buttonElement).toHaveClass('h-10');
  });
}); 