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

let organisationID = "";
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 4);

Given("the user is on the organisations page", () => cy.visit("/orgs/"));

Given("the user is on the create new organisation page", () =>
  cy.visit("/orgs/new/")
);

When("the user clicks on the create new organisation button", () =>
  cy.findByTitle(/Create new organisation/i).click()
);

When("the user enters the organisation information", () => {
  cy.findByLabelText(/Organisation ID/i).type(organisationID);
  cy.findByLabelText(/Organisation Name/i).type(organisationID);
  cy.get("#public_access").type("{enter}");
});

When(/the user selects "(.+)" view/, public_access => {
  switch (public_access) {
    case "View":
      cy.get("#public_access").type("{downarrow}{uparrow}{enter}");
      break;
    case "None":
      cy.get("#public_access").type("{downarrow}{downarrow}{enter}");
      break;
    default:
  }
});

When("the user submits the form", () => {
  cy.get("form").submit();
  cy.url().should("contain", `/orgs/${organisationID}/`);
});

Then("the user should be on the create new organisation page", () =>
  cy.url().should("contain", "/orgs/new/")
);

Then("the new organisation should be created", () =>
  cy.getOrganisation(organisationID).should("exist")
);

Then("the organisation should be publicly visible", () =>
  cy
    .getOrganisation(organisationID)
    .its("public_access")
    .should("eq", "View")
);

Then("the organisation should be viewed publicly accessed", () =>
  cy
    .getOrganisation(organisationID)
    .its("public_access")
    .should("eq", "None")
);

Before({ tags: "@organisation" }, () => {
  organisationID = `Org-${nanoid()}`;
});

After({ tags: "@organisation" }, () => {
  isLoggedIn().then(loggedIn => {
    if (loggedIn) {
      cy.deleteOrganisation(organisationID, true);
    }
  });
});
