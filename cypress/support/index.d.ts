/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable<Subject> {
    login(username?: string, password?: string): Chainable<Subject>;
    logout(): Chainable<Subject>;
    createDictionary(
      dictionary?: string,
      username?: string,
      public_access?: boolean
    ): Chainable<Subject>;
    deleteDictionary(
      dictionary: string,
      username?: string,
      isCleanup?: boolean
    ): Chainable<Subject>;
    getDictionary(dictionary: string, username?: string): Chainable<Subject>;
    createSource(
      source?: string,
      username?: string,
      public_access?: boolean
    ): Chainable<Subject>;
    deleteSource(
      source: string,
      username?: string,
      isCleanup?: boolean
    ): Chainable<Subject>;
    getSource(source: string, username?: string): Chainable<Subject>;
    createOrganisation(
      organisation?: string,
      public_access?: boolean
    ): Chainable<Subject>;
    deleteOrganisation(
      organisation: string,
      isCleanup?: boolean
    ): Chainable<Subject>;
    getOrganisation(
      organisation: string,
      username?: string
    ): Chainable<Subject>;
  }
}
