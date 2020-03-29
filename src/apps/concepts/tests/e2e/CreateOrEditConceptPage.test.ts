import { login } from '../../../authentication/tests/e2e/testUtils'
import { createDictionary, TestDictionary } from '../../../dictionaries/tests/e2e/testUtils'
import { createConcept, newConcept } from './testUtils'

describe("Create Concept", () => {
  // todo add assertions for expected page blank state
  let dictionary: TestDictionary, dictionaryUrl: string;

  beforeEach(() => {
    login();
    [dictionary, dictionaryUrl] = createDictionary();
  });

  it('Should create a concept', () => {
    const [concept, conceptUrl] = newConcept(dictionary.ownerType, dictionary.owner, dictionary.shortCode);

    createConcept(dictionaryUrl, [concept, conceptUrl]);

    cy.findByText('Concept Details').should('exist');
  });
})
