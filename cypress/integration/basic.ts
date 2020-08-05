describe('After startup', () => {
  it('displays a loading message while fetching posts', () => {
    cy.visit('/')
    cy.contains('Loading posts')
  })

  it('renders posts', () => {
    cy.visit('/')
    cy.get('[data-testid^=post-]').should('have.length.greaterThan', 0)
  })
})
