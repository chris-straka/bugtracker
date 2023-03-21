import { Router } from "express";
import { getUser, deleteUser, createUser, updateUser } from "../controllers/UserController"
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router()

router.get('/users/:userId', isAuthenticated, getUser)
router.delete('/users/:userId', isAuthenticated, deleteUser)
router.post('/admin/users/:userId', isAuthenticated, createUser)
router.put('/admin/users/:userId', isAuthenticated, updateUser)
router.delete('/admin/users/:userId', isAuthenticated, deleteUser)

export default router
