/// <reference types="cypress" />

export function login(username = "admin", password = "Admin123"): string {
  cy.visit("/login");

  cy.findByLabelText("Username").type(username);
  cy.findByLabelText("Password").type(password);
  cy.findByText("Log in").click();

  // wait till page is ready
  cy.findByPlaceholderText("Search Dictionaries");

  return username;
}

export function logout() {
  cy.findByTitle("Logout (admin)").click();
  cy.focused()
    .findByText("Logout")
    .click();
  cy.findByLabelText("Username").should("exist");
}
