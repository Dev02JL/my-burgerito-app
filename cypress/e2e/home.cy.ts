describe("Page d'accueil", () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('body').should('be.visible');
  });

  it('devrait afficher le titre Burgerito', () => {
    cy.contains('BURGERITO', { matchCase: false }).should('be.visible');
  });

  it('devrait afficher des produits', () => {
    cy.get('[class*="card"]', { timeout: 15000 }).should('have.length.greaterThan', 0);
  });

  it('devrait avoir un lien vers le panier', () => {
    cy.get('a[href="/panier"]', { timeout: 5000 }).should('exist');
  });

  it('devrait avoir des liens de connexion et inscription', () => {
    cy.get('a[href="/connexion"]', { timeout: 5000 }).should('exist');
    cy.get('a[href="/inscription"]', { timeout: 5000 }).should('exist');
  });
});
