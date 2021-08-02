/// <reference types="cypress" />
/// <reference types="../../../" />
import {
  Given,
  Then,
  When
} from "cypress-cucumber-preprocessor/steps";
import { getDictionaryId, getUser, getConceptId } from "../../../utils";


Given("the user is on the view dictionary concepts page", () => {
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/concepts/`);
});

When('the user clicks the "Add concepts" button', () => {
  cy.findByTitle("Add concepts").click();
});

Then('the user selects "Import existing concept"', () => {
  cy.visit(`/orgs/CIEL/sources/CIEL/concepts/?addToDictionary=/users/${getUser()}/collections/${getDictionaryId()}/`);
});

Then('the user should be on the "Import existing concept" page', () => {
  cy.url().should("contain", "/orgs/CIEL/sources/CIEL/concepts/");
});

Given('the user is on the "Import existing concept" page', () => {
  cy.visit(`/orgs/CIEL/sources/CIEL/concepts/?addToDictionary=/users/${getUser()}/collections/${getDictionaryId()}/`);
});

When('the user clicks on the row for "Serum"', () => {
  cy.findByText("Serum").click();
});

When('the user clicks the "Add selected to dictionary" button', () => {
  cy.findByTitle("Add selected to dictionary").click();
});

Then('the "Serum" concept should be added to the dictionary', () => {
  cy.url().should('include', `/orgs/CIEL/sources/CIEL/concepts/?addToDictionary=/users/${getUser()}/collections/${getDictionaryId()}/Serum/`)
});

When('the user clicks on the row for "Whole blood sample"', () => {
  cy.findByText("Whole blood sample").click();
});

Then('the "Serum" concept should be added to the dictionary', () => {
  cy.visit("users/openmrs/collections")
});

When('the user clicks on the row for "Plasma"', () => {
  cy.findByText("Plasma").click()
});

When('the user clicks on the link for "Serum"', () => {
  cy.findByText("Serum").click();
});

When("the user is sent to the view concept page", () => {
  cy.visit("users/openmrs/collections")
});

When('the user clicks on the "Add selected to dictionary" button', () => {
  cy.findByTitle("Add selected to dictionary").click();
});

Then("the current source should be CIEL", () => {
  cy.url().should("contain", "/users/openmrs/collections/");
});

Then("the user should be on the view concept page", () => {
  cy.url().should("contain", `/users/openmrs/collections`);
  cy.findByText("Serum,Whole blood sample, Plasma,  concept").should("be.visible");
});
