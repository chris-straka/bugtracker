import { Router } from 'express'
import { body } from 'express-validator'
import { isAuthenticated, isAllowed, validateInput } from '../middleware'
import { getUser, deleteUser, createUser, changeUserEmail, changeUsername } from '../controllers/users'

const router = Router()

router.post('/users', 
  [],
  validateInput,
  createUser
)

router.get('/users/:userId', 
  isAuthenticated, 
  getUser
)

router.put('/users/:userId/email', 
  isAuthenticated, 
  isAllowed, 
  [body('email', 'Email is not valid').isEmail()],
  validateInput,
  changeUserEmail
)

router.put('/users/:userId/username', 
  isAuthenticated, 
  isAllowed, 
  [body('username', 'Username is not valid').isString()],
  validateInput,
  changeUsername
)

router.delete('/users', 
  isAuthenticated, 
  isAllowed,
  deleteUser
)

export default router
