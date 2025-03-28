/// <reference types="cypress" />

import { MountOptions, MountReturn } from 'cypress/react'
import { ComponentType, ReactNode } from 'react'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Monta um componente React
       * @param component Componente React para montar
       * @param options Opções de montagem
       */
      mount: <Props extends object>(
        component: ReactNode,
        options?: MountOptions
      ) => Chainable<MountReturn>
      
      /**
       * Comandos personalizados
       */
      login(email: string, senha: string): Chainable<void>
      verificarNotificacao(texto: string): Chainable<void>
    }
  }
} 