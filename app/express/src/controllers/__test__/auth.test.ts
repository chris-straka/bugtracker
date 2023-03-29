import { loginUser } from '../auth'

describe('Auth controller', () => {
  describe('loginUser()', () => {
    test('Should 400 if the user fails to pass in their email or password', async () => {
      
    })

    test('Should 404 if the user does not exist', async () => {})
    test('Should 401 if the user inserts the wrong password', async () => {})
    test('Should 200 if the user can log in successfully', async () => {})
  })

  describe('logoutUser()', () => {
    test('Should 200 if the user\'s logout attempt was successful', async () => {})
    test('Should 401 if the user is not authenticated', async () => {})
  })

  describe('signupUser()', () => {
    test('Should 400 if any of the fields are missing', async () => {})
    test('Should 409 if the user with the same email already exists', async () => {})
    test('Should 201 and return the sesion on successful signup', async () => {})
  })
})