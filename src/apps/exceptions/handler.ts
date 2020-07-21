export function initiateExceptionsLogger() {
  Cypress.on('uncaught:exception', (err, runnable) => {
    console.log(err);
    return false;
  })
}