/// <reference types="cypress" />
/// <reference types="../../../" />
import { 
  After, 
  Before, 
  Given, 
  Then, 
  When } from "cypress-cucumber-preprocessor/steps";
import { getDictionaryId, getUser } from '../../../utils';

Given("the user is on the view dictionary concepts page", () => {
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/concepts/`);
  cy.url().should(
    "contain",
    `/users/${getUser()}/collections/${getDictionaryId()}/concepts/`
  );
});

Given('the user is on the "Add concepts in bulk from CIEL" page', () => {
  cy.visit(
    `/users/${getUser()}/collections/${getDictionaryId()}/add/?fromSource=CIEL`
  );
  
  cy.url().should(
    "contain",
    `/users/${getUser()}/collections/${getDictionaryId()}/add/?fromSource=CIEL`
  );
});

Given('CIEL concept "1000" is already in the dictionary', () => {
  cy.createConcept(
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
  );
});

When('the user clicks the "Add concepts" button', () => {
  cy.findByTitle("Add concepts").click();
});

When('the user selects "Add bulk concepts"', () => {
  cy.visit(
    `/users/${getUser()}/collections/${getDictionaryId()}/add/?fromSource=CIEL`
  );
});

Then('the user navigates to the "Progess notification" page', () => {
  cy.visit(
    `/actions/`
  );
  cy.url().should("contain", `/actions`);
});

When('the user enters concept Id "1000"', () => {
    cy.get("textarea").type("1000")
  }
);

When('the user clicks the "ADD CONCEPTS" button', () => {
  cy.intercept('/orgs/CIEL/sources/CIEL/*/*').as('loadMappings');
  cy.intercept('PUT', `/users/${`getUser()`}/collections/${getDictionaryId()}/references/*`).as('addReferences')
  cy.findByText("Add concepts").click().wait(['@loadMappings', '@loadMappings']).wait('@addReferences');
});

When(
  /the user enters concept Id "(1001|1002)"/, (conceptId) => {
    cy.get("textarea").type(` ${conceptId}`);
  }
); 
 
Then('the user selects "Import existing concept"', () => {
   cy.findByText("Import existing concept").click();
});

Then('the user should be on the "Add concepts in bulk from CIEL" page', () => {
   cy.url().should("contain", `/users/${getUser()}/collections/${getDictionaryId()}/add/?fromSource=CIEL`);
});

Then(
  /the concept Id "(1000|1001|1002)" should be in the dictionary/, (conceptId) => {
    cy.waitUntil(
      () =>
        cy.getConcept(
          `/users/${getUser()}/collections/${getDictionaryId()}`,
          conceptId,
          false
        ),
      { timeout: 10000 }
    );
  });    

Then('concept Id "1000" should be skipped', () => {
  cy.visit("/actions")
  cy.findByText("1 concept skipped").should("be.visible");
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
