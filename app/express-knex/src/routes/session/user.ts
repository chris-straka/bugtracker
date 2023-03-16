import { Router } from "express";
import { getUser, deleteUser } from "../../controllers/session/User"

const router = Router()

router.get('/user', getUser)
router.delete('/user', deleteUser)

export default router 