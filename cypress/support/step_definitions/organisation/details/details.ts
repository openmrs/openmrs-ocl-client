import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { getOrganisationId } from "../../../utils";

Given("an organization exists", () => {
  cy.createOrganisation(getOrganisationId());
});

Given("a source exists in the organisation", () => {
  cy.createOrgSource(undefined, getOrganisationId());
});

Given("a dictionary exists in the organisation", () => {
  cy.createOrgDictionary(undefined, getOrganisationId());
});

Given("the user is on the organisation details page", () =>
  cy.visit(`/orgs/${getOrganisationId()}/`)
);

Then("the organisation name should be displayed", () => {
  cy.findByText("Details").should("be.visible");
  cy.findByText("Test Organisation", { selector: "span" }).should("be.visible");
});

Then("the organisation sources should be displayed", () => {
  cy.findByText("Sources", { selector: "legend" }).should("be.visible");
});

Then("the organisation members should be displayed", () => {
  cy.findByText("Members", { selector: "legend" }).should("be.visible");
});

Then("the organisation dictionaries should be displayed", () => {
  cy.findByText("Dictionaries", { selector: "legend" }).should("be.visible");
});

Then("the user should see the organisation source", () => {
  cy.contains("li", "Test Org Source");
});

When("the user clicks on the source", () =>
    cy.contains("li", "Test Org Source").get("li > a").click()
);

Then("the user should be on the org source page", () =>
  cy.url().should("contain",`/orgs/${getOrganisationId()}/sources/`)
);

Then("the user should see the organisation dictionary", () => {
  cy.contains("li", "Test Org Dictionary");
});

When("the user clicks on the dictionary", () =>
    cy.contains("li", "Test Org Dictionary").get("li > a").click()
);

Then("the user should be on the org dictionary page", () =>
    cy.url().should("contain",`/orgs/${getOrganisationId()}/collections/`)
);
