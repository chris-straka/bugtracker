import { createPmAndProject } from '../helper'

beforeAll(async () => {
  await createPmAndProject()
})

describe('User route for checking recent history and statistics', () => {
  describe('GET /users/me/activity', () => {
    it('should 200 and return tickets by priority')
    it('should 200 and return tickets by type')
    it('should 200 and return tickets by status')
    it('should 200 and return tickets by project')
  })
})