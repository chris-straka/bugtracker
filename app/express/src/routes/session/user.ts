import { Router } from "express";
import { getUser, deleteUser } from "../../controllers/UserController"

const router = Router()

router.get('/users/:userId', getUser)
router.delete('/users/:userId', deleteUser)

export default router 
