import { SuperAgentTest } from 'supertest'
import { createPmAndProject } from '../../helper'

let pm: SuperAgentTest
let projectId: string

beforeAll(async () => {
  ({ pm, projectId } = await createPmAndProject())
})

describe('GET /tickets/search?term=:term', () => {
  console.log(pm)
  console.log(projectId)
  it('should 200 and return the correct ticket by name')
  it('should 200 and return the correct project when searching by description')
})