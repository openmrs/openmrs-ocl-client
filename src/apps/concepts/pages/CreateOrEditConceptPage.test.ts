import { login } from '../../authentication/testUtils'
import { createDictionary, TestDictionary } from '../../dictionaries/pages/testUtils'
import { createConcept, newConcept } from './testUtils'

describe("Create Concept", () => {
  // todo add assertions for expected page blank state
  let dictionary: TestDictionary, dictionaryUrl: string;

  beforeEach(() => {
    login();
    [dictionary, dictionaryUrl] = createDictionary();
  });

  it.only('Should create a concept', () => {
    const [concept, conceptUrl] = newConcept(dictionary.ownerType, dictionary.owner, dictionary.shortCode);

    createConcept(dictionaryUrl, [concept, conceptUrl]);
  })
})
