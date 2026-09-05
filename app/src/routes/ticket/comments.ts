import { Router } from 'express'
import { param, body } from 'express-validator'
import {
  isActive,
  isAuthenticated,
  isProjectMemberOrAdmin,
  projectExists,
  ticketExists,
  validateInput,
} from '../../middleware'
import * as TicketCommentController from '../../controllers/ticket/comments'

const router = Router()

// ticket comments
router.get(
  '/projects/:projectId/tickets/:ticketId/comments',
  isAuthenticated,
  isActive,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
  ],
  validateInput,
  projectExists,
  ticketExists,
  isProjectMemberOrAdmin,
  TicketCommentController.getTicketComments,
)

router.post(
  '/projects/:projectId/tickets/:ticketId/comments',
  isAuthenticated,
  isActive,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    body('comment')
      .isString()
      .isLength({ min: 1, max: 500 })
      .withMessage('Comment must be between 1 and 500 characters'),
  ],
  validateInput,
  projectExists,
  ticketExists,
  isProjectMemberOrAdmin,
  TicketCommentController.createTicketComment,
)

router.put(
  '/projects/:projectId/tickets/:ticketId/comments/:commentId',
  isAuthenticated,
  isActive,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    param('commentId').isInt().withMessage('Comment ID must be an integer'),
    body('comment')
      .isString()
      .isLength({ min: 1, max: 500 })
      .withMessage('Comment must be between 1 and 500 characters'),
  ],
  validateInput,
  projectExists,
  ticketExists,
  isProjectMemberOrAdmin,
  TicketCommentController.updateTicketComment,
)

router.delete(
  '/projects/:projectId/tickets/:ticketId/comments/:commentId',
  isAuthenticated,
  isActive,
  [
    param('projectId').isInt().withMessage('Project ID must be an integer'),
    param('ticketId').isInt().withMessage('Ticket ID must be an integer'),
    param('commentId').isInt().withMessage('Comment ID must be an integer'),
  ],
  validateInput,
  projectExists,
  ticketExists,
  isProjectMemberOrAdmin,
  TicketCommentController.deleteTicketComment,
)

export default router
