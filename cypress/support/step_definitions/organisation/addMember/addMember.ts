import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { getOrganisationId } from "../../../utils";

Given("the user is on the organisation detail page", () => {
  cy.visit(`/orgs/${getOrganisationId()}/`);
  cy.findByText("Members").should("be.visible");
  cy.contains("ul", "ocladmin");
});
When("the user clicks on the add new member button", () =>
  cy.findByRole("button", { name: /Add New Member/i }).click()
);
Then("the user should be on the add new member dialog box", () =>
  cy.waitUntil(() => cy.findByText("Add new member", { timeout: 10000 }))
);

Given("the user is on the add new member dialog box", () => {
  cy.visit(`/orgs/${getOrganisationId()}/`);
  cy.findByRole("button", { name: /Add New Member/i }).click();
  cy.waitUntil(() => cy.findByText("Add new member", { timeout: 10000 }));
});
When("the user enters the member information", () => {
  cy.findByLabelText("Username").type("openmrs");
});
When("the user submits the form", () => {
  cy.findByRole("button", { name: /Submit/i }).click();
});
Then("the new member should be added", () => {
  cy.contains("ul", "openmrs");
});
