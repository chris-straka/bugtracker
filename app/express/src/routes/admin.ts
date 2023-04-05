import { Router } from 'express'
import { isAuthenticated, isAuthorized } from '../middleware'
import { deleteUser, createUser } from '../controllers/users'

const router = Router()

router.post('/admin/users/:userId', 
  isAuthenticated, 
  isAuthorized(['admin']), 
  createUser
)

router.put('/admin/users/:userId', 
  isAuthenticated, 
  isAuthorized(['admin']), 
  
)

router.delete('/admin/users/:userId', 
  isAuthenticated, 
  isAuthorized(['admin']), 
  deleteUser
)

export default router
