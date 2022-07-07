/// <reference types="cypress" />
/// <reference types="../../../" />
import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { getDictionaryId, getUser, getConceptId } from "../../../utils";

Given("the user is on the dictionary concepts page", () => {
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/concepts/`);
  // delay until the dictionary is fully loaded
  cy.findByTestId("addConceptsIcon").should('be.visible');
});

When("the user clicks the add concepts button", () => {
  cy.findByTestId("addConceptsIcon").click();
});

When(/the user selects the "(.+)" menu list item/, menuItem =>
  cy.findByText(menuItem).click()
);

Then("the user should be on the create concept page", () =>
  cy.url().should("contain", `/concepts/new/`)
);

Given("the user is on the create concept page", () => {
  cy.visit(
    `/users/${getUser()}/sources/${getDictionaryId()}/concepts/new/?linkedDictionary=/users/${getUser()}/collections/${getDictionaryId()}/`
  );
  cy.findByText("Create concept").should("be.visible");
});

When("the user enters the concept information", () => {
  cy.findByLabelText("OCL ID").type(getConceptId());
  cy.get("#concept_class").type("{enter}");
  cy.get("#datatype").type("{enter}");
  cy.get("input[name='names[0].name']").type("test concept");
});

When("the user submits the form", () => {
  cy.get("form").submit();
});

Then("the new concept should be created", () => {
  cy.url().should("not.contain", `/new`);
  cy.findByText("test concept").should("be.visible");
});
