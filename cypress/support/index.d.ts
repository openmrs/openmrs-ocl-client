/// <reference types="cypress" />

interface ConceptName {
  name: string;
  locale: string;
  external_id?: string;
  locale_preferred?: boolean;
  name_type?: string;
}

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
    createOrgSource(
      source?: string,
      organisation?: string,
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
    getConcept(source_url: string, id?: string): Chainable<Subject>;
    createConcept(
      names: ConceptName[],
      source_url: string,
      id?: string,
      concept_class?: string
    createVersion(
      version?: string,
      dictionary?: string,
      username?: string,
    ): Chainable<Subject>;
    getVersion(
      version?: string,
      dictionary?: string,
      username?: string,
      shouldFail?:boolean
    ): Chainable<Subject>;
    updateVersion(
        version?: string,
        dictionary?: string,
        username?: string
    ): Chainable<Subject>;
  }
}
