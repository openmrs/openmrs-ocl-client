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
    .its("isLoggedIn") || false;
export const currentUser = (): Cypress.Chainable<string> =>
  getStore()
    .invoke("getState")
    .its("auth")
    .its("profile")
    .its("username") || "admin";
export const getAuthToken = () =>
  getStore()
    .invoke("getState")
    .its("auth")
    .its("token")
    .then(token => `Token ${token}`);
export const getDictionaryId = () => dictionaryId;
export const setDictionaryId = (dictId: string) => dictionaryId = dictId;
export const getUser = () => user;
export const getOrganisationId = () => organisationId;
export const setOrganisationId = (orgId: string) => organisationId = orgId;
