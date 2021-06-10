import "@testing-library/cypress/add-commands";
import {
  LOGIN_ACTION,
  LOGOUT_ACTION
} from "../../src/apps/authentication/redux/actionTypes";
import { nanoid } from "nanoid";
import { getStore } from "../utils";

const apiUrl: string = Cypress.env("API_URL") || "http://localhost:8000";

Cypress.Commands.add(
  "login",
  (
    username = Cypress.env("USERNAME") || "admin",
    password = Cypress.env("PASSWORD") || "Admin123"
  ) => {
    const store = getStore();

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
        url: `${apiUrl}/users/login`,
        body: {
          username: username,
          password: password
        }
      }).then(response => {
        store.dispatch({
          type: LOGIN_ACTION,
          payload: { token: response.body["token"] }
        });
      });
    } else {
      store.dispatch({ type: LOGIN_ACTION, payload: { token: token } });
    }

    // delay until we've added the token to the store
    while (!store.getState().auth.isLoggedIn && !store.getState().auth.token);
  }
);

Cypress.Commands.add("logout", () => {
  const store = getStore();
  if (typeof store === "undefined") {
    return;
  }

  store.dispatch({ type: LOGOUT_ACTION });
  // delay until we're actually logged out
  while (store.getState().auth.isLoggedIn);
});

Cypress.Commands.add(
  "createDictionary",
  (
    username = Cypress.env("USERNAME") || "admin",
    dictionary = `TD-${nanoid()}`
  ) => {
    cy.request(`${apiUrl}/users/${username}/collections/${dictionary}`).then(
      response => {
        if (response.status !== 200) {
          cy.request({
            method: "POST",
            headers: {
              Authorization: `Token ${getStore().getState().auth.token}`
            },
            url: `${apiUrl}/users/${username}/collections/`,
            body: {
              short_code: `${dictionary}`,
              name: "Test Dictionary",
              public_access: "None"
            }
          });
        }
      }
    );

    return cy.wrap(dictionary);
  }
);

Cypress.Commands.add(
  "deleteDictionary",
  (dictionary, username = Cypress.env("USERNAME") || "admin") => {
    cy.request({
      method: "DELETE",
      headers: {
        Authorization: `Token ${getStore().getState().auth.token}`
      },
      url: `${apiUrl}/usrs/${username}/collections/${dictionary}`
    });
  }
);
