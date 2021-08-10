/// <reference types="cypress" />
/// <reference types="../../../" />
import {
  After,
  Before,
  Given,
  Then,
  When
} from "cypress-cucumber-preprocessor/steps";
import { getDictionaryId, getUser} from "../../../utils";

Given("the user is on the view dictionary concepts page", () => {
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/concepts/`);
  cy.url().should(
    "contain",
    `/users/${getUser()}/collections/${getDictionaryId()}/concepts/`
  );
});

When('the user clicks the "Add concepts" button', () => {
  cy.findByTitle("Add concepts").click();
});

When('the user selects "Pick concepts"', () => {
  cy.visit(
    `/orgs/CIEL/sources/CIEL/concepts/?addToDictionary=/users/${getUser()}/collections/${getDictionaryId()}/`
  );
});

Then('the user selects "Import existing concept"', () => {
  cy.findByText("Import existing concept").click();
});

Then('the user should be on the "Import existing concept" page', () => {
  cy.url().should("contain", "/orgs/CIEL/sources/CIEL/concepts/");
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

Then('the current source should be "CIEL"', () => {
  cy.url().should("contain", "/orgs/CIEL/sources/CIEL/concepts/");
});

When('the user clicks on the row for "Serum"', () => {
  cy.findByText("Serum")
    .parent()
    .next()
    .click();
});

When('the user clicks on the "Add selected to dictionary" button', () => {
  cy.findByTitle("Add selected to dictionary").click();
});

When('the user clicks on the row for "Whole blood sample"', () => {
  cy.findByText("Whole blood sample")
    .parent()
    .next()
    .click();
});

Then('the "Serum" concept should be added to the dictionary', () => {
  cy.waitUntil(
    () =>
      cy.getConcept(
        `/users/${getUser()}/collections/${getDictionaryId()}/`,
        "1001",
        false
      ),
    { timeout: 10000 }
  );
});

Then(
  'the "Whole blood sample" concept should be added to the dictionary',
  () => {
    cy.waitUntil(
      () =>
        cy.getConcept(
          `/users/${getUser()}/collections/${getDictionaryId()}/`,
          "1000",
          false
        ),
      { timeout: 10000 }
    );
  }
);

When('the user clicks on the row for "Plasma"', () => {
  cy.findByText("Plasma")
    .parent()
    .next()
    .click();
});

Then('the "Plasma" concept should be added to the dictionary', () => {
  cy.waitUntil(
    () =>
      cy.getConcept(
        `/users/${getUser()}/collections/${getDictionaryId()}/`,
        "1002",
        false
      ),
    { timeout: 10000 }
  );
});

When('the user clicks on the link for "Serum"', () => {
  cy.findByText("Serum").click();
});

When("the user is sent to the view concept page", () => {
  cy.visit("users/openmrs/collections");
});

When('the user clicks on the "Add selected to dictionary" button', () => {
  cy.findByTitle("Add selected to dictionary").click();
});

Then("the current source should be CIEL", () => {
  cy.url().should("contain", "/users/openmrs/collections/");
});

Then("the user should be on the view concept page", () => {
  cy.url().should("contain", `/users/openmrs/collections`);
  cy.findByText("Serum,Whole blood sample, Plasma,  concept").should(
    "be.visible"
  );
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
  cy.deleteOrganisation("CIEL", true).deleteOrgSource("CIEL", "CIEL", true);
});
