import { Schema, Document, model } from 'mongoose';
import { Ticket } from './Ticket';
import { User } from './User';

/** 
 * TODO: Remove this and nest this in the Ticket.
 */
export interface TicketAssignment extends Document {
  ticket_id: Ticket['_id'];
  developer_id: User['_id'];
}

const ticketAssignmentSchema = new Schema({
  ticket_id: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
  developer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

export const TicketAssignmentModel = model<TicketAssignment>('TicketAssignment', ticketAssignmentSchema);
