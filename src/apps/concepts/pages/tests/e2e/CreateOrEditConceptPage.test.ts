/// <reference types="cypress" />
/// <reference types="../../../../../../cypress/support" />

import { login, logout } from "../../../../authentication/tests/e2e/testUtils";
import {
  createDictionary,
  TestDictionary
} from "../../../../dictionaries/pages/tests/e2e/testUtils";
import {
  createConcept,
  fillDescriptionRow,
  // fillMappingRow,
  fillNameRow,
  newConcept
} from "./testUtils";

describe("Create Concept", () => {
  // todo add assertions for expected page blank state
  let dictionary: TestDictionary, dictionaryUrl: string;

  beforeEach(() => {
    login();
    [dictionary, dictionaryUrl] = createDictionary();
  });

  afterEach(() => {
    logout();
  });

  it("Should create a concept", () => {
    const [concept, conceptUrl] = newConcept(
      dictionary.ownerType,
      dictionary.owner,
      dictionary.shortCode
    );

    createConcept(dictionaryUrl, [concept, conceptUrl]);

    cy.findByTitle(/Edit TestConcept.+/).should("exist");
  });

  it("Edit a concept", () => {
    const [oldConcept, oldConceptUrl] = newConcept(
      dictionary.ownerType,
      dictionary.owner,
      dictionary.shortCode
    );
    createConcept(dictionaryUrl, [oldConcept, oldConceptUrl]);
    cy.findByTitle(/Edit TestConcept.+/).click();

    const [concept, conceptUrl] = newConcept(
      dictionary.ownerType,
      dictionary.owner,
      dictionary.shortCode
    );

    cy.selectByLabelText("Class", concept.class);
    cy.selectByLabelText("Datatype", concept.datatype);

    fillNameRow(0, concept);
    fillNameRow(1, concept);
    cy.findByText("Add Name").click();
    fillNameRow(2, concept);

    fillDescriptionRow(0, concept);
    fillDescriptionRow(1, concept);

    // todo test editing mappings

    cy.findByText("Submit").click();

    cy.findByTitle(/Edit TestConcept.+/).should("exist");
  });
});
