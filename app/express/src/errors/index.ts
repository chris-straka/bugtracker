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

// USER ERRORS
export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists', 409)
  }
}

export class UserIsDisabledError extends AppError {
  constructor() {
    super('User is disabled', 403)
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super('User not found', 404)
  }
}

export class UserProvidedTheWrongPasswordError extends AppError {
  constructor() {
    super('Incorrect password provided', 401)
  }
}

export class UserIsNotAuthenticatedError extends AppError {
  constructor() {
    super('User is not authenticated', 401) 
  }
}

export class UserIsNotAuthorizedError extends AppError {
  constructor() {
    super('User is not authorized to access this resource', 403) 
  }
}

export class UserIsAlreadyAssignedToThisProjectError extends AppError {
  constructor() {
    super('User is already assigned to this project', 409) 
  }
}

export class UserIsNotAssignedToThisProjectError extends AppError {
  constructor() {
    super('User is not assigned to this project', 404) 
  }
}

export class InvalidOrMissingTokenError extends AppError {
  constructor() {
    super('The reset token is invalid or missing', 400) 
  }
}

// PROJECT
export class ProjectAlreadyExistsError extends AppError {
  constructor() {
    super('Project already exists', 409)
  }
}

export class ProjectNotFoundError extends AppError {
  constructor() {
    super('Project not found', 404)
  }
}

export class ProjectCommentNotFoundError extends AppError {
  constructor() {
    super('Project comment not found', 404) 
  }
}

// TICKET
export class TicketNotFoundError extends AppError {
  constructor() {
    super('Project comment not found', 404) 
  }
}

export class TicketCommentNotFoundError extends AppError {
  constructor() {
    super('Ticket comment not found', 404) 
  }
}

// URI