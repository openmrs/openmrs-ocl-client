export function login() {
  cy.visit('/login');

  cy.findByLabelText('Username').type('admin');
  cy.findByLabelText('Password').type('Admin123');
  cy.findByText('Log in').click();

  // wait till page is ready
  cy.findByText('Personal dictionaries');
}

describe('Login', () => {
  it('Happy flow: Should allow user to login', () => {
    cy.visit('/user/collections/');
    // should have redirected us to login
    cy.queryByText('Log In to Open Concept Lab').should('exist');

    login();

    cy.visit('/user/collections/');
    // should not redirect us anywhere
    cy.findByText('Personal dictionaries').should('exist');
  })
})
