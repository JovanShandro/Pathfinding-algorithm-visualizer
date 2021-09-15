/// <reference types='cypress' />

describe("The Board page", () => {
  it("has a visible navbar", () => {
    cy.visit("/board");
    cy.get("nav").should("be.visible");
  });
  it("has a start and a target square", () => {
    cy.visit("/board");
    cy.get(".start").should("be.visible");
    cy.get(".target").should("be.visible");
  });
  it("allows you to move the start square", () => {
    cy.visit("/board");
    cy.get("#square-13-13.start").should("be.visible");
    cy.get("#square-13-13").trigger("mousedown");
    cy.get("#square-13-13").trigger("mouseout");
    cy.get("#square-14-13").trigger("mouseenter");
    cy.get("#square-14-13").trigger("mouseup");
    cy.get("#square-14-13.start").should("be.visible");
    cy.get(".start").should("have.length", 1);
  });
  it("allows you to move the target square", () => {
    cy.visit("/board");
    cy.get("#square-13-23.target").should("be.visible");
    cy.get("#square-13-23").trigger("mousedown");
    cy.get("#square-13-23").trigger("mouseout");
    cy.get("#square-14-23").trigger("mouseenter");
    cy.get("#square-14-23").trigger("mouseup");
    cy.get("#square-14-23.target").should("be.visible");
    cy.get(".target").should("have.length", 1);
  });
  it("allows you to create walls", () => {
    cy.visit("/board");
    cy.get("#square-13-14").trigger("mousedown");
    cy.get("#square-13-14").trigger("mouseout");
    cy.get("#square-13-15").trigger("mouseenter");
    cy.get("#square-13-15").trigger("mouseout");
    cy.get("#square-13-16").trigger("mouseenter");
    cy.get("#square-13-16").trigger("mouseup");
    cy.get(".wall").should("have.length", 3);
    cy.get("#square-13-14.wall").should("be.visible");
    cy.get("#square-13-15.wall").should("be.visible");
    cy.get("#square-13-16.wall").should("be.visible");
  });
  it("allows you to clear walls by reseting board", () => {
    cy.visit("/board");
    // Create 2 walls
    cy.get("#square-13-14").trigger("mousedown");
    cy.get("#square-13-14").trigger("mouseup");
    cy.get("#square-13-15").trigger("mousedown");
    cy.get("#square-13-15").trigger("mouseup");
    cy.get(".wall").should("have.length", 2);
    // Reset board
    cy.get("[data-testid=reset]").click();
    cy.get(".wall").should("have.length", 0);
  });
  it("shows weights when a weighted algorithm is chosen", () => {
    cy.visit("/board");
    // Make sure all weights are transparent
    cy.get(".square")
      .should("have.css", "color")
      .and("match", /rgba\(0, 0, 0, 0\)/);
    // Select dijkstra
    cy.get("select").select("dijkstra");
    cy.get(".square")
      .should("have.css", "color")
      .and("match", /rgb\(0, 0, 0\)/);
  });
  it("allows user to change weights", () => {
    cy.visit("/board");
    // Select dijkstra
    cy.get("select").select("dijkstra");
    // Test if weight can be increased
    cy.get("[data-testid=weight]").click();
    cy.get("[data-testid=weight]").should("have.class", "add");
    cy.get("#square-13-14").trigger("click");
    cy.get("#square-13-14").trigger("click");
    cy.get("#square-13-14").trigger("click");
    cy.get("#square-13-14").contains("4");
    // Test if weight can be decreased
    cy.get("[data-testid=weight]").click();
    cy.get("[data-testid=weight]").should("have.class", "sub");
    cy.get("#square-13-14").trigger("click");
    cy.get("#square-13-14").trigger("click");
    cy.get("#square-13-14").contains("2");
    // Test if walls can be added after weight button is disabled
    cy.get("[data-testid=weight]").click();
    cy.get("#square-13-14").trigger("mousedown");
    cy.get("#square-13-14").trigger("mouseup");
    cy.get("#square-13-14").should("have.class", "wall");
  });
  it("properly animates A*", () => {
    cy.visit("/board");
    cy.get("select").select("A*");
    cy.get("#square-13-14").trigger("mousedown");
    cy.get("#square-13-14").trigger("mouseup");
    cy.get("[data-testid=visualize]").click();

    // Test squares that should be in the final path
    for (let i = 13; i < 24; i++) {
      if (i > 15) {
        cy.get(`#square-13-${i}`).should("have.class", "path");
      }
      if (i < 16) {
        cy.get(`#square-12-${i}`).should("have.class", "path");
      }
    }
    // Test squares that should be visited
    for (let i = 13; i < 24; i++) {
      if (i > 15) {
        cy.get(`#square-12-${i}`).should("have.class", "visited");
      }
      cy.get(`#square-14-${i}`).should("have.class", "visited");
    }
    cy.get(`#square-13-12`).should("have.class", "visited");
  });
  // TODO add tests like the one above for each other algorithm
});
