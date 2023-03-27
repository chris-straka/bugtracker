describe('Auth controller', () => {
  describe('loginUser()', () => {
    test('Should 400 if the user fails to pass in their email or password', async () => {})
    test('Should 401 if the authentication service rejects the login attempt', async () => {})
    test('Should 401 if the authentication service rejects the login attempt', async () => {})
  })

  describe('logoutUser()', () => {
    test('Should 200 if the user\'s logout attempt was successful', async () => {})
    test('Should 401 if the authentication service rejects the login attempt', async () => {})
  })

  describe('signupUser()', () => {
    test('Should 400 if any of the fields are missing', async () => {})
    test('Should 201 and return the sesion on successful signup', async () => {})
  })

  describe('forgetPassword()', () => {
    test('Should 400 if the user does not provide the email associated with their password', async () => {})
    test('Should 200 even if the email is not found to prevent information leakage', async () => {})
    test('Should 200 and trigger an email if the email is found', async () => {})
    test('Should store a password reset token', async () => {})
  })

  describe('resetPassword()', () => {
    test('Should 400 if any of the fields are missing', async () => {})
    test('Should return the created user and sesion on successful signup', async () => {})
  })
})
