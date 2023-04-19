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

import { 
  UserAlreadyExistsError, UserDidNotProvideTheirPasswordError, 
  UserNotFound, UserIsNotAllowedToChangeThisResourceError,
  UserIsNotAuthenticatedError, UserProvidedTheWrongPasswordError,
  UserIsNotAuthorizedError
} from './user'

import { 
  RoleDoesNotExistError
} from './server'

import { 
  NothingToChangeError
} from './admin'

export {
  UserAlreadyExistsError,
  UserNotFound,
  UserProvidedTheWrongPasswordError,
  UserDidNotProvideTheirPasswordError,
  UserIsNotAuthenticatedError,
  UserIsNotAllowedToChangeThisResourceError,
  UserIsNotAuthorizedError,
  RoleDoesNotExistError,
  NothingToChangeError
}