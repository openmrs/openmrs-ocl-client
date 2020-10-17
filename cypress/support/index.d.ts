/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    runAndAwait(callable: Function, method?: String, addArtificialWait?: boolean): Chainable<any> 
    selectByLabelText(labelText: string, item: string): Chainable<any>
    selectBySelector(selector: string, item: string): Chainable<any>
  }
}