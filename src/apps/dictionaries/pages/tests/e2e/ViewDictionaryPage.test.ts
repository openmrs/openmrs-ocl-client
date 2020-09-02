import { login, logout } from "../../../../authentication/tests/e2e/testUtils";
import { createDictionary, TestDictionary } from "./testUtils";

describe("View Dictionary", () => {
  let dictionary: TestDictionary, dictionaryUrl: string;

  beforeEach(() => {
  	cy.initiateExceptionsLogger();
    login();
    [dictionary, dictionaryUrl] = createDictionary();
  });

  afterEach(() => {
    logout();
  });

  it("Happy flow: Should allow a user to view a dictionary", () => {
    cy.visit(dictionaryUrl);

    cy.findByText("General Details").should("exist");
    cy.findByDisplayValue(dictionary.name)
      .should("exist")
      .should("be.disabled");
    cy.findByDisplayValue(dictionary.shortCode)
      .should("exist")
      .should("be.disabled");
    cy.findByDisplayValue(dictionary.description)
      .should("exist")
      .should("be.disabled");
    // todo add disabled checks for the selects
    cy.findByDisplayValue(dictionary.preferredSource).should("exist");
    // cy.findByDisplayValue(dictionary.ownerDisplayValue).should('exist');
    // cy.findByDisplayValue(dictionary.visibility).should('exist');
    // cy.findByDisplayValue(dictionary.preferredLanguage).should('exist');
    cy.queryByText("Submit").should("not.exist");

    cy.findByText("Concepts(HEAD Version)").should("exist");
    cy.findByText("Total Concepts: 0").should("exist");
    cy.get('[data-testid="preferredConceptCount"]').should(
      "have.text",
      `From ${dictionary.preferredSource}: 0`
    );
    cy.get('[data-testid="customConceptCount"]').should(
      "have.text",
      "Custom Concepts: 0"
    );
    cy.findByText("View Concepts").should("exist");

    cy.findByText("Versions").should("exist");
    cy.findByText("No versions created").should("exist");
    cy.findByText("Create new version").should("exist");
  });
});
