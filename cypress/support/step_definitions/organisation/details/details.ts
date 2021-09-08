import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { getOrganisationId } from "../../../utils";
import { nanoid } from "nanoid";

Given("an organization exists", () => {
  const organisationId = getOrganisationId();
  cy.createOrganisation(organisationId);
});

Given("a source organisation exists", () => {
  const organisation = getOrganisationId();
  cy.createMyOrgSource(organisation);
});

Given("the user is on the organisation details page", () =>
  cy.visit(`/orgs/${getOrganisationId()}`)
);

Then("the user should see details of the organisation", () => {
  cy.findByText("Details").should("be.visible");
  cy
    .getOrganisation(getOrganisationId())
    .its("name")
    .should("eq", "Test Organisation");
  cy.findByText("Sources", { selector: "legend" }).should("be.visible");
  cy.findByText("Members", { selector: "legend" }).should("be.visible");
  cy.findByText("Dictionaries", { selector: "legend" }).should("be.visible");
});

Then("the user should see the organisation source", () => {
  const organisation = getOrganisationId();
  cy.createMyOrgSource(organisation);
  cy.getOrgSources(organisation);
  cy.findByText("My Org Source", { selector: "li" }).should("be.visible");
  cy.get('ul').contains('li', 'My Org Source');
});

When("the user clicks on the source", () =>
  cy.get('ul li a').click()
);

Then("the user should be on the org source page", () =>
  cy.url().contains(`orgs/${getOrganisationId()}/sources/${`TOS-${nanoid()}`}`)
);