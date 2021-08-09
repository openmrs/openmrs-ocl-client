import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { getOrganisationId } from "../../../utils";

Given(/a (public|private) organization exists/, type => {
  const organisationId = getOrganisationId();
  cy.createOrganisation(organisationId, type === "public");
});

Given("the user is on the edit organization page", () =>
  cy.visit(`/orgs/${getOrganisationId()}/edit/`)
);

When(/the user selects "(.+)" Public Access/, public_access => {
  switch (public_access) {
    case "View":
      cy.get("#public_access").type("{uparrow}{uparrow}{enter}");
      break;
    case "None":
      cy.get("#public_access").type("{downarrow}{downarrow}{enter}");
      break;
    default:
      throw `Unknown Public Access ${public_access}. I only know how to handle "View" and "None".`;
  }
});

When("the user submits the form", () => {
  cy.get("form").submit();
  cy.url().should("not.contain", `/edit/`);
});

Then("the organization should not be publicly visible", () =>
  cy
    .getOrganisation(getOrganisationId())
    .its("public_access")
    .should("eq", "None")
);

Then("the organization should be publicly visible", () =>
  cy
    .getOrganisation(getOrganisationId())
    .its("public_access")
    .should("eq", "View")
);