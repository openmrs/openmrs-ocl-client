import uuid from 'uuid'

Cypress.Commands.add('runAndAwait', (callable, method='GET', addArtificialWait=false) => {
    const requestId = `apiRequest-${uuid()}`;

    cy.server();
    cy.route(method, '**').as(requestId);  // start recording requests
    callable();
    cy.wait(`@${requestId}`);
    cy.route(method, '**').as('untrackedRequest'); // stop recording requests

    if (addArtificialWait) cy.wait(8000);
  }
);

Cypress.Commands.add('selectByLabelText', (labelText, item) => {
    cy.findByLabelText(labelText).click();
    cy.get('ul[role="listbox"]').findByText(item).click();
});

Cypress.Commands.add('selectBySelector', (selector, item) => {
    cy.get(selector).click();
    cy.get('ul[role="listbox"]').findByText(item).click();
});
