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

const user = Cypress.env("USERNAME") || "admin";
let dictionaryId = "";
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 4);

Given(/a (public|private) dictionary exists/, type => {
  cy.createDictionary(dictionaryId, user, type === "public");
  cy.createSource(dictionaryId, user, type === "public");
});

Given("the user is on the edit dictionary page", () =>
  cy.visit(`/users/${user}/collections/${dictionaryId}/edit/`)
);

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
  cy.url().should("not.contain", `/edit/`);
});

Then("the dictionary should be publicly visible", () =>
  cy
    .getDictionary(dictionaryId)
    .its("public_access")
    .should("eq", "View")
);

Then("the dictionary should not be publicly visible", () =>
  cy
    .getDictionary(dictionaryId)
    .its("public_access")
    .should("eq", "None")
);

Then("the source should be publicly visible", () =>
  cy
    .getSource(dictionaryId)
    .its("public_access")
    .should("eq", "View")
);

Then("the source should not be publicly visible", () =>
  cy
    .getSource(dictionaryId)
    .its("public_access")
    .should("eq", "None")
);

Before({ tags: "@dictionary" }, () => {
  dictionaryId = `TD-${nanoid()}`;
});

After({ tags: "@dictionary" }, () => {
  isLoggedIn().then(loggedIn => {
    if (loggedIn) {
      cy.deleteDictionary(dictionaryId, user, true);
      cy.deleteSource(dictionaryId, user, true);
    }
  });
});
