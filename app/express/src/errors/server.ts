import { AppError } from '.'

export class RoleDoesNotExistError extends AppError {
  constructor() {
    super('Role does not exist on the session object', 500)
  }
}