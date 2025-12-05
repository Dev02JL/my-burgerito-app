/// <reference types="cypress" />

// Extension des types Cypress pour les commandes personnalisées
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // Ajoutez vos commandes personnalisées ici si nécessaire
      // Exemple: customCommand(): Chainable<Element>
    }
  }
}

export {}

