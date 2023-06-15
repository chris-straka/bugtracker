import { Router } from 'express'
import { body, param } from 'express-validator'
import { isAuthenticated, isAuthorized, isProjectMemberOrAdmin, validateInput } from '../../middleware'
import * as TicketUserController from '../../controllers/ticket/user'

const router = Router()

// ticket users
router.get('/projects/:projectId/tickets/:ticketId/users',
  isAuthenticated,
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
  isAuthorized(['project_manager', 'admin']),
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
  isAuthorized(['project_manager', 'admin']),
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