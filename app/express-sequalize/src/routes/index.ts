import { Router } from "express"
import sessionRoutes from "./session"
import jwtRoutes from './jwt'

const router = Router()

router.use('/session', sessionRoutes)
router.use('/jwt', jwtRoutes)

export default router
