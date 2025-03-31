/**
 * Definições de tipos para testes
 */

declare module '@testing-library/jest-dom' {
  export interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveAttribute(attr: string, value?: string): R;
    toHaveClass(...classNames: string[]): R;
  }
}

declare module '@testing-library/react' {
  export interface RenderResult {
    container: HTMLElement;
    unmount: () => void;
  }

  export function render(
    ui: React.ReactElement,
    options?: {
      container?: HTMLElement;
      baseElement?: HTMLElement;
      hydrate?: boolean;
      wrapper?: React.ComponentType<{ children: React.ReactNode }>;
    }
  ): RenderResult;

  export const screen: {
    getByText: (text: string | RegExp, options?: { selector?: string }) => HTMLElement;
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
    getByLabelText: (text: string | RegExp) => HTMLElement;
  };
}

declare module '@testing-library/user-event' {
  export interface UserEvent {
    type: (element: HTMLElement, text: string) => Promise<void>;
    click: (element: HTMLElement) => Promise<void>;
  }

  export function setup(options?: {
    delay?: number;
    advanceTimers?: (delay: number) => Promise<void>;
  }): UserEvent;
}

declare module 'jest' {
  export interface Mock {
    mockReturnValue: (value: any) => Mock;
    mockImplementation: (fn: (...args: any[]) => any) => Mock;
    mockClear: () => void;
  }

  export function fn(): Mock;
  export function clearAllMocks(): void;
} 