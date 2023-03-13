import { Router } from "express"
import authRoutes from "./auth"
import userRoutes from "./user"
import projectRoutes from "./project"
import ticketRoutes from "./ticket"

const router = Router()

router.use(authRoutes)
router.use(userRoutes)
router.use(projectRoutes)
router.use(ticketRoutes)

export default router 