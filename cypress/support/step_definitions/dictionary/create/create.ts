/// <reference types="cypress" />
/// <reference types="../../../" />
import {
  After,
  Before,
  Given,
  Then,
  When
} from "cypress-cucumber-preprocessor/steps";
import { getDictionaryId, getUser } from "../../../utils";

Given("the user is on the dictionaries page", () =>
  cy.visit("/user/collections/")
);

Given("the user is on the create new dictionary page", () =>
  cy.visit("/collections/new/")
);

When("the user clicks on the create new dictionary button", () =>
  cy.findByTitle(/Create new dictionary/i).click()
);

When("the user enters the dictionary information", () => {
  cy.findByLabelText(/Dictionary Name/i).type(getDictionaryId());
  cy.findByLabelText(/Short Code/i).type(getDictionaryId());
  // these are the form drop-downs, which are quite hard to
  // to automate, so I've elected to do this kind of hack
  // hopefully it can be replaced with something better
  cy.get("#preferred_source").type("{enter}");
  cy.get("#owner_url").type("{enter}");
  cy.get("#public_access").type("{enter}");
  cy.get("#default_locale").type("{enter}");
});

When(/the user selects "(.+)" visibility/, public_access => {
  switch (public_access) {
    case "Public":
      cy.get("#public_access").type("{downarrow}{uparrow}{enter}");
      break;
    case "Private":
      cy.get("#public_access").type("{downarrow}{downarrow}{enter}");
      break;
    default:
      throw `Unknown visibility type ${public_access}. I only know how to handle "Public" or "Private".`;
  }
});

When("the user submits the form", () => {
  cy.get("form").submit();
  cy.url().should("contain", `/users/${getUser()}/collections/${getDictionaryId()}/`);
});

Then("the user should be on the create new dictionary page", () =>
  cy.url().should("contain", "/collections/new/")
);

Then("the new dictionary should be created", () =>
  cy.getDictionary(getDictionaryId()).should("exist")
);

Then("the dictionary should be publicly visible", () =>
  cy
    .getDictionary(getDictionaryId())
    .its("public_access")
    .should("eq", "View")
);

Then("the dictionary should not be publicly visible", () =>
  cy
    .getDictionary(getDictionaryId())
    .its("public_access")
    .should("eq", "None")
);

Then("the new source should be created", () =>
  cy.getSource(getDictionaryId()).should("exist")
);

Then("the source should be publicly visible", () =>
  cy
    .getSource(getDictionaryId())
    .its("public_access")
    .should("eq", "View")
);

Then("the source should not be publicly visible", () =>
  cy
    .getSource(getDictionaryId())
    .its("public_access")
    .should("eq", "None")
);