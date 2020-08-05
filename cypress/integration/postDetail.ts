describe('The post detail', () => {
  it('displays the post metadata', () => {
    cy.visit('/')
    cy.get('[data-testid^=post-] img')
      .first()
      .then(($el) => {
        const thumbnailSrc = $el.get()[0].getAttribute('src')
        cy.wrap(thumbnailSrc).should('not.be.empty')

        const item = $el.closest('button')
        const title = item.find('[data-testid=title]').text()
        cy.wrap(title).should('not.be.empty')
        cy.get('main').should('not.have.text', title)

        const author = item.find('[data-testid=author]').text()
        cy.wrap(author).should('not.be.empty')
        cy.get('main').should('not.have.text', author)

        const createdAt = item.find('[data-testid=createdAt]').text()
        cy.wrap(createdAt).should('not.be.empty')
        cy.get('main').should('not.have.text', createdAt)

        const numComments = item.find('[data-testid=numComments]').text()
        cy.wrap(numComments).should('not.be.empty')
        cy.get('main').should('not.have.text', numComments)

        cy.get('[data-testid^=post-]').first().click()

        cy.get('main').contains(title)
        cy.get('main').contains(author)
        cy.get('main').contains(createdAt)
        cy.get('main').contains(numComments)
        cy.get(`main img[src="${thumbnailSrc}"]`).should('exist')
      })
  })

  it('links to full size image when clicking a thumbnail', () => {
    cy.visit('/')
    cy.get('[data-testid^=post-] img')
      .first()
      .then(($listThumb) => {
        const thumbnailSrc = $listThumb.get()[0].getAttribute('src')
        cy.wrap(thumbnailSrc).should('not.be.empty')
        cy.get('[data-testid^=post-]').first().click()

        cy.get(`main img[src="${thumbnailSrc}"]`).then(($detailThumb) => {
          cy.wrap($detailThumb.closest('a')).should(
            'have.attr',
            'target',
            '_blank'
          )
        })
      })
  })
})
