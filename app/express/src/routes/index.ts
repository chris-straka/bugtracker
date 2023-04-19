import { Router } from 'express'
import adminRouter from './admin'
import passwordRouter from './passwords'
import projectRouter from './projects'
import sessionRouter from './sessions'
import ticketRouter from './tickets'
import userRouter from './users'

const router = Router()

router.use(adminRouter)
router.use(passwordRouter)
router.use(sessionRouter)
router.use(projectRouter)
router.use(ticketRouter)
router.use(userRouter)

export default router
