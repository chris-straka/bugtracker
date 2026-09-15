import { Router } from 'express'
import { body } from 'express-validator'
import { validateInput } from '../../middleware'
import * as TokenController from '../../controllers/auth/token'

const router = Router()

// API/mobile login — issues a JWT access + rotating refresh pair.
router.post(
  '/tokens',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 5, max: 90 })
      .withMessage('Password must be between 5 and 90 characters'),
  ],
  validateInput,
  TokenController.createTokens,
)

// Single-use refresh rotation — returns a fresh pair.
router.post(
  '/tokens/refresh',
  [body('refreshToken').isString().notEmpty().withMessage('Refresh token is required')],
  validateInput,
  TokenController.refreshTokens,
)

// Revoke a refresh token (`{ refreshToken }`), or all of them (`{ all: true }` + Bearer).
router.delete('/tokens', TokenController.deleteTokens)

export default router
