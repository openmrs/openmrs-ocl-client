import { createDictionary, TestDictionary } from '../../../dictionaries/tests/e2e/testUtils'
import { login } from '../../../authentication/tests/e2e/testUtils'

describe('Add concepts to collection', () => {
  const nameSelector = "[data-testClass='name']";
  const classSelector = "[data-testClass='conceptClass']";
  const datatypeSelector = "[data-testClass='datatype']";
  let dictionary: TestDictionary, dictionaryUrl: string;

  function applyFilters() {
    cy.runAndAwait(() => cy.findByText("Apply Filters").click());
  }

  beforeEach(() => {
    login();
    [dictionary, dictionaryUrl] = createDictionary();
    cy.visit(dictionaryUrl);

    cy.findByText('View Concepts').click();
    cy.findByTitle('Add concepts').click();
    cy.findByText('Import existing concept').click();
    cy.findByText('Pick concepts').click();
  });

  it('Should allow retrieving, sorting, filtering concepts', () => {
    // Classes
    cy.findByLabelText("Diagnosis").click();
    applyFilters();
    cy.get(classSelector).each(element => cy.wrap(element).should('contain', 'Diagnosis'));

    cy.findByLabelText("Diagnosis").click();
    cy.findByLabelText("Procedure").click();
    applyFilters();
    cy.get(classSelector).each(element => cy.wrap(element).should('not.contain', 'Diagnosis'));
    cy.get(classSelector).each(element => cy.wrap(element).should('contain', 'Procedure'));

    cy.findByLabelText("Question").click();
    applyFilters();
    cy.get(classSelector).each(element => cy.wrap(element).invoke('text').should('match', /Question|Procedure/));

    cy.findByText("Clear all").click();
    applyFilters();

    // Datatypes
    cy.findByLabelText("Boolean").click();
    applyFilters();
    cy.get(datatypeSelector).each(element => cy.wrap(element).should('contain', 'Boolean'));

    cy.findByLabelText("Boolean").click();
    cy.findByLabelText("Coded").click();
    applyFilters();
    cy.get(datatypeSelector).each(element => cy.wrap(element).should('not.contain', 'Boolean'));
    cy.get(datatypeSelector).each(element => cy.wrap(element).should('contain', 'Coded'));

    cy.findByLabelText("Complex").click();
    applyFilters();
    cy.get(datatypeSelector).each(element => cy.wrap(element).invoke('text').should('match', /Coded|Complex/));

    cy.findByText("Clear all").click();
    applyFilters();

    // All the above
    cy.findByLabelText("Diagnosis").click();
    cy.findByLabelText("Boolean").click();
    applyFilters();
    cy.get(classSelector).each(element => cy.wrap(element).should('contain', 'Diagnosis'));
    cy.get(datatypeSelector).each(element => cy.wrap(element).should('contain', 'Boolean'));
    cy.runAndAwait(() => cy.findByTitle("Next page").click());
    cy.get(classSelector).each(element => cy.wrap(element).should('contain', 'Diagnosis'));
    cy.get(datatypeSelector).each(element => cy.wrap(element).should('contain', 'Boolean'));
    cy.findByText("Clear all").click();
    applyFilters();

    // Sort
    cy.runAndAwait(() => cy.findByTestId('conceptsTableHeader').findByText('Name').click());
    cy.get(nameSelector).each(element => cy.wrap(element).invoke('text').should('match', /Z.*/));

    // Search filters
    cy.findByPlaceholderText("Search filters").type("b");

    cy.findByLabelText("Boolean").should('be.visible');
    cy.findByLabelText("Drug").should('not.be.visible');
    cy.findByLabelText("LabSet").should('be.visible');
    cy.findByLabelText("Procedure").should('not.be.visible');
  });
});
