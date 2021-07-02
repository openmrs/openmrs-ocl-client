import "@testing-library/cypress/add-commands";
import {
  LOGIN_ACTION,
  LOGOUT_ACTION
} from "../../src/apps/authentication/redux/actionTypes";
import { nanoid } from "nanoid";
import { getStore, getAuthToken } from "./utils";

const apiUrl: string = Cypress.env("API_URL") || "http://localhost:8000";

Cypress.Commands.add(
  "login",
  (
    username: string = Cypress.env("USERNAME") || "admin",
    password: string = Cypress.env("PASSWORD") || "Admin123"
  ) => {
    cy.url().then(url => {
      if (url === undefined || url === null || url === "about:blank") {
        cy.visit("/");
      }

      getStore().then(store => {
        if (store === undefined) {
          throw "Could not load the Redux store for this application";
        }

        // already logged in
        if (
          store.getState().auth.profile?.username === username &&
          store.getState().auth.token
        ) {
          return;
        }

        const token = Cypress.env("TOKEN");

        if (!token) {
          cy.request({
            method: "POST",
            url: `${apiUrl}/users/login/`,
            body: {
              username: username,
              password: password
            }
          }).then(response => {
            store.dispatch({
              type: LOGIN_ACTION,
              payload: response.body
            });
          });
        } else {
          store.dispatch({ type: LOGIN_ACTION, payload: { token: token } });
        }
      });
    });
  }
);

Cypress.Commands.add("logout", () => {
  // if we're not on a page, we're not logged in
  cy.url().then(url => {
    if (url === undefined || url === null || url === "about:blank") {
      return;
    }

    getStore().then(store => {
      // if we don't have  store, we're not logged in
      if (typeof store === "undefined") {
        return;
      }

      store.dispatch({ type: LOGOUT_ACTION });
    });
  });
});

Cypress.Commands.add(
  "createDictionary",
  (
    dictionary: string = `TD-${nanoid()}`,
    username: string = Cypress.env("USERNAME") || "admin",
    public_access: boolean = false
  ) => {
    getAuthToken().then(authToken =>
      cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/users/${username}/collections/${dictionary}/`,
          failOnStatusCode: false
        })
        .then(response => {
          if (response.status !== 200) {
            cy.request({
              method: "POST",
              headers: {
                Authorization: authToken
              },
              url: `${apiUrl}/users/${username}/collections/`,
              body: {
                id: dictionary,
                custom_validation_schema: "OpenMRS",
                short_code: dictionary,
                name: "Test Dictionary",
                description: "",
                default_locale: "en",
                preferred_source: "CIEL",
                public_access: public_access ? "View" : "None",
                collection_type: "Dictionary",
                extras: {
                  source: `/users/${username}/sources/${dictionary}/`
                }
              }
            });
          }
        })
    );

    return cy.wrap(dictionary);
  }
);

Cypress.Commands.add(
  "deleteDictionary",
  (
    dictionary: string,
    username: string = Cypress.env("USERNAME") || "admin",
    isCleanup: boolean = false
  ) => {
    getAuthToken().then(authToken =>
      cy.request({
        method: "DELETE",
        headers: {
          Authorization: authToken
        },
        url: `${apiUrl}/users/${username}/collections/${dictionary}/`,
        failOnStatusCode: !!!isCleanup
      })
    );
  }
);

Cypress.Commands.add(
  "getDictionary",
  (
    dictionary: string,
    username: string = Cypress.env("USERNAME") || "admin"
  ) => {
    return getAuthToken().then(authToken => {
      return cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/users/${username}/collections/${dictionary}/`
        })
        .its("body");
    });
  }
);

Cypress.Commands.add(
  "createSource",
  (
    source: string = `TD-${nanoid()}`,
    username: string = Cypress.env("USERNAME") || "admin",
    public_access: boolean = false
  ) => {
    getAuthToken().then(authToken =>
      cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/users/${username}/sources/${source}/`,
          failOnStatusCode: false
        })
        .then(response => {
          if (response.status !== 200) {
            cy.request({
              method: "POST",
              headers: {
                Authorization: authToken
              },
              url: `${apiUrl}/users/${username}/sources/`,
              body: {
                id: source,
                custom_validation_schema: "OpenMRS",
                short_code: source,
                name: "Test Dictionary",
                description: "",
                public_access: public_access ? "View" : "None",
                source_type: "Dictionary"
              }
            });
          }
        })
    );

    return cy.wrap(source);
  }
);

Cypress.Commands.add(
  "deleteSource",
  (
    source: string,
    username: string = Cypress.env("USERNAME") || "admin",
    isCleanup: boolean = false
  ) => {
    getAuthToken().then(authToken =>
      cy.request({
        method: "DELETE",
        headers: {
          Authorization: authToken
        },
        url: `${apiUrl}/users/${username}/sources/${source}/`,
        failOnStatusCode: !!!isCleanup
      })
    );
  }
);

Cypress.Commands.add(
  "getSource",
  (source: string, username: string = Cypress.env("USERNAME") || "admin") => {
    getAuthToken().then(authToken => {
      return cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/users/${username}/sources/${source}/`
        })
        .its("body");
    });
  }
);
