// <reference types="cypress" />
/// <reference types="../../../" />
import {
  Given,
  Then,
  When
} from "cypress-cucumber-preprocessor/steps";
import { getConceptVersionUrl } from "../../../utils";

Given("the user is on the edit concept page", () => {
  cy.visit(`${getConceptVersionUrl()}edit/`)
});

When("the user edits the concept name", () => {
  cy.get("input[name='names[0].name']").type("test concept edited");
});

When("the user submits the form", () =>
  cy.get("form").submit()
);

// This has some weird behaviour, we shall come back to it later
// Then("the concept should be updated", () => {
//   cy.url().should("not.contain", '/edit');
//   cy.findByText("test concept edited").should("be.visible");
// });

When("the user clicks the Menu button", () => {
  cy.findByTitle("Menu").click();
});

When(/the user selects the "(.+)" menu list item/, menuItem => {
  cy.findByText(menuItem).click();
});

Then("the concept should be retired", () => {
  cy.url().should("not.contain", '/edit');
});
