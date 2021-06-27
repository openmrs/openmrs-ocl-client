/// <reference types="cypress" />
/// <reference types="../../" />
import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

// ensure the user is logged in
Given('the user is logged in', () => {
  cy.login();
  cy.visit("/collections");
});

Given('the user is on the user collections page', () => {
  cy.visit("/user/collections");
});

When('the user clicks on Create a new dictionary icon', () => {
  cy.visit("/user/collections");
});

Then('a user should be sent to the Create Dictionary page', () => {
  cy.visit("/collections/new");
});

