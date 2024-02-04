import { Router } from 'express'
import { body, param } from 'express-validator'
import { isActive, isAuthenticated, isAuthorized, isProjectMemberOrAdmin, validateInput } from '../../middleware'
import * as TicketUserController from '../../controllers/ticket/user'

const router = Router()

// ticket users
router.get('/projects/:projectId/tickets/:ticketId/users',
  isAuthenticated,
  isActive,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  TicketUserController.getTicketUsers
)

router.post('/projects/:projectId/tickets/:ticketId/users',
  isAuthenticated,
  isActive,
  isAuthorized(['project_manager', 'admin', 'owner']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  TicketUserController.addUserToTicket
)

router.delete('/projects/:projectId/tickets/:ticketId/users/:userId',
  isAuthenticated,
  isActive,
  isAuthorized(['project_manager', 'admin', 'owner']),
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    body('userId').isInt().withMessage('User ID must be an integer'),
  ],
  validateInput,
  isProjectMemberOrAdmin,
  TicketUserController.removeUserFromTicket
)

export default router