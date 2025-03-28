import { describe, it, expect } from 'vitest';
import { render, screen } from '@edunexia/test-config';

// Exemplo de teste simples
describe('Exemplo de teste', () => {
  it('deve passar', () => {
    expect(1 + 1).toBe(2);
  });

  it('deve renderizar um componente de exemplo', () => {
    // Arranjar
    render(<div data-testid="teste">Teste</div>);
    
    // Agir
    const elemento = screen.getByTestId('teste');
    
    // Verificar
    expect(elemento).toBeInTheDocument();
    expect(elemento).toHaveTextContent('Teste');
  });
}); 