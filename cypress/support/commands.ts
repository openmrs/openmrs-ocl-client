/// <reference types="." />
import "@testing-library/cypress/add-commands";
import {
  LOGIN_ACTION,
  LOGOUT_ACTION
} from "../../src/apps/authentication/redux/actionTypes";
import { nanoid } from "nanoid";
import {
  getStore,
  getAuthToken,
  getUser,
  getPassword,
  getConceptId,
  getVersionId,
  getDictionaryId,
  getNewUser
} from "./utils";
import { ConceptName } from "../../src/apps/concepts";

const apiUrl: string = Cypress.env("API_URL") || "http://localhost:8000";

Cypress.Commands.add(
  "login",
  (username: string = getUser(), password: string = getPassword()) => {
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
    username: string = getUser(),
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
    username: string = getUser(),
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
  (dictionary: string, username: string = getUser()) => {
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
  "createVersion",
  (
    version: string = `Ver-${nanoid()}`,
    dictionary: string = getDictionaryId(),
    username: string = getUser()
  ) => {
    getAuthToken().then(authToken =>
      cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/users/${username}/collections/${dictionary}/versions/${version}`,
          failOnStatusCode: false
        })
        .then(response => {
          if (response.status !== 200) {
            cy.request({
              method: "POST",
              headers: {
                Authorization: authToken
              },
              url: `${apiUrl}/users/${username}/collections/${dictionary}/versions/`,
              body: {
                id: version,
                released: false,
                description: ""
              }
            });
          }
        })
    );
    return cy.wrap(version);
  }
);

Cypress.Commands.add(
  "getVersion",
  (
    version: string,
    dictionary: string = getDictionaryId(),
    username: string = getUser(),
    shouldFail: boolean = true
  ) => {
    return getAuthToken().then(authToken => {
      return cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/users/${username}/collections/${dictionary}/versions/${version}`,
          failOnStatusCode: shouldFail
        })
        .its("body");
    });
  }
);

Cypress.Commands.add(
  "updateVersion",
  (
    version: string = getVersionId(),
    dictionary: string = getDictionaryId(),
    username: string = getUser()
  ) => {
    getAuthToken().then(authToken =>
      cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/users/${username}/collections/${dictionary}/versions/${version}`,
          failOnStatusCode: false
        })
        .then(response => {
          if (response.status !== 200) {
            cy.request({
              method: "PUT",
              headers: {
                Authorization: authToken
              },
              url: `${apiUrl}/users/${username}/collections/${dictionary}/${version}/`,
              body: {
                id: version,
                released: true,
                description: ""
              }
            });
          }
        })
    );
    return cy.wrap(version);
  }
);

Cypress.Commands.add(
  "createSource",
  (
    source: string = `TS-${nanoid()}`,
    username: string = getUser(),
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
                name: "Test Source",
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
  "createOrgSource",
  (
    source: string = `TOS-${nanoid()}`,
    organisation: string = "CIEL",
    public_access: boolean = false
  ) => {
    getAuthToken().then(authToken =>
      cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/orgs/${organisation}/sources/${source}/`,
          failOnStatusCode: false
        })
        .then(response => {
          if (response.status !== 200) {
            cy.request({
              method: "POST",
              headers: {
                Authorization: authToken
              },
              url: `${apiUrl}/orgs/${organisation}/sources/`,
              body: {
                id: source,
                custom_validation_schema: "OpenMRS",
                short_code: source,
                name: "Test Org Source",
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
  "createOrgDictionary",
  (
  dictionary: string = `TOC-${nanoid()}`,
  organisation: string = "CIEL",
  public_access: boolean = false
  ) => {
      getAuthToken().then(authToken =>
        cy
        .request({
            method: "GET",
            headers: {
                Authorization: authToken
            },
            url: `${apiUrl}/orgs/${organisation}/collections/${dictionary}/`,
            failOnStatusCode: false
        })
        .then(response => {
            if (response.status !== 200) {
                cy.request({
                    method: "POST",
                    headers: {
                        Authorization: authToken
                    },
                    url: `${apiUrl}/orgs/${organisation}/collections/`,
                    body: {
                        id: dictionary,
                        custom_validation_schema: "OpenMRS",
                        short_code: dictionary,
                        name: "Test Org Dictionary",
                        description: "",
                        public_access: public_access ? "View" : "None",
                        source_type: "Dictionary"
                    }
                });
            }
        })
      );
      return cy.wrap(dictionary);
  }
);

Cypress.Commands.add(
  "deleteSource",
  (
    source: string,
    username: string = getUser(),
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
  "deleteOrgSource",
  (
    source: string,
    organisation: string = "CIEL",
    isCleanup: boolean = false
  ) => {
    getAuthToken().then(authToken => {
      cy.request({
        method: "GET",
        headers: {
          Authorization: authToken
        },
        url: `${apiUrl}/orgs/${organisation}/sources/${source}/`,
        failOnStatusCode: !isCleanup
      }).then(response => {
        if (
          response.status >= 200 &&
          response.status < 400 &&
          getUser() === response.body.created_by
        ) {
          cy.request({
            method: "DELETE",
            headers: {
              Authorization: authToken
            },
            url: `${apiUrl}/orgs/${organisation}/sources/${source}/`,
            failOnStatusCode: !isCleanup
          });
        }
      });
    });
  }
);

Cypress.Commands.add(
  "getSource",
  (source: string, username: string = getUser()) => {
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

Cypress.Commands.add(
  "createOrganisation",
  (
    organisation: string = `ORG-${nanoid()}`,
    public_access: boolean = false
  ) => {
    getAuthToken().then(authToken =>
      cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/orgs/${organisation}/`,
          failOnStatusCode: false
        })
        .then(response => {
          if (response.status !== 200) {
            cy.request({
              method: "POST",
              headers: {
                Authorization: authToken
              },
              url: `${apiUrl}/orgs/`,
              body: {
                id: organisation,
                custom_validation_schema: "OpenMRS",
                name: "Test Organisation",
                company: "",
                website: "",
                location: "",
                public_access: public_access ? "View" : "None",
                orgs_type: "organisation"
              }
            });
          }
        })
    );

    return cy.wrap(organisation);
  }
);

Cypress.Commands.add(
  "deleteOrganisation",
  (organisation: string, isCleanup: boolean = false) => {
    getAuthToken().then(authToken => {
      cy.request({
        method: "GET",
        headers: {
          Authorization: authToken
        },
        url: `${apiUrl}/orgs/${organisation}/`,
        failOnStatusCode: !isCleanup
      }).then(response => {
        if (
          response.status >= 200 &&
          response.status < 400 &&
          getUser() === response.body.created_by
        ) {
          cy.request({
            method: "DELETE",
            headers: {
              Authorization: authToken
            },
            url: `${apiUrl}/orgs/${organisation}/`,
            failOnStatusCode: !isCleanup
          });
        }
      });
    });
  }
);

Cypress.Commands.add("getOrganisation", (organisation: string) => {
  return getAuthToken().then(authToken => {
    return cy
      .request({
        method: "GET",
        headers: {
          Authorization: authToken
        },
        url: `${apiUrl}/orgs/${organisation}/`
      })
      .its("body");
  });
});

Cypress.Commands.add(
  "getConcept",
  (
    source_url: string,
    id: string = getConceptId(),
    shouldFail: boolean = true
  ) => {
    return getAuthToken().then(authToken => {
      cy.request({
        method: "GET",
        headers: {
          Authorization: authToken
        },
        url: `${apiUrl}${source_url}concepts/${id}/`,
        failOnStatusCode: shouldFail
      }).its("body");
    });
  }
);

Cypress.Commands.add(
  "createConcept",
  (
    names: ConceptName[],
    source_url: string,
    id: string = getConceptId(),
    concept_class: string = "Diagnosis"
  ) => {
    getAuthToken().then(authToken => {
      cy.request({
        method: "GET",
        headers: {
          Authorization: authToken
        },
        url: `${apiUrl}${source_url}concepts/${id}/`,
        failOnStatusCode: false
      }).then(response => {
        if (response.status !== 200) {
          cy.request({
            method: "POST",
            headers: {
              Authorization: authToken
            },
            url: `${apiUrl}${source_url}concepts/`,
            body: {
              id: id,
              concept_class: concept_class,
              names: names,
              datatype: "N/A"
            }
          });
        }
      });
    });

    return cy.wrap(id);
  }
);
Cypress.Commands.add(
  "createUser",
  (username: string = getNewUser(), password: string = nanoid()) => {
    getAuthToken().then(authToken =>
      cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/users/${username}`,
          failOnStatusCode: false
        })
        .then(response => {
          if (response.status !== 200) {
            cy.request({
              method: "POST",
              headers: {
                Authorization: authToken
              },
              url: `${apiUrl}/users/`,
              body: {
                username: username,
                password: password,
                email: `${username}@example.com`,
                first_name: "Test",
                last_name: "User"
              }
            });
          }
        })
    );

    return cy.wrap(username);
  }
);

Cypress.Commands.add(
  "addMember",
  (organisation: string = `ORG-${nanoid()}`, member: string = getNewUser()) => {
    getAuthToken().then(authToken =>
      cy
        .request({
          method: "GET",
          headers: {
            Authorization: authToken
          },
          url: `${apiUrl}/orgs/${organisation}/members/${member}`,
          failOnStatusCode: false
        })
        .then(response => {
          if (response.status !== 200) {
            cy.request({
              method: "PUT",
              headers: {
                Authorization: authToken
              },
              url: `${apiUrl}/orgs/${organisation}/members/${member}/`,
              body: {
                username: member
              }
            });
          }
        })
    );

    return cy.wrap(member);
  }
);
