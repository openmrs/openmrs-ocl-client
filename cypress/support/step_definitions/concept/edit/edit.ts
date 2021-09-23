// <reference types="cypress" />
/// <reference types="../../../" />
import {
  Given,
  Then,
  When
} from "cypress-cucumber-preprocessor/steps";
import { getDictionaryId, getUser, getConceptId } from "../../../utils";

Given("the user is on the edit concept page", () => {
  cy.visit(`/users/${getUser()}/sources/${getDictionaryId()}/concepts/${getConceptId()}/edit/`)
});

When("the user edits the concept name", () => {
  cy.get("input[name='names[0].name']").type("test concept edited");
});

When("the user submits the form", () => 
  cy.get("form").submit()
);

Then("the concept should be updated", () => {
  cy.url().should("not.contain", '/edit');
  cy.findByText("test concept edited").should("be.visible");
});

When("the user clicks the Menu button", () => {
  cy.findByTitle("Menu").click();
});

When(/the user selects the "(.+)" menu list item/, menuItem => {
  cy.findByText(menuItem).click();
});

Then("the concept should be retired", () => {
  cy.url().should("not.contain", '/edit');
  cy.findByTitle("Menu").click();
  cy.findByText("Unretire concept").should("be.visible");
});
