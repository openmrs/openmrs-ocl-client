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

When("the user clicks the add concepts button", () =>
  cy.get("[data-testid='addConceptsIcon']").click()
);

// When("the user clicks the Create custom concept button link", () =>
//   cy.get("li").eq(1).click()
// );

// When(/the user selects "(.+)"/, (otherKind) =>
//   cy.get(otherKind).click()
// );

Then("the user should be on the create concept page", () =>
  cy.url().should("contain", `/concepts/new/`)
);

Given("the user is on the create concept page", () =>
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/concepts/new/`)
);

When("the user enters the concept information", () => {
  cy.get("#id").type(setConceptId(`TC-${nanoid()}`));
  cy.get("#concept_class").type("{enter}");
  cy.get("#datatype").type("{enter}");
  cy.get("#names[0].name").type("{enter}");
  cy.get("#descriptions[0].description").type("{enter}");
});

When("the user submits the form", () => {
  cy.get("form").submit();
  cy.url().should("contain", `/users/${getUser()}/collections/${getDictionaryId()}/concepts/${getConceptId()}`);
});