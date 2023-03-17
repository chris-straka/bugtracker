import { Router } from "express";
import { getUser, deleteUser, createUser, updateUser } from "../../controllers/UserController"

const router = Router()

router.get('/users/:userId', getUser)
router.delete('/users/:userId', deleteUser)

// admin only 
router.post('/admin/users/:userId', createUser)
router.put('/admin/users/:userId', updateUser)
router.delete('/admin/users/:userId', deleteUser)

export default router 
