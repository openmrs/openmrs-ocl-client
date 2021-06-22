/// <reference types="cypress" />
/// <reference types="../../support" />
import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

// ensure the user is logged in
Given("the user clicks on the Create new dictionary icon", () => {
  cy.visit("/Dictionary");
});

When("the user user fills in the required information on the form", () => {
cy.get("#create dictionary").type("form");
});

Then("the user submits the form and the system creates a new dictionary", () => {
cy.url().should("not.contain", "/dictionary");
});



