/// <reference types="cypress" />
/// <reference types="../../" />
import { After, Before, Given } from "cypress-cucumber-preprocessor/steps";
import { customAlphabet } from "nanoid";
import {
  getDictionaryId,
  getUser,
  isLoggedIn,
  setConceptId,
  setDictionaryId,
  setVersionId
} from "../../utils";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 4);

Given("the user is logged in", () => cy.visit("/").login());

Given("a dictionary exists", () => {
  const dictionaryId = getDictionaryId();
  const user = getUser();
  cy.createSource(dictionaryId, user).then(() =>
    cy.createDictionary(dictionaryId, user)
  );
});

Before({ tags: "@dictionary" }, () => {
  setDictionaryId(`TD-${nanoid()}`);
});
Before({ tags: "@concept" }, () => {
  setConceptId(`CT-${nanoid()}`);
});

Before({ tags: "@version" }, () => {
  setVersionId(`Ver-${nanoid()}`);
});

After({ tags: "@dictionary" }, () => {
  isLoggedIn().then(loggedIn => {
    if (loggedIn) {
      const dictionaryId = getDictionaryId();
      const user = getUser();
      cy.deleteDictionary(dictionaryId, user, true);
      cy.deleteSource(dictionaryId, user, true);
    }
  });
});
