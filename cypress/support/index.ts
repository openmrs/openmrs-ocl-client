// ***********************************************************
// This example support/index.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import "cypress-wait-until";
import "./commands";

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err) {
      // tslint:disable: no-console
      console.log('error', err)
      console.log('runnable', runnable)
  }
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
