/// <reference types="cypress" />
/// <reference types="../../../" />
import {
    After,
    Before,
    Given,
    Then,
    When
  } from "cypress-cucumber-preprocessor/steps";
  import { customAlphabet } from "nanoid";
  import { isLoggedIn } from "../../../utils";
  
  const user = Cypress.env("USERNAME") || "admin";
  let organisationId = "";
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 4);
  
  Given(/a (public) organisation exists/, type => {
    cy.createOrganisation(organisationId, user, type === "public");
  });
  
  Given("the user is on the edit organisation page", () =>
    cy.visit(`/orgs/${organisationId}/edit/`)
  );
  
  When(/the user selects "(.+)" public_access => {
    switch (public_access) {
      case "View":
        cy.get("#public_access").type("{downarrow}{uparrow}{enter}");
        break;
      case "None":
        cy.get("#public_access").type("{downarrow}{downarrow}{enter}");
        break;
      default:
    }
  
  When("the user submits the form", () => {
    cy.get("form").submit();
    cy.url().should("not.contain", `/edit/`);
  });
  
  Then("the organisation should be publicly visible", () =>
    cy
      .getOrganisation(organisationId)
      .its("public_access")
      .should("eq", "View")
  );
  
  Then("the organisation should be publicly visible with none public access", () =>
    cy
      .getOrganisation(organisationId)
      .its("public_access")
      .should("eq", "None")
  );
  
  Before({ tags: "@organisation" }, () => {
    organisationId = `TD-${nanoid()}`;
  });
  
  After({ tags: "@organisation" }, () => {
    isLoggedIn().then((loggedIn: any) => {
      if (loggedIn) {
        cy.deleteOrganisation(organisationId, user, true);
      }
    });
  });
  