import { Router } from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated'
import {
  getTicket, getTickets, createTicket,
  deleteTicket, editTicket, assignDevToTicket,
  removeDevFromTicket, 
} from '../controllers/tickets'

const router = Router()

router.get('/tickets', isAuthenticated, getTickets)
router.get('/tickets/:ticketId', isAuthenticated, getTicket)
router.post('/tickets/:ticketId', isAuthenticated, createTicket)

router.put('/tickets/:ticketId/users/:userId', isAuthenticated, assignDevToTicket)
router.delete('/tickets/:ticketId/users/:userId', isAuthenticated, removeDevFromTicket)

router.put('/tickets/:ticketId', isAuthenticated, editTicket)
router.delete('/tickets/:ticketId', isAuthenticated, deleteTicket)

export default router
