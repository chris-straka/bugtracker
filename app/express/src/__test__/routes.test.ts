import request from "supertest"
import app from "../config/server"

describe('Auth Routes', () => {
  test("POST /login should return 200", async () => {
    const response = await request(app).post('/login')
      .send({
        username: "username",
        password: "password"
      })
    expect(response.statusCode).toBe(200)
  })
})
