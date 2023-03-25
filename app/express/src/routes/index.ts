import { Router } from 'express'
import authRouter from './auth'
import projectRouter from './project'
import ticketRouter from './ticket'
import userRouter from './user'

const router = Router()
router.use(authRouter)
router.use(projectRouter)
router.use(ticketRouter)
router.use(userRouter)

export default router
