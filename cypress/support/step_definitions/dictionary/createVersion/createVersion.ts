import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import {getDictionaryId, getUser, getVersionId} from "../../../utils";

Given("the user is on the dictionary page", () => {
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/`);
  cy.findByText("Versions").should("be.visible");
});
When("the user clicks the create new version button", () => {
  cy.findByRole("button", { name: /Create new version/i }).click();
});
Then("the user should be on the create new version dialog box", () =>
  cy.get("h2").contains("Create new version")
);

Given("the user is on the create new version dialog box", () => {
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/`);
  cy.findByRole("button", { name: /Create new version/i }).click();
  cy.get("h2").contains("Create new version");
});
When("the user enters the version information", () => {
  cy.findByLabelText("ID").type("1");
  cy.get("#released").type("{enter}");
});
When("the user submits the form", () => {
  cy.get("#versionForm").submit();
});
Then("the new version should be created", () => {
  cy.get("table").should("exist");
  cy.get("table tbody tr").should("have.length", 1);
  cy.get("table").contains("td", "1");
  cy.get("table").contains("td", "No");
});

When("the user clicks release status switch", () => {
  cy.get('[type="checkbox"]').check();
});
When("the release dialog opens", () => {
  cy.get("#confirmation-dialog-title").should("exist");
});
When("the user clicks yes button", () => {
  cy.get("button.MuiButton-textPrimary")
    .eq(1)
    .click();
});
Then("the version should be released", () =>
  cy.get('[type="checkbox"]').should("be.checked")
);

When("the user clicks the more actions button", () => {
  cy.findByTitle("More actions").click();
});
When(/the user selects the "(.+)" menu list item/, menuItem =>
  cy.findByText(menuItem).click()
);
Then("the subscription url should be copied", () =>
cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/${getVersionId()}`)
);
