/// <reference types="cypress" />
/// <reference types="../../" />
import { After, Before, Given } from "cypress-cucumber-preprocessor/steps";
import { customAlphabet } from "nanoid";
import {
  getDictionaryId,
  getNewUser,
  getOrganisationId,
  getUser,
  getVersionId,
  getConceptId,
  isLoggedIn,
  setConceptId,
  setDictionaryId,
  setNewUser,
  setOrganisationId,
  setVersionId
} from "../../utils";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 4);

Given("the user is logged in", () => cy.visit("/").login());

Given("a dictionary exists", () => {
  const dictionaryId = getDictionaryId();
  const user = getUser();
  cy.createSource(dictionaryId, user).then(() =>
    cy
      .createDictionary(dictionaryId, user)
      .then(() => cy.waitUntil(() => cy.getDictionary(dictionaryId, user)))
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

Given("an organization exists", () => {
  const organisationId = getOrganisationId();
  cy.createOrganisation(organisationId);
});

Given("a new user exists", () => {
  const username = getNewUser();
  cy.createUser(username);
});

Given("a new member is added", () => {
  const username = getNewUser();
  const organisationId = getOrganisationId();
  cy.addMember(organisationId, username);
});

Given("a concept exists", () => {
    cy.createOrganisation(getOrganisationId()).then(() =>
    cy.createOrgSource(undefined, getOrganisationId())
    .createConcept(
      [
        {
          name: "Test Concept 1",
          locale: "en",
          locale_preferred: true,
          name_type: "FULLY_SPECIFIED"
        }
      ],
      `/users/${getUser()}/sources/${getDictionaryId()}/`,
      getConceptId()
    )
    .then(() => cy.waitUntil(() => cy.getConcept(`/users/${getUser()}/sources/${getDictionaryId()}/`, getConceptId())))
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

Before({ tags: "@organisation" }, () => {
  setOrganisationId(`Org-${nanoid()}`);
});

Before({ tags: "@member" }, () => {
  setNewUser(`openmrs`);
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
