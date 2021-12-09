/// <reference types="cypress" />
/// <reference types="../../../" />
import {
  After,
  Before,
  Given,
  Then,
  When
} from "cypress-cucumber-preprocessor/steps";
import { getDictionaryId, getUser } from "../../../utils";

const NAMES_TO_IDS = {
  Serum: "1001",
  "Whole blood sample": "1000",
  Plasma: "1002"
};

Given("the user is on the view dictionary concepts page", () => {
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/concepts/`);
  cy.url().should(
    "contain",
    `/users/${getUser()}/collections/${getDictionaryId()}/concepts/`
  );
});

Given('the user is on the "Import existing concept" page', () => {
  cy.visit(
    `/orgs/CIEL/sources/CIEL/concepts/?addToDictionary=/users/${getUser()}/collections/${getDictionaryId()}/`
  );
  cy.url().should(
    "contain",
    `/orgs/CIEL/sources/CIEL/concepts/?addToDictionary=/users/${getUser()}/collections/${getDictionaryId()}/`
  );
});

When('the user clicks the "Add concepts" button', () => {
  cy.findByTestId("addConceptsIcon").click();
});

When('the user selects "Pick concepts"', () => {
  cy.visit(
    `/orgs/CIEL/sources/CIEL/concepts/?addToDictionary=/users/${getUser()}/collections/${getDictionaryId()}/`
  );
});

When('the user clicks on the "Add selected to dictionary" button', () => {
  cy.findByTestId("addSelectedToDictionary").click();
});

When(
  /the user clicks on the row for "(Serum|Whole blood sample|Plasma)"/,
  text => {
    cy.findAllByText(text)
      .parent()
      .next()
      .click();
  }
);

When('the user clicks on the link for "Serum"', () => {
  cy.findByText("Serum").click();
});

When("the user is sent to the view concept page", () => {
  cy.url().should("contain", "/");
});

When('the user clicks on the "Add Serum to dictionary" button', () => {
  cy.findByLabelText("Add Serum to dictionary").click({ force: true });
});

Then('the current source should be "CIEL"', () => {
  cy.url().should("contain", "/orgs/CIEL/sources/CIEL/concepts/");
});

Then('the user selects "Import existing concept"', () => {
  cy.findByText("Import existing concept").click();
});

Then('the user should be on the "Import existing concept" page', () => {
  cy.url().should("contain", "/orgs/CIEL/sources/CIEL/concepts/");
});

Then(
  /the "(Serum|Whole blood sample|Plasma)" concept should be added to the dictionary/,
  (conceptName: "Serum" | "Whole blood sample" | "Plasma") => {
    const conceptId = NAMES_TO_IDS[conceptName];
    cy.waitUntil(
      () =>
        cy.getConcept(
          `/users/${getUser()}/collections/${getDictionaryId()}/`,
          conceptId,
          false
        ),
      { timeout: 10000 }
    );
  }
);

Then("the current source should be CIEL", () => {
  cy.url().should("contain", "/users/openmrs/collections/");
});

Then("the user should be on the view concept page", () => {
  cy.url().should("contain", `/users/openmrs/collections`);
});

Before({ tags: "@ciel" }, () => {
  cy.createOrganisation("CIEL", true)
    .createOrgSource("CIEL", "CIEL", true)
    .createConcept(
      [
        {
          name: "Serum",
          locale: "en",
          locale_preferred: true,
          name_type: "FULLY_SPECIFIED"
        }
      ],
      "/orgs/CIEL/sources/CIEL/",
      "1001"
    )
    .createConcept(
      [
        {
          name: "Whole blood sample",
          locale: "en",
          locale_preferred: true,
          name_type: "FULLY_SPECIFIED"
        }
      ],
      "/orgs/CIEL/sources/CIEL/",
      "1000"
    )
    .createConcept(
      [
        {
          name: "Plasma",
          locale: "en",
          locale_preferred: true,
          name_type: "FULLY_SPECIFIED"
        }
      ],
      "/orgs/CIEL/sources/CIEL/",
      "1002"
    );
});

After({ tags: "@ciel" }, () => {
  cy.deleteOrgSource("CIEL", "CIEL", true).deleteOrganisation("CIEL", true);
});
