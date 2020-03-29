export function login(username = 'admin', password = 'Admin123'): string {
  cy.visit('/login');

  cy.findByLabelText('Username').type(username);
  cy.findByLabelText('Password').type(password);
  cy.findByText('Log in').click();

  // wait till page is ready
  cy.findByText('Personal dictionaries');

  return username;
}
