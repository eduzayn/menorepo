import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchInput } from '../components/SearchInput';
import { describe, it, expect, vi } from 'vitest';

describe('SearchInput', () => {
  it('deve renderizar com placeholder padrão', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('deve renderizar com placeholder personalizado', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Pesquisar contatos" />);
    
    expect(screen.getByPlaceholderText('Pesquisar contatos')).toBeInTheDocument();
  });

  it('deve exibir o valor inicial corretamente', () => {
    render(<SearchInput value="teste inicial" onChange={() => {}} />);
    
    expect(screen.getByDisplayValue('teste inicial')).toBeInTheDocument();
  });

  it('deve atualizar o valor ao digitar', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    
    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'novo valor' } });
    
    expect(screen.getByDisplayValue('novo valor')).toBeInTheDocument();
  });

  it('deve chamar a função onChange após o atraso', async () => {
    const handleChange = vi.fn();
    render(<SearchInput value="" onChange={handleChange} delay={300} />);
    
    const input = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(input, { target: { value: 'novo texto' } });
    
    // Verificar que a função não foi chamada imediatamente
    expect(handleChange).not.toHaveBeenCalled();
    
    // Verificar que a função é chamada após o atraso
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('novo texto');
    }, { timeout: 350 });
  });

  it('deve atualizar o valor quando a prop value muda', () => {
    const { rerender } = render(<SearchInput value="valor inicial" onChange={() => {}} />);
    
    expect(screen.getByDisplayValue('valor inicial')).toBeInTheDocument();
    
    rerender(<SearchInput value="novo valor prop" onChange={() => {}} />);
    
    expect(screen.getByDisplayValue('novo valor prop')).toBeInTheDocument();
  });
}); 