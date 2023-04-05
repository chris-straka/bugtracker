import { Router } from 'express'
import { isAuthenticated } from '../middleware'
import { 
  getTicketComments, createTicketComment, editTicketComment, deleteTicketComment
} from '../controllers/ticketComments' 

const router = Router()

router.get('/tickets/:ticketId/comments', isAuthenticated, getTicketComments)
router.post('/tickets/:ticketId/comments', isAuthenticated, createTicketComment)
router.put('/tickets/:ticketId/comments/:commentId', isAuthenticated, editTicketComment)
router.delete('/tickets/:ticketId/comments/:commentId', isAuthenticated, deleteTicketComment)

export default router
