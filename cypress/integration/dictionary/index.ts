/// <reference types="cypress" />
/// <reference types="../../support" />
import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

// ensure the user is logged in
Given("the user is logged in", () => {
  cy.visit("/Login");
});

Given("the user clicks on the Dictionaries icon", () => {
  cy.get("#Create Dictionary").type("form");
});

Then("Then the user is able to see the Create new dictionary icon", () => {
cy.get("#Create Dictionary").type("form");
});

When("the user clicks on Create new dictionary icon", () => {
cy.get("#/Dictionaries");
});
