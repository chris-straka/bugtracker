import { Schema, Document, model } from 'mongoose';
import { Ticket } from '../ticket/ticket';
import { User } from '../user/user';

/** 
 * TODO: Remove this and nest it in the ticket. MAYBE
 */
export interface TicketHistory extends Document {
  ticket_id: Ticket['_id'];
  changer_id: User['_id'];
  changed_fields: string[];
  previous_values: string[];
  new_values: string[];
  date: Date;
}

// Define the schema for the TicketHistory table
const ticketHistorySchema = new Schema({
  ticket_id: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
  changer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  changed_fields: [{ type: String, required: true }], previous_values: [{ type: String, required: true }], new_values: [{ type: String, required: true }],
  date: { type: Date, default: Date.now },
});

export const TicketHistoryModel = model<TicketHistory>('TicketHistory', ticketHistorySchema);
