/// <reference types='cypress' />

describe("The Landing Page", () => {
  it("contains the right title", () => {
    cy.visit("/");
    cy.get("h1").contains("Pathfinding Algorithms Visualizer");
  });
  it("contains a total of 6 rules", () => {
    cy.visit("/");
    cy.get("[class^='rules-']").should("have.length", 6);
  });
  it("contains rule blocks each with a visible title", () => {
    cy.visit("/");
    cy.get("[class^='rules-']").each(($el) => {
      cy.wrap($el)
        .children("h3")
        .should("be.visible");
    });
  });
  it("contains rule blocks each with visible content", () => {
    cy.visit("/");
    cy.get("[class^='rules-']").each(($el) => {
      cy.wrap($el)
        .children("p")
        .should("be.visible");
    });
  });
  it("contains rule blocks each with a visible image", () => {
    cy.visit("/");
    cy.get("[class^='rules-']").each(($el) => {
      cy.wrap($el)
        .children("img")
        .should("be.visible");
    });
  });
  it("redirects user to /board page when the button is clicked", () => {
    cy.visit("/");
    cy.get("#boardlink").click();
    cy.url().should("include", "/board");
  });
});
