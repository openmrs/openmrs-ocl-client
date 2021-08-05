/// <reference types="cypress" />
/// <reference types="../../../" />
import {
    After,
    Before,
    Given,
    Then,
    When
  } from "cypress-cucumber-preprocessor/steps";
  import { getDictionaryId, getUser, getConceptId } from '../../../utils';
  
  Given("the user is on the view dictionary concepts page", () => {
    cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/concepts/`);
    cy.url().should( "contain",`/users/${getUser()}/collections/${getDictionaryId()}/concepts/`);
  });
  
  When('the user clicks the "Add concepts" button', () => {
    cy.findByTitle("Add concepts").click();
  });

  Then('the user selects "Import existing concept"', () => {
    cy.findByText("Import existing concept").click();
  });

  When('the user selects "Add bulk concepts"', () => {
    cy.findByText("Add bulk concepts").click();
  });
  
  Then('the user should be on the "Add concepts in bulk from CIEL" page', () => {
    cy.url().should("contain", `/collections/${getDictionaryId()}/add/?fromSource=CIEL/`)
  });
  
  Given('the user is on the "Add concepts in bulk from CIEL" page', () => {
    cy.url().should(
      "contain",
      `/collections/${getDictionaryId()}/add/?fromSource=CIEL/`)
  });
  
  Then('the current source should be "CIEL"', () => {
    cy.url().should("contain", "/orgs/CIEL/sources/CIEL/concepts/");
  });
  
  When('the user enters concept ID "1000"', () => {
    cy.get("#1000").type(getConceptId());
  });

  When('the user enters concept ID "1001"', () => {
    cy.get("#1001").type(getConceptId());
  });

  When('the user enters concept ID "1002"', () => {
    cy.get("#1002").type(getConceptId());
  });
  
  When('the user clicks the "Add concepts" button', () => {
    cy.findByTitle("Add concepts").click();
  });
  
  Then('the concept ID "1000" should be added to the dictionary', () => {
    cy.waitUntil(
      () =>
        cy.getConceptId(
          "1000",
          false
        ),
      { timeout: 10000 }
    );
  });
  
  Then('the concept ID "1001" should be added to the dictionary', () => {
    cy.waitUntil(
      () =>
        cy.getConceptId(
          "1001",
          false
        ),
      { timeout: 10000 }
    );
  });

  Then('the concept ID "1002" should be added to the dictionary', () => {
    cy.waitUntil(
      () =>
        cy.getConceptId(
          "1002",
          false
        ),
      { timeout: 10000 }
      );
    });
  
  When('the user is send to "Progress notification" page', () => {
    cy.visit("actions");
  });
  
  When('the user clicks on the "Add concepts" button', () => {
    cy.findByTitle("Add concepts").click();
  });
  
  Then("the current source should be CIEL", () => {
    cy.url().should("contain", "/collections/openmrs/collections/");
  });
  
  Then('the user should be on the "Progress notifications" page', () => {
    cy.url().should("contain", `/collections/${getDictionaryId()}/add/?fromSource=CIEL/`);
    cy.findByText("1000, 1001, 1002,  concept").should(
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
    cy.deleteOrganisation("CIEL", true);
  });
  
  