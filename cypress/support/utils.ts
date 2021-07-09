import { Store } from "redux";
import { AppState } from "../../src/redux/types";

export const getStore = (): Cypress.Chainable<Store<AppState>> =>
  cy.window().its("store");
export const isLoggedIn = (): Cypress.Chainable<boolean> =>
  getStore()
    .invoke("getState")
    .its("auth")
    .its("isLoggedIn") || cy.wrap(false);
export const currentUser = (): Cypress.Chainable<string> =>
  getStore()
    .invoke("getState")
    .its("auth")
    .its("profile")
    .its("username") || cy.wrap("admin");
export const getAuthToken = () =>
  getStore()
    .invoke("getState")
    .its("auth")
    .its("token")
    .then(token => `Token ${token}`);
export const getDictionaryId = () => Cypress.env("dictionaryId");
export const setDictionaryId = (dictionaryId: string) => Cypress.env("dictionaryId", dictionaryId);
export const getConceptId = () => Cypress.env("conceptId");
export const setConceptId = (conceptId: string) => Cypress.env("conceptId", conceptId);
export const getUser = () => Cypress.env("USERNAME") || "ocladmin";
export const getPassword = () => Cypress.env("PASSWORD") || "Root123";
