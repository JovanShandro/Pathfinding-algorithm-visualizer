describe("The Landing Page", () => {
    it("contains the right title", () => {
        cy.visit('/')
        cy.get('h1').contains("Pathfinding Algorithms Visualizer");
    })
})
