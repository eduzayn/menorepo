import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Importações de utilitários
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { default as userEvent } from '@testing-library/user-event';

// Se o projeto usar Vitest, exportar o vi
export { vi } from 'vitest';

// Interface para definir provedores personalizados
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

// Função para envolver componentes em provedores de contexto
export function createWrapper(Provider: React.ComponentType<{ children: React.ReactNode }>) {
  return ({ children }: { children: React.ReactNode }) => <Provider>{children}</Provider>;
}

// Função para combinar vários provedores
export function combineProviders(...providers: React.ComponentType<{ children: React.ReactNode }>[]) {
  return ({ children }: { children: React.ReactNode }) => {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      <>{children}</>
    );
  };
}

// Função customizada de renderização
export function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { wrapper: Wrapper, ...restOptions } = options;
  
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: Wrapper,
      ...restOptions,
    }),
  };
}

// Alias para a função customizada de renderização
export { customRender as render }; 