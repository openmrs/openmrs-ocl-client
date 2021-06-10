/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    login(username?: string, password?: string): Chainable<Subject>;
    logout(): Chainable<Subject>;
    createDictionary(username?: string, dictionary?: string): Chainable<string>;
    deleteDictionary(dictionary: string, username?: string): Chainable<Subject>;
  }
}
