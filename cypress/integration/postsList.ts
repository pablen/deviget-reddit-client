describe('A post', () => {
  it('displays its metadata', () => {
    cy.visit('/')
    cy.get('[data-testid^=post-]')
      .first()
      .contains(/Created(.+)ago/)
    cy.get('[data-testid^=post-]')
      .first()
      .contains(/\d+\scomments?/)
    cy.get('[data-testid^=post-]')
      .first()
      .get('[data-testid^=post-]')
      .first()
      .contains('Dismiss')
    cy.get('[data-testid^=post-]')
      .first()
      .get('[data-testid=title]')
      .should('not.be.empty')
    cy.get('[data-testid^=post-]')
      .first()
      .get('[data-testid=author]')
      .should('not.be.empty')
    cy.get('[data-testid^=post-]')
      .first()
      .get('[aria-label=Unread]')
      .should('exist')
  })

  it('is selected when clicked', () => {
    cy.visit('/')
    cy.get('[data-testid^=post-]')
      .first()
      .then(($el) => {
        const title = $el.find('[data-testid=title]').text()
        cy.wrap(title).should('not.be.empty')
        cy.get('main').should('not.have.text', title)

        const author = $el.find('[data-testid=author]').text()
        cy.wrap(author).should('not.be.empty')
        cy.get('main').should('not.have.text', author)

        const createdAt = $el.find('[data-testid=createdAt]').text()
        cy.wrap(createdAt).should('not.be.empty')
        cy.get('main').should('not.have.text', createdAt)

        const numComments = $el.find('[data-testid=numComments]').text()
        cy.wrap(numComments).should('not.be.empty')
        cy.get('main').should('not.have.text', numComments)

        cy.get('[data-testid^=post-]').first().click()

        cy.get('main').contains(title)
        cy.get('main').contains(author)
        cy.get('main').contains(createdAt)
        cy.get('main').contains(numComments)
      })
  })

  it('is marked as read when selected', () => {
    cy.visit('/')
    cy.get('[data-testid^=post-]')
      .first()
      .then(($el) => {
        cy.wrap($el.find('[aria-label=Unread]')).should('exist')
        cy.wrap($el.find('[aria-label=Read]')).should('not.exist')
      })
    cy.get('[data-testid^=post-]').first().click()
    cy.get('[data-testid^=post-]')
      .first()
      .then(($el) => {
        cy.wrap($el.find('[aria-label=Unread]')).should('not.exist')
        cy.wrap($el.find('[aria-label=Read]')).should('exist')
      })
  })

  it('has its read state persisted between page reloads', () => {
    cy.visit('/')
    cy.get('[data-testid^=post-]')
      .first()
      .then(($el) => {
        cy.wrap($el.find('[aria-label=Unread]')).should('exist')
        cy.wrap($el.find('[aria-label=Read]')).should('not.exist')
      })
    cy.get('[data-testid^=post-]').first().click()
    cy.get('[data-testid^=post-]')
      .first()
      .then(($el) => {
        cy.wrap($el.find('[aria-label=Unread]')).should('not.exist')
        cy.wrap($el.find('[aria-label=Read]')).should('exist')
      })
    cy.reload()
    cy.get('[data-testid^=post-]')
      .first()
      .then(($el) => {
        cy.wrap($el.find('[aria-label=Unread]')).should('not.exist')
        cy.wrap($el.find('[aria-label=Read]')).should('exist')
      })
  })

  it('can be dismissed', () => {
    cy.visit('/')
    cy.get('[data-testid^=post-]')
      .first()
      .then(($el) => {
        const testid = $el.get()[0].getAttribute('data-testid')
        cy.wrap(testid).should('not.be.empty')
        cy.get('[data-testid^=post-]').first().contains('Dismiss').click()
        cy.wait(1000) // wait for exit animation to stabilize
        cy.get(`[data-testid=${testid}]`).should('not.exist')
      })
  })
})

describe('The posts list', () => {
  it('can request a new page of posts', () => {
    cy.visit('/')
    cy.get('[data-testid^=post-]').then(($el) => {
      cy.get('[data-testid^=post-]').should('have.length.greaterThan', 0)
      const initialPostsAmount = $el.get().length
      cy.contains('Load More').click()
      cy.get('[data-testid^=post-]').should(
        'have.length.greaterThan',
        initialPostsAmount
      )
    })
  })

  it('can be completely cleared', () => {
    cy.visit('/')
    cy.get('[data-testid^=post-]').should('have.length.greaterThan', 0)
    cy.contains('Dismiss All').click()
    cy.get('[data-testid^=post-]').should('have.lengthOf', 0)
  })
})
