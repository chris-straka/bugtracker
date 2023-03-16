import { Router } from "express";
import { getTicket, getAllTicketsForProject, createTicket, deleteTicket } from "../../controllers/TicketController";

const router = Router()

router.get('/tickets', getAllTicketsForProject)
router.get('/tickets/:ticketId', getTicket)
router.post('/tickets/:ticketId', createTicket)
router.delete('/tickets/:ticketId', deleteTicket)

export default router 
