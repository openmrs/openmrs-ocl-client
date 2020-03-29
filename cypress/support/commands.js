import uuid from 'uuid'

Cypress.Commands.add('runAndAwait', callable => {
    const requestId = `apiRequest-${uuid()}`;

    cy.server();
    cy.route('**').as(requestId);  // start recording requests
    callable();
    cy.wait(`@${requestId}`);
    cy.route('**').as('untrackedRequest'); // stop recording requests
  }
)
