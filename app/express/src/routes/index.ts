import { Router } from 'express'
import passwordRouter from './passwords'
import projectCommentRouter from './projectComments'
import projectRouter from './projects'
import sessionRouter from './sessions'
import ticketCommentRouter from './ticketComments'
import ticketRouter from './tickets'
import userRouter from './users'

const router = Router()

router.use(passwordRouter)
router.use(sessionRouter)
router.use(projectCommentRouter)
router.use(projectRouter)
router.use(ticketCommentRouter)
router.use(ticketRouter)
router.use(userRouter)

export default router
