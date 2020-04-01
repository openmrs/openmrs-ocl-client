import { login } from './testUtils'

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
if (require.main === module) {
  // do something
  // or nothing
}
