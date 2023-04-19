import { AppError } from '.'

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists', 409)
  }
}

export class UserNotFound extends AppError {
  constructor() {
    super('Authentication failed', 401)
  }
}

export class UserProvidedTheWrongPasswordError extends AppError {
  constructor() {
    super('Incorrect password provided', 401)
  }
}

export class UserDidNotProvideTheirPasswordError extends AppError {
  constructor() {
    super('No password provided', 400)
  }
}

export class UserIsNotAuthenticatedError extends AppError {
  constructor() {
    super('User is not authenticated', 401) 
  }
}

export class UserIsNotAllowedToChangeThisResourceError extends AppError {
  constructor() {
    super('User does not own the resource they intend to change', 401)
  }
}

export class UserIsNotAuthorizedError extends AppError {
  constructor() {
    super('User is not authorized to access this resource', 403) 
  }
}