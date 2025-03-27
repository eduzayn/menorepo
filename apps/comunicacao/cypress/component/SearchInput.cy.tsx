/// <reference types="cypress" />

import React from 'react'
import { SearchInput } from '../../src/components/SearchInput'

describe('SearchInput Component', () => {
  it('renderiza com um placeholder padrão', () => {
    cy.mount(<SearchInput value="" onChange={() => {}} />)
    cy.get('[data-cy=search-input]').should('have.attr', 'placeholder', 'Pesquisar...')
  })

  it('renderiza com um placeholder personalizado', () => {
    const customPlaceholder = 'Buscar contatos'
    cy.mount(<SearchInput value="" onChange={() => {}} placeholder={customPlaceholder} />)
    cy.get('[data-cy=search-input]').should('have.attr', 'placeholder', customPlaceholder)
  })

  it('atualiza o valor ao digitar', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy')
    cy.mount(<SearchInput value="" onChange={onChangeSpy} />)
    
    cy.get('[data-cy=search-input]').type('teste')
    cy.get('[data-cy=search-input]').should('have.value', 'teste')
    
    // Verifica se o evento onChange foi chamado
    cy.get('@onChangeSpy').should('have.been.called')
  })

  it('limpa o campo quando o botão de limpar é clicado', () => {
    const onChangeSpy = cy.spy().as('onChangeSpy')
    cy.mount(<SearchInput value="teste" onChange={onChangeSpy} />)
    
    // Verifica se o texto inicial aparece
    cy.get('[data-cy=search-input]').should('have.value', 'teste')
    
    // Clica no botão de limpar e verifica se o campo foi limpo
    cy.get('[data-cy=clear-button]').should('be.visible').click()
    
    // Verifica se o onChange foi chamado com string vazia
    cy.get('@onChangeSpy').should('have.been.calledWith', '')
  })

  it('exibe o ícone de busca', () => {
    cy.mount(<SearchInput value="" onChange={() => {}} />)
    cy.get('[data-cy=search-icon]').should('be.visible')
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-search-class'
    cy.mount(<SearchInput value="" onChange={() => {}} className={customClass} />)
    cy.get('[data-cy=search-container]').should('have.class', customClass)
  })
}) 