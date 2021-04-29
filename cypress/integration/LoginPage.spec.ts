/// <reference types="cypress" />
/// <reference types="../support" />

describe("Login", () => {
  const username = Cypress.env('USERNAME') || 'admin';
  const password = Cypress.env('PASSWORD') || 'Admin123';

  const submitForm = () => cy.get('#login-form form').submit();

  beforeEach(() => {
    cy.logout();
    cy.visit('/login');
  });

  it("should allow user to login", () => {
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('not.contain', '/login');
  });

  it("should allow user to login by pressing enter", () => {
    cy.get('#username').type(username);
    cy.get('#password').type(password).type('{enter}');

    cy.url().should('not.contain', '/login');
  });

  it("should require a user name to login", () => {
    cy.get('#password').type(password);
    submitForm();

    cy.get('#username').should('have.attr', 'aria-invalid');
  });

  it("should require a password to login", () => {
    cy.get('#username').type(username);
    submitForm();

    cy.get('#password').should('have.attr', 'aria-invalid');
  });

  it("should display an error with invalid credentials", () => {
    cy.get('#username').type('badusername');
    cy.get('#password').type('badpassword');
    submitForm();

    cy.url().should('contain', '/login');

    cy.get('[data-testid="login-status-message"]').should("be.visible")
  });
});
