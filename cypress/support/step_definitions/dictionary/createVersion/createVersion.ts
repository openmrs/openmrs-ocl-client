/// <reference types="cypress" />
/// <reference types="../../../" />
import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { getDictionaryId, getUser, getVersionId } from "../../../utils";

Given("the user is on the dictionary page", () => {
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/`);
  cy.findByText("Versions").should("be.visible");
});
When("the user clicks the create new version button", () =>
  cy.findByRole("button", { name: /Create new version/i }).click()
);
Then("the user should be on the create new version dialog box", () =>
  cy.findByText("Create new version", { selector: "h2" }).should("be.visible")
);

Given("the user clicks on the create new version dialog box", () => {
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/`);
  cy.findByRole("button", { name: /Create new version/i }).click();
  cy.findByText("Create new version", { selector: "h2" }).should("be.visible");
});
When("the user enters the version information", () => {
  cy.findByLabelText("ID").type("1");
  cy.get("#released").type("{enter}");
});
When("the user submits the form", () => {
  cy.findByRole("button", { name: /Submit/i }).click();
});
Then("the new version should be created", () => {
  cy.get("table").contains("td", "1");
  cy.get('[type="checkbox"]').should("not.be.checked");
});

When("the user clicks release status switch", () => {
  cy.reload(true);
  cy.waitUntil(
    () => cy.getVersion(getVersionId(), getDictionaryId(), getUser(), false),
    { timeout: 10000 }
  );
  cy.get('[type="checkbox"]').check();
});
When("the release dialog opens", () =>
  cy.get("#confirmation-dialog-title").should("be.visible")
);
When("the user clicks yes button", () => cy.findByText(/Yes/i).click());
Then("the version should be released", () =>
  cy.get('[type="checkbox"]').should("be.checked")
);

When("the user clicks the more actions button", () =>
  cy.findByLabelText("More actions").click()
);
When(/the user selects the "(.+)" menu list item/, menuItem =>
  cy.findByText(menuItem).click()
);
Then("the subscription url should be copied", () => {
  cy.window().then(win => {
    win.navigator.clipboard.readText().then(text => {
      expect(text).to.contain(
        `/users/${getUser()}/collections/${getDictionaryId()}/${getVersionId()}/`
      );
    });
  });
});
