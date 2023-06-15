import { Router } from 'express'
import { body } from 'express-validator'
import { validateInput } from '../middleware'
import * as UserController from '../controllers/user'

const router = Router()

// create an account
router.post('/users', 
  [
    body('username', 'Username is required').notEmpty().isString(),
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password must be 5 to 90 chars').isLength({ min: 5, max: 90 }),
  ],
  validateInput,
  UserController.createUser
)

export default router