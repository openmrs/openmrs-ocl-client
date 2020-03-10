describe('Login Page', () => {
  it('Happy flow: Should allow user to login', () => {
    cy.visit('/login');

    cy.findByLabelText('Username').type('admin');
    cy.findByLabelText('Password').type('Admin123');
    cy.findByText('Log in').click();

    // Goes to home page
    assert.exists(cy.findByText('Personal dictionaries'));
  })
})

export {};
