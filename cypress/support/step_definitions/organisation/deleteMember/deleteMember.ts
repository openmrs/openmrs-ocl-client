import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { getOrganisationId } from "../../../utils";

Given("the user is on the organisation detail page", () => {
  cy.visit(`/orgs/${getOrganisationId()}/`);
  cy.findByText("Members").should("be.visible");
  cy.waitUntil(() => cy.contains("li", "openmrs", { timeout: 10000 }));
});
When("the user clicks on the delete member button", () =>{
  cy
    .contains("li", "openmrs")
    .get("li > button")
    .first()
    .click();
cy.findByRole("button", { name: /Yes/i }).click();
}
);

Then("the member should be deleted", () => {
  cy.get("li").should("not.contain", "openmrs");
});
