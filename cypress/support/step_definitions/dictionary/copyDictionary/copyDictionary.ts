import 'cypress-wait-until';
import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { getDictionaryId, getUser } from "../../../utils";

Given("the user is on the dictionary page", () => {
  cy.visit(`/users/${getUser()}/collections/${getDictionaryId()}/`);
  cy.findByText("Versions").should("be.visible");
});
When("the user clicks the more actions button", () =>
  cy.findByTitle("More actions").click()
);
When(/the user selects the "(.+)" menu list item/, menuItem =>
  cy.findByText(menuItem).click()
);
When("the user is on copy dictionary form", () =>
  cy.url().should("contain",`/collections/new/`)
);
When("the user enters the new dictionary information", () => {
  cy.findByLabelText(/Dictionary Name/i).type(`${getDictionaryId()}-new`);
  cy.findByLabelText(/Short Code/i).type(`${getDictionaryId()}-new`);
});
When("the user submits the form", () => {
  cy.get("form").submit();
  cy.waitUntil(() =>   cy.url().should("contain", `/users/${getUser()}/collections/${getDictionaryId()}-new/`), { timeout: 10000 });
});
Then("the new dictionary should be created", () =>
  cy.getDictionary(`${getDictionaryId()}-new`).should("exist")
);
Then("the new source should be created", () =>
  cy.getSource(`${getDictionaryId()}-new`).should("exist")
);