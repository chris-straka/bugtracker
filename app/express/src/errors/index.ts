import {
  UserAlreadyExistsError,
  UserDoesNotExistError,
  UserProvidedTheWrongPasswordError,
} from './auth'

export class AppError extends Error {
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

export {
  UserAlreadyExistsError,
  UserDoesNotExistError,
  UserProvidedTheWrongPasswordError
}