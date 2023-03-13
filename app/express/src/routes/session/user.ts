import { Router } from "express";
import { getUser, deleteUser } from "../../controllers/Session/User"

const router = Router()

router.get('/user', getUser)
router.delete('/user', deleteUser)

export default router 