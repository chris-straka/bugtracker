import { Router } from "express";
import { loginUser, logoutUser, signupUser, forgetPassword, resetPassword } from "../controllers/AuthController"
import { isAuthenticated } from "../middleware/isAuthenticated";

const router = Router()

router.post('/login', loginUser)
router.post('/logout', isAuthenticated, logoutUser)
router.post('/signup', signupUser)
router.post('/forget-password', forgetPassword)
router.post('/reset-password', resetPassword)

export default router