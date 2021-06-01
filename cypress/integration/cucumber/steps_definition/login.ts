import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
/// <reference types="../../../support" />

Given("User tries to visit collections page", async () => {
  cy.visit("/user/collections/");
});

Given("User is redirected to login page", async () => {
  cy.get("Log In to Open Concept Lab").should("be.visible")
});

When("User logs in", async () => {
  cy.login();
});

When("User re-visits collections page", async () => {
  cy.visit("/user/collections/");
});

Then("User should access collections", async () => {
  cy.findByPlaceholderText("Search Dictionaries").should("exist");
});