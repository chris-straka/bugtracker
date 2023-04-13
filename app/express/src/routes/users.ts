import { Router } from 'express'
import { body } from 'express-validator'
import { isAuthenticated, isTheOwner, validateInput } from '../middleware'
import { getUser, deleteUser, createUser, changeEmail, changeUsername } from '../controllers/users'

const router = Router()

router.post('/users', 
  [
    body('username', 'Username is required').notEmpty().isString(),
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password must be 5 to 90 chars').isLength({ min: 5, max: 90 }),
  ],
  validateInput,
  createUser
)

router.get('/users/:userId', 
  isAuthenticated, 
  getUser
)

router.put('/users/:userId/email', 
  isAuthenticated, 
  isTheOwner, 
  [body('email', 'Email is not valid').isEmail()],
  validateInput,
  changeEmail
)

router.put('/users/:userId/username', 
  isAuthenticated, 
  isTheOwner, 
  [body('username', 'Username is not valid').isString()],
  validateInput,
  changeUsername
)

router.delete('/users/:userId', 
  isAuthenticated, 
  isTheOwner,
  deleteUser
)

export default router
