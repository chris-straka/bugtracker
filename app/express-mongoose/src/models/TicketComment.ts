import { Schema, Document, model } from 'mongoose';
import { Ticket } from './Ticket';
import { User } from './User';

/** 
 * TODO: Remove this and nest it in the ticket.
 */
export interface TicketComment extends Document {
  owner: User['_id'];
  description: string;
  ticket_id: Ticket['_id'];
  created_at: Date;
}

// Define the schema for the TicketComments table
const ticketCommentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  ticket_id: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
  created_at: { type: Date, default: Date.now },
});

export const TicketCommentModel = model<TicketComment>('TicketComment', ticketCommentSchema);
