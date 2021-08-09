/// <reference types="cypress" />
/// <reference types="../../" />
import { After, Before, Given } from "cypress-cucumber-preprocessor/steps";
import { customAlphabet } from "nanoid";
import {
  getDictionaryId, getOrganisationId,
  getUser, getVersionId,
  isLoggedIn,
  setConceptId,
  setDictionaryId, setOrganisationId,
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

Given("a version exists", () => {
  const versionId = getVersionId();
  const dictionaryId = getDictionaryId();
  const user = getUser();
  cy.createVersion(versionId, dictionaryId, user);
});

Given("a version is released", () => {
  const versionId = getVersionId();
  const dictionaryId = getDictionaryId();
  const user = getUser();
  cy.updateVersion(versionId, dictionaryId, user);
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

Before({ tags: "@organisation" }, () => {
  setOrganisationId(`Org-${nanoid()}`);
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
After({ tags: "@organisation" }, () => {
  isLoggedIn().then(loggedIn => {
    if (loggedIn) {
      const organisationId = getOrganisationId();
      cy.deleteOrganisation(organisationId, true);
    }
  });
});
