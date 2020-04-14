import { createDictionary, TestDictionary } from '../../../dictionaries/tests/e2e/testUtils'
import { login, logout } from '../../../authentication/tests/e2e/testUtils'

describe('View Concepts Page', () => {
  const conceptSelector = "[data-testRowClass='conceptRow']"
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
  });

  afterEach(() => {
    logout();
  });

  it('Should allow retrieving, sorting, filtering concepts', () => {
    cy.findByTitle('Add concepts').click();
    cy.findByText('Import existing concept').click();
    cy.findByText('Pick concepts').click();

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

  it('Import existing concept from Source', () => {
    cy.get(conceptSelector).should('have.length', 0);

    cy.findByTitle('Add concepts').click();
    cy.findByText('Import existing concept').click();
    cy.findByText('Pick concepts').click();

    cy.findAllByTitle('More actions').first().click();
    cy.runAndAwait(() => cy.findByText('Add to dictionary').click());

    // select the next two concepts
    cy.get(conceptSelector).eq(1).click();
    cy.get(conceptSelector).eq(2).click();
    cy.runAndAwait(() => cy.findByTitle('Add selected to dictionary').click());

    // switch source and add more concepts
    cy.findByText(`Switch source (Currently ${dictionary.preferredSource})`).click();
    cy.runAndAwait(() => cy.findByText("Public Sources").click());
    cy.get(conceptSelector).eq(3).click();
    cy.get(conceptSelector).eq(4).click();
    cy.runAndAwait(() => cy.findByTitle('Add selected to dictionary').click());

    cy.findByTitle('Go back').click();

    cy.get(conceptSelector).should('have.length.gte', 5); // account for possible recursively added concepts
  });

  it('Add concepts in bulk from Source', () => {
    cy.get(conceptSelector).should('have.length', 0);

    cy.findByTitle('Add concepts').click();
    cy.findByText('Import existing concept').click();
    cy.findByText('Add bulk concepts').click();

    cy.findByPlaceholderText("1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007").type("1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007");
    cy.runAndAwait(() => cy.findByText("Add concepts").click(), 'PUT');

    cy.wait(5000); // index update takes a while

    cy.findByTitle('Go back').click();
    cy.get(conceptSelector).should('have.length.gte', 3); // account for possible recursively added concepts
  });
});
