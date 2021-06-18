/// <reference types="cypress" />
/// <reference types="../../" />
import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

// ensure the user is logged out
Given("the user is not logged in", () => {
  cy.logout();
  cy.visit("/login");
});

Given("the user is on the login page", () => {
  cy.visit("/login");
});

Given("the user navigates to the public sources page", () => {
  cy.visit("/sources");
});

Given("the user is redirected to the login page", () => {
  cy.url().should("contain", "/login");
});

When("the user enters their credentials", () => {
  cy.get("#username").type("admin");
  cy.get("#password").type("Admin123");
});

When("the user enters the wrong credentials", () => {
  cy.get("#username").type("notauser");
  cy.get("#password").type("notapassword");
});

When("the user enters their username", () => {
  cy.get("#username").type("admin");
});

When("the user enters their password", () => {
  cy.get("#password").type("Admin123");
});

When("the user submits the form", () => {
  cy.get("#login-form form").submit();
});

When("the user presses enter", () => {
  cy.get("#password").type("{enter}");
});

When("the user clicks the submit button", () => {
  cy.get('button[type="submit"]').click();
});

Then("the user should be logged in", () => {
  cy.url().should("not.contain", "/login");
});

Then(
  /(?:the user should still be on the login page)|(?:the user should be redirected to the login page)/,
  () => {
    cy.url().should("contain", "/login");
  }
);

Then(
  /the (username|password) field should be marked as having an error/,
  field => {
    cy.get(`#${field}`).should("have.attr", "aria-invalid");
  }
);

Then(/the error message "(.+)" should be visible/, (errMsg: string) => {
  cy.findByText(errMsg).should("be.visible");
});

Then("the backend's authentication failed message should be visible", () => {
  cy.get('[data-testid="login-status-message"]').should("be.visible");
});

Then("the user should be on the public sources page", () => {
  cy.url().should("contain", "/sources");
});
