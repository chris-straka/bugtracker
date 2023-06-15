import { Router } from 'express'
import { adminProjectRouter, adminTicketRouter, adminUserRouter } from './admin'
import { projectCommentRouter, projectRouter, projectUserRouter } from './project'
import { ticketCommentRouter, ticketRouter, ticketUserRouter } from './ticket'
import authRouter from './auth'
import emailRouter from './email'
import meRouter from './me'
import passwordRouter from './password'
import userRouter from './user'

const router = Router()

// admin
router.use(adminProjectRouter)
router.use(adminTicketRouter)
router.use(adminUserRouter)

// auth
router.use(authRouter)

// project
router.use(projectCommentRouter)
router.use(projectRouter)
router.use(projectUserRouter)

// ticket
router.use(ticketCommentRouter)
router.use(ticketRouter)
router.use(ticketUserRouter)

// email
router.use(emailRouter)

// me
router.use(meRouter)

// password
router.use(passwordRouter)

// user 
router.use(userRouter)

export default router
