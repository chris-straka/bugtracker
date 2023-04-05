import { Router } from 'express'
import { forgetPassword, resetPassword } from '../controllers/passwords'

const router = Router()

router.post('/password', forgetPassword)
router.put('/password/:token', resetPassword)

export default router