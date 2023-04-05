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

class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists', 409)
  }
}

class UserDoesNotExistError extends AppError {
  constructor() {
    super('User does not exist', 404)
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

export {
  UserAlreadyExistsError,
  UserDoesNotExistError,
  UserProvidedTheWrongPasswordError,
  UserDidNotProvideTheirPasswordError,
  UserIsNotAuthenticatedError,
  UserIsNotAllowedToChangeThisResourceError
}