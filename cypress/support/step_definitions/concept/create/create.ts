/// <reference types="cypress" />
/// <reference types="../../../" />
import {
  Given,
  Then,
  When
} from "cypress-cucumber-preprocessor/steps";
import { customAlphabet } from "nanoid";
import { getDictionaryId, getUser, setConceptId, getConceptId } from "../../../utils";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 4);

Given("the user is on the dictionary concepts page", () =>
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/concepts/`)
);

When("the user clicks the add concepts button", () => {
  cy.get("[data-testid='addConceptsIcon']").click();
});

When("selects Create custom concept menuListItem", () =>
  cy.get("li").eq(1).click()
);

When("the user selects Other Kind menuListItem", () =>
  cy.get("li").eq(9).click()
);

Then("the user should be on the create concept page", () =>
  cy.url().should("contain", `/concepts/new/`)
);

Given("the user is on the create concept page", () => {
  cy.visit(`/users/${getUser()}/sources/${getDictionaryId()}/concepts/new/?linkedDictionary=/users/${getUser()}/collections/${getDictionaryId()}/`);
  cy.get('header h5').should('contain', 'Create concept');
  cy.get("form").should("exist");
});

When("the user enters the concept information", () => {
  
  cy.get("input[name='id']").type(setConceptId(`TC-${nanoid()}`));
  cy.get("#concept_class").type("{enter}");
  cy.get("#datatype").type("{enter}");
  cy.get("input[name='names[0].name']").type("test concept");
});

When("the user submits the form", () => {
  cy.get("form").submit();
  cy.url().should("contain", `/users/${getUser()}/collections/${getDictionaryId()}/concepts/${getConceptId()}`);
});