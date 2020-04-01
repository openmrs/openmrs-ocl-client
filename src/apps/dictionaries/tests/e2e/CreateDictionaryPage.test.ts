import { login } from '../../../authentication/tests/e2e/testUtils'
import { createDictionary, newDictionary } from './testUtils'

describe('Create Dictionary', () => {
  beforeEach(() => {
    login();
  });

  it('Happy flow: Should create a dictionary', () => {
    // todo improve this test to check actual values
    const [dictionary, dictionaryUrl] = newDictionary();

    cy.visit(dictionaryUrl);
    cy.findByText("Could not load dictionary. Refresh the page to retry").should('exist');

    createDictionary([dictionary, dictionaryUrl]);

    cy.visit(dictionaryUrl);
    cy.queryByText("Could not load dictionary. Refresh the page to retry").should('not.exist');
    cy.findByText('General Details').should('exist');
  });
})
