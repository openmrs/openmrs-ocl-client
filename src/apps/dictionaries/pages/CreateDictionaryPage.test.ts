import { login } from '../../authentication/LoginPage.test'
import uuid from 'uuid'

interface TestDictionary {
  name: string,
  shortCode: string,
  description: string,
  preferredSource: string,
  owner: string,
  ownerType: string,
  visibility: string,
  preferredLanguage: string,
  otherLanguages: string,
}

const FIXTURES = {
  newDictionary: {
    name: 'Test Dictionary',
    shortCode: 'TD' + uuid(),
    description: 'Test dictionary',
    preferredSource: 'CIEL',  // todo stop hard coding this, pick the nth
    owner: 'admin',
    ownerType: 'users',
    visibility: 'Public',
    preferredLanguage: 'English (en)',
    otherLanguages: 'French (fr)',
  },
}

function select(labelText: string, item: string) {
  cy.findByLabelText(labelText).click();
  cy.findByText(item).click();
}

function createDictionary(dictionary: TestDictionary) {
  cy.visit('/user/collections/');

  cy.findByTitle('Create new dictionary').click();

  cy.findByLabelText('Dictionary Name').type(dictionary.name);
  cy.findByLabelText('Short Code').type(dictionary.shortCode);
  cy.findByLabelText('Description').type(dictionary.description);
  select('Preferred Source', dictionary.preferredSource);
  select('Owner', dictionary.owner + '(You)');
  select('Visibility', dictionary.visibility);
  select('Preferred Language', dictionary.preferredLanguage);
  select('Other Languages', dictionary.otherLanguages);
  cy.get('body').type('{esc}');
  cy.findByText('Submit').click();

  // wait for request to get done
  cy.findByText('General Details');
}

describe('Create Dictionary', () => {
  beforeEach(() => {
    login();
  });

  it('Happy flow: Should create a dictionary', () => {
    cy.visit(`/${FIXTURES.newDictionary.ownerType}/${FIXTURES.newDictionary.owner}/collections/${FIXTURES.newDictionary.shortCode}/`);
    cy.findByText("Could not load dictionary. Refresh the page to retry").should('exist');

    createDictionary(FIXTURES.newDictionary);

    cy.visit(`/${FIXTURES.newDictionary.ownerType}/${FIXTURES.newDictionary.owner}/collections/${FIXTURES.newDictionary.shortCode}/`);
    cy.queryByText("Could not load dictionary. Refresh the page to retry").should('not.exist');
    cy.findByText('General Details').should('exist');
  });
})
