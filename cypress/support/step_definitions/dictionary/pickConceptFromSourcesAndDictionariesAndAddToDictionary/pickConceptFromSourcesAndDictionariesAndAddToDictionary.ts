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
    No: "1066",
    "Myoma": "147502",
    "Myxoma": "147501",
    "Test": "1",
    "Yes": "1065",
    Epilepsy: "155"
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
    /the user clicks on the row for "(No|Myoma|Myxoma|Yes|Epilepsy|Test)"/,
    text => {
      cy.findAllByText(text)
        .parent()
        .next()
        .click();
    }
  );
  
  When('the user clicks on the link for "No"', () => {
    cy.findByText("No").click();
  });

  When('the user clicks on the "switch-source" button', () => {
    cy.findByTestId("switch-source").click();
  });

  When('the user clicks on the link for "Test"', () => {
    cy.findByText("Test").click();
  });
  
  When("the user is sent to the view concept page", () => {
    cy.url().should("contain", "/");
  });
  
  When('the user clicks on the "Add No to dictionary" button', () => {
    cy.findByLabelText("Add No to dictionary").click({ force: true });
  });
  
  Then('the current source should be "CIEL"', () => {
    cy.url().should("contain", "/orgs/CIEL/sources/CIEL/concepts/");
  });
  
  Then('the current source should be "CTD"', () => {
    cy.url().should("contain", "/orgs/CTD/sources/CTD/concepts/");
  });

  Then('the user selects "Import existing concept"', () => {
    cy.findByText("Import existing concept").click();
  });
  
  Then('the user should be on the "Import existing concept" page', () => {
    cy.url().should("contain", "/orgs/CIEL/sources/CIEL/concepts/");
  });
  
  Then(
    /the "(No|Myoma|Myxoma)" concept should be added to the dictionary/,
    (conceptName: "No" | "Myoma" | "Myxoma" | "Yes" | "Epilepsy" | "Test") => {
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

  Then("the current source should be CTD", () => {
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
            name: "No",
            locale: "en",
            locale_preferred: true,
            name_type: "FULLY_SPECIFIED"
          }
        ],
        "/orgs/CIEL/sources/CIEL/",
        "1066"
      )
      .createConcept(
        [
          {
            name: "Myoma",
            locale: "en",
            locale_preferred: true,
            name_type: "FULLY_SPECIFIED"
          }
        ],
        "/orgs/CIEL/sources/CIEL/",
        "147502"
      )
      .createConcept(
        [
          {
            name: "Myxoma",
            locale: "en",
            locale_preferred: true,
            name_type: "FULLY_SPECIFIED"
          }
        ],
        "/orgs/CIEL/sources/CIEL/",
        "147501"
      )
      .createConcept(
        [
          {
            name: "Yes",
            locale: "en",
            locale_preferred: true,
            name_type: "FULLY_SPECIFIED"
          }
        ],
        "/orgs/CIEL/sources/CIEL/",
        "1065"
      )
      .createConcept(
        [
          {
            name: "Epilepsy",
            locale: "en",
            locale_preferred: true,
            name_type: "FULLY_SPECIFIED"
          }
        ],
        "/orgs/CIEL/sources/CIEL/",
        "155"
      );
  });
  
  After({ tags: "@ciel" }, () => {
    cy.deleteOrgSource("CIEL", "CIEL", true).deleteOrganisation("CIEL", true);
  });

  Before({ tags: "@ctd" }, () => {
    cy.createOrganisation("CTD", true)
      .createOrgSource("CTD", "CTD", true)
      .createConcept(
        [
          {
            name: "Test",
            locale: "en",
            locale_preferred: true,
            name_type: "FULLY_SPECIFIED"
          }
        ],
        "/orgs/CIEL/sources/CIEL/",
        "1"
      );
 }); 
 
 After({ tags: "@ctd" }, () => {
  cy.deleteOrgSource("CTD", "CTD", true).deleteOrganisation("CTD", true);
});
  