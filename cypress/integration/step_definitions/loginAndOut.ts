import { login, logout } from "../../../src/apps/authentication/tests/e2e/testUtils";
import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";

Given("User visits user collection page", async () => {
  cy.visit("/user/collections/");
});

Given("User should access login", async () => {
  cy.queryByText("Log In to Open Concept Lab").should("exist");
});

When("User logins in", async () => {
  login();
});

When("User re-visits user collection page", async () => {
  cy.visit("/user/collections/");
});

Then("User should access dictionaries", async () => {
   cy.findByPlaceholderText("Search Dictionaries").should("exist");
});

Then("User logs out", async () => {
   logout();
});
