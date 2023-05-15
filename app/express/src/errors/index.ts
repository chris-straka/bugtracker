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

class UserNotFoundError extends AppError {
  constructor() {
    super('User not found', 404)
  }
}

class UserProvidedTheWrongPasswordError extends AppError {
  constructor() {
    super('Incorrect password provided', 401)
  }
}

class UserIsNotAuthenticatedError extends AppError {
  constructor() {
    super('User is not authenticated', 401) 
  }
}

class UserIsNotAuthorizedError extends AppError {
  constructor() {
    super('User is not authorized to access this resource', 403) 
  }
}

class UserIsAlreadyAssignedToThisProjectError extends AppError {
  constructor() {
    super('User is already assigned to this project', 409) 
  }
}

class UserIsNotAssignedToThisProjectError extends AppError {
  constructor() {
    super('User is not assigned to this project', 404) 
  }
}

class InvalidOrMissingTokenError extends AppError {
  constructor() {
    super('The password reset token is invalid or missing', 400) 
  }
}

// PROJECT
class ProjectAlreadyExistsError extends AppError {
  constructor() {
    super('Project already exists', 409)
  }
}


class ProjectNotFoundError extends AppError {
  constructor() {
    super('Project not found', 404)
  }
}

class ProjectCommentNotFoundError extends AppError {
  constructor() {
    super('Project comment not found', 404) 
  }
}

// TICKET
class TicketNotFoundError extends AppError {
  constructor() {
    super('Project comment not found', 404) 
  }
}

class TicketCommentNotFoundError extends AppError {
  constructor() {
    super('Ticket comment not found', 404) 
  }
}

export {
  UserAlreadyExistsError,
  UserNotFoundError,
  UserProvidedTheWrongPasswordError,
  UserIsNotAuthenticatedError,
  UserIsNotAuthorizedError,
  UserIsAlreadyAssignedToThisProjectError,
  UserIsNotAssignedToThisProjectError,
  InvalidOrMissingTokenError,

  ProjectAlreadyExistsError,
  ProjectNotFoundError,
  ProjectCommentNotFoundError,

  TicketNotFoundError,
  TicketCommentNotFoundError
}