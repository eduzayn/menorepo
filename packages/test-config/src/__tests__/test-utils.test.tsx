import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, customRender, createWrapper, combineProviders } from '../test-utils';

describe('Utilitários de Teste', () => {
  // Componente simples para testes
  const TestComponent = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="test-component">{children}</div>
  );

  // Provedor simples para testes
  const TestProvider = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="test-provider">{children}</div>
  );

  it('deve renderizar um componente corretamente', () => {
    render(<TestComponent>Teste</TestComponent>);
    
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.getByText('Teste')).toBeInTheDocument();
  });

  it('deve criar um wrapper corretamente', () => {
    const Wrapper = createWrapper(TestProvider);
    render(<TestComponent>Teste</TestComponent>, { wrapper: Wrapper });
    
    expect(screen.getByTestId('test-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('deve combinar múltiplos provedores', () => {
    const AnotherProvider = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="another-provider">{children}</div>
    );
    
    const CombinedWrapper = combineProviders(TestProvider, AnotherProvider);
    render(<TestComponent>Teste</TestComponent>, { wrapper: CombinedWrapper });
    
    expect(screen.getByTestId('test-provider')).toBeInTheDocument();
    expect(screen.getByTestId('another-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('deve criar um wrapper utilizando customRender', () => {
    const Wrapper = createWrapper(TestProvider);
    customRender(<TestComponent>Teste com Custom</TestComponent>, { wrapper: Wrapper });
    
    expect(screen.getByTestId('test-provider')).toBeInTheDocument();
    expect(screen.getByText('Teste com Custom')).toBeInTheDocument();
  });
}); 