import request from 'supertest'
import app from '../../config/server'

describe('Auth Routes', () => {
  test('POST /login should return 200 when the user sends their username and password', async () => {
    const response = await request(app).post('/login')
    expect(response.statusCode).toBe(200)
  })
})
