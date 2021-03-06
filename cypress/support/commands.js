// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })


Cypress.Commands.add('spAuth', function () {
  const options = {
    username: Cypress.env('username'),
    password: Cypress.env('password'),
    pageUrl: Cypress.env('appUrl')
  };
  
  cy.task('SharePointLogin', options).then(result => {
    cy.clearCookies();
    
    result.cookies.forEach(cookie => {
      cy.setCookie(cookie.name, cookie.value, {
        domain: cookie.domain,
        expiry: cookie.expires,
        httpOnly: cookie.httpOnly,
        path: cookie.path,
        secure: cookie.secure
      });
      Cypress.Cookies.preserveOnce(cookie.name);
    });
  });
});

/**
 * Overwriting the original visit Cypress function to add authentication
 */
Cypress.Commands.overwrite("visit", (originalFn, pageUrl, options) => { 
  const config = {
    username: process.env.CI ? Cypress.env('USERNAME') : Cypress.env('username'),
    password: process.env.CI ? Cypress.env('PASSWORD') : Cypress.env('password'),
    pageUrl
  };
  
  cy.task('NodeAuth', config).then((data) => {
    originalFn({
      method: "GET",
      url: pageUrl,
      headers: data.headers
    });
  });
});