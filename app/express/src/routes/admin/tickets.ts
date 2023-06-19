import { Router } from 'express'
import { isActive, isAuthenticated, isAuthorized, validateInput } from '../../middleware'
import { searchPaginationValidators } from '../../validators'
import * as AdminTicketController from '../../controllers/admin/ticket'

const router = Router()

router.get('/admin/tickets',
  isAuthenticated,
  isActive,
  isAuthorized(['admin', 'owner']),
  searchPaginationValidators,
  validateInput,
  AdminTicketController.searchAllTickets
)

export default router