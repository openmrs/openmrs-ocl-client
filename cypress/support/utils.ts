import { Store } from "redux";
import { AppState } from "../../src/redux/types";

const user = Cypress.env("USERNAME") || "admin";
let dictionaryId: string = "";
let organisationId: string = "";
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
export const setDictionaryId = (dictionaryId: string) =>
  Cypress.env("dictionaryId", dictionaryId);
export const getUser = () => Cypress.env("USER") || "admin";
export const getOrganisationId = () => Cypress.env("organisationId");
export const setOrganisationId = (organisationId: string) =>
  Cypress.env("organisationId", organisationId);
