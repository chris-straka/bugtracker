class AppError extends Error {
  statusCode: number
  status: 'fail' | 'error'
  isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    if (process.env.NODE_ENV === 'development') Error.captureStackTrace(this, this.constructor)
  }
}

// USER ERRORS
class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists', 409)
  }
}

class UserNotFound extends AppError {
  constructor() {
    super('Authentication failed', 401)
  }
}

class UserProvidedTheWrongPasswordError extends AppError {
  constructor() {
    super('Incorrect password provided', 401)
  }
}

class UserDidNotProvideTheirPasswordError extends AppError {
  constructor() {
    super('No password provided', 400)
  }
}

class UserIsNotAuthenticatedError extends AppError {
  constructor() {
    super('User is not authenticated', 401) 
  }
}

class UserIsNotAllowedToChangeThisResourceError extends AppError {
  constructor() {
    super('User does not own the resource they intend to change', 401)
  }
}

class UserIsNotAuthorizedError extends AppError {
  constructor() {
    super('User is not authorized to access this resource', 403) 
  }
}

// PASSWORD
class InvalidOrMissingToken extends AppError {
  constructor() {
    super('The password reset token is invalid or missing', 400) 
  }
}

export {
  UserAlreadyExistsError,
  UserNotFound,
  UserProvidedTheWrongPasswordError,
  UserDidNotProvideTheirPasswordError,
  UserIsNotAuthenticatedError,
  UserIsNotAllowedToChangeThisResourceError,
  UserIsNotAuthorizedError,
  InvalidOrMissingToken
}