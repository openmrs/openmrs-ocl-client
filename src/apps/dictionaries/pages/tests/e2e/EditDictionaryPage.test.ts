/// <reference types="cypress" />

import { login, logout } from "../../../../authentication/tests/e2e/testUtils";
import { createDictionary, TestDictionary } from "./testUtils";

export interface UpdatedDictionary {
  name: string;
  description: string;
  preferredSource: string;
  visibility: string;
  preferredLanguage: string;
  otherLanguages: string[];
}

function updatedDictionary(): UpdatedDictionary {
  return {
    name: " Updated",
    description: " updated",
    preferredSource: "PIH",
    visibility: "Private",
    preferredLanguage: "Avaric (av)",
    otherLanguages: ["Ewe (ee)"]
  };
}

function select(labelText: string, item: string) {
  cy.findByLabelText(labelText).click();
  cy.findByText(item).click();
}

describe("Edit Dictionary", () => {
  let savedDictionary: TestDictionary, dictionaryUrl: string;

  beforeEach(() => {
    login();
    [savedDictionary, dictionaryUrl] = createDictionary();
  });

  afterEach(() => {
    logout();
  });

  it("Happy flow: Should edit a dictionary", () => {
    // todo improve this test to check actual values
    cy.visit(dictionaryUrl);
    cy.findByTitle("Edit this Dictionary").click();

    const dictionary = updatedDictionary();

    cy.findByLabelText("Dictionary Name").type(dictionary.name);
    cy.findByLabelText("Description").type(dictionary.description);
    select("Preferred Source", dictionary.preferredSource);
    select("Visibility", dictionary.visibility);
    select("Preferred Language", dictionary.preferredLanguage);
    dictionary.otherLanguages.forEach(language => {
      select("Other Languages", language);
      cy.get("body").type("{esc}");
    });

    cy.findByText("Submit").click();
    // redirects to view page

    cy.findByText("General Details").should("exist");
  });
});
