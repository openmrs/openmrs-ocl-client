import uuid from 'uuid'

export interface TestConcept {
  id: string,
  class: string,
  datatype: string,
  names: {name: string, type: string, language: string, preferredInLanguage: string}[],
  descriptions: {description: string, language: string, preferredInLanguage: string}[],
  answers: {source: string, concept: string}[],
  sets: {source: string, concept: string}[],
  mappings: {source: string, relationship: string, concept: string}[],
}

export function newConcept(ownerType: string, owner: string, shortCode: string): [TestConcept, string] {
  const randomString = uuid();
  const id = `TestConcept1-${randomString}`;

  const concept = {
    id,
    class: 'Drug',
    datatype: 'Coded',
    names: [
      {name: `TestConcept One ${randomString}`, type: 'Fully Specified', language: 'English (en)', preferredInLanguage: 'Yes'},
      {name: `TestConcept Uń ${randomString}`, type: 'Synonym', language: 'French (fr)', preferredInLanguage: 'No'},
    ],
    descriptions: [
      {description: `TestConcept One ${randomString}`, language: 'English (en)', preferredInLanguage: 'Yes'},
      {description: `TestConcept Uń ${randomString}`, language: 'French (fr)', preferredInLanguage: 'No'},
    ],
    answers: [
      {source: 'CIEL', concept: '153557- blunt trauma of eye'},
      {source: 'CIEL', concept: '138571- HIV Positive'},
    ],
    sets: [
      {source: 'CIEL', concept: '110264- HIV Lipodystrophy'},
    ],
    mappings: [
      {source: 'CIEL', relationship: 'Access', concept: '111061- roncha'},
    ],
  };

  return [concept, `/${ownerType}/${owner}/sources/${shortCode}/concepts/${id}/`];
}

function selectByLabelText(labelText: string, item: string) {
  cy.findByLabelText(labelText).click();
  cy.findByText(item).click();
}

function selectBySelector(selector: string, item: string) {
  cy.get(selector).click();
  cy.findByText(item).click();
}

function fillNameRow (index: number, concept: TestConcept) {
  cy.get(`[data-testId="names_${index}_name"]`).type(concept.names[index].name);
  selectBySelector(`[data-testId="names_${index}_name_type"]`, concept.names[index].type);
  selectBySelector(`[data-testId="names_${index}_language"]`, concept.names[index].language);
  selectBySelector(`[data-testId="names_${index}_preferredInLanguage"]`, concept.names[index].preferredInLanguage);
}

export function createConcept(dictionaryUrl: string, conceptAndUrl: [TestConcept, string]): [TestConcept, string] {
  const [concept, conceptUrl] = conceptAndUrl;

  cy.visit(dictionaryUrl);

  cy.findByText('View Concepts').click();
  cy.findByTitle('Add concepts').click();
  cy.findByText('Create custom concept').click();
  cy.findByText('Other kind').click();

  cy.findByLabelText('OCL ID').type(concept.id);
  selectByLabelText('Class', concept.class);
  selectByLabelText('Datatype', concept.datatype);
  fillNameRow(0, concept);


  cy.findByText('Add name').click();

  cy.get('#names_1_name').type(concept.names[1].name);
  selectBySelector('#names_1_type', concept.names[1].type);
  selectBySelector('#names_1_language', concept.names[1].language);
  selectBySelector('#name_1_.preferredInLanguage', concept.names[1].preferredInLanguage);
  /* eslint-enable no-useless-escape */

  // selectByLabelText('Preferred Source', concept.preferredSource);
  // selectByLabelText('Owner', concept.ownerDisplayValue);
  // selectByLabelText('Visibility', concept.visibility);
  // selectByLabelText('Preferred Language', concept.preferredLanguage);
  //
  // selectByLabelText('Other Languages', concept.otherLanguages);
  // cy.get('body').type('{esc}');
  // cy.findByText('Submit').click();
  //
  // // wait for request to get done
  // cy.findByText('General Details');
  //
  // // for other test files that makes use of us
  return [concept, conceptUrl];
}
