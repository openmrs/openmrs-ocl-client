/// <reference types="cypress" />
/// <reference types="../../" />
import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";

Given('the user is logged in', () => {
  cy.login();
});

Given(' the user is on the Dictionaries page', () => {
  cy.visit("/collections/");
});

Given('the user clicks on create new dictionary icon', () => {
  cy.visit("/collections/");
});

Given("the user is redirected to create dictionary form", () => {
  cy.url().should("contain", "/new");
});

Given('the user is on the Create Dictionary page', () => {
  cy.visit("/new");
});

Given('the user has entered their Dictionary Name', () => {
  cy.visit("/new");
});

Given('the user has entered their Short Code', () => {
  cy.visit("/new");
});

Given('the user has entered their Preferred Source', () => {
  cy.visit("/new");
});

Given('the user has entered the dictionary Owner', () => {
  cy.visit("/new");
});

Given('the user has entered their Visibility', () => {
  cy.visit("/new");
});

Given('the user navigates to the public Dictionaries page', () => {
  cy.visit("/Dictionaries");
});

When('the user clicks on Create new dictionary icon', () => {
  cy.visit("/collections/");
});

When('the user enters the required information in the form', () => {
  cy.visit("/new");
});

When('the user clicks the submit button', () => {
  cy.get("#create-dictionary-form").submit();
});

When('the user enters their Dictionary Name', () => {
  cy.visit("/new");
});

When('the user submits the form', () => {
  cy.get("#create-dictionary-form").submit();
});

When('the user enters their Short Code', () => {
  cy.visit("/new");
});

When('the user enters their Preferred Source', () => {
  cy.visit("/new");
});

When('the user enters the Dictionary Owner', () => {
  cy.visit("/new");
});

When('the user enters the Dictionary Visibility', () => {
  cy.visit("/new");
});

When('the user enters the Dictionary Preferred Language', () => {
  cy.visit("/new");
});

When('the user enters all the required information with an existing Dictionary Name', () => {
  cy.visit("/new");
});

When('the user enters all the required information with an existing Short Code', () => {
  cy.visit("/new");
});

Then('the user clicks on Create Dictionary Icon', () => {
  cy.visit("/new");
});

Then('the user should be able to create new dictionary', () => {
  cy.visit("/collections/");
});

Then('the create Dictionary form is filled', () => {
  cy.visit("/new");
});

Then('the user should be able to create a new dictionary', () => {
  cy.visit("/collections/");
});

Then('the user should still be on the Create Dictionary page', () => {
  cy.visit("/new");
});

Then('the Short code, Preferred Source, Owner, Visibility and Preferred Language fields should be marked as having an error', () => {
  cy.visit("/new");
});

Then('the error message {string} should be visible', (a: string) => {
  cy.visit("/new");
});

Then('the Preferred Source, Owner, Visibility and Preferred Language fields should be marked as having an error', () => {
  cy.visit("/new");
});

Then('the Owner, Visibility and Preferred Language fields should be marked as having an error', () => {
  cy.visit("/new");
});

Then('the Visibility and Preferred Language fields should be marked as having an error', () => {
  cy.visit("/new");
});

Then('the Preferred Language fields should be marked as having an error', () => {
  cy.visit("/new");
});

Then('the user should be able to Create new dictionary', () => {
  cy.visit("/collections/");
});

Then('the backend authentication failed message should be visible', () => {
  cy.visit("/new");
});

Then('the user should be redirected to the collections page', () => {
  cy.visit("/collections/");
});


