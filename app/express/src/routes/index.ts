import { Router } from 'express'
import adminRouter from './admin'
import authRouter from './auth'
import projectRouter from './projects'
import ticketRouter from './tickets'
import meRouter from './me'

const router = Router()

router.use(adminRouter)
router.use(authRouter)
router.use(projectRouter)
router.use(ticketRouter)
router.use(meRouter)

export default router
