import { AppError } from './index'

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists', 409)
  }
}

export class UserDoesNotExistError extends AppError {
  constructor() {
    super('User does not exist', 404)
  }
}

export class UserProvidedTheWrongPasswordError extends AppError {
  constructor() {
    super('Incorrect password provided', 401)
  }
}
