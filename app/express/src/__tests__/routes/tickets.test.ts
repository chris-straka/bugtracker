describe('Ticket Routes', () => {
  describe('GET /tickets', () => {
    it('should 200 and give all the tickets with the correct pagination')
  })
  describe('GET /tickets/:ticketId', () => {
    it('should 200 and return ticket details')
    it('should 404 if the ticket is not found')
  })
  describe('POST /tickets', () => {
    it('should 201 and create a new ticket when authorized')
    it('should 401 when unauthorized users try to create a ticket')
  })

  describe('PUT /tickets/:ticketId/users/:userId', () => {
    it('should 200 when a pm assigns a dev to a ticket on their project')
    it('should 401 when unauthorized users try to assign a dev to a ticket')
  })

  describe('DELETE /tickets/:ticketId/users/:userId', () => {
    it('should 200 when removing a dev from a ticket')
  })
})