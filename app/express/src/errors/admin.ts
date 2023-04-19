import { AppError } from '.'

export class NothingToChangeError extends AppError {
  constructor() {
    super('The user did not specify any fields that they wanted to change', 400)
  }
}