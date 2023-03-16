import { Schema, Document, model } from 'mongoose';
import { User } from './User';

export interface Ticket extends Document {
  owner_id: User['_id'];
  name: string;
  description: string;
  priority: number;
  type: string;
  status: string;
  created_at: Date;
  last_modified_at: Date;
}

const ticketSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  last_modified_at: { type: Date, default: Date.now },
});

export const TicketModel = model<Ticket>('Ticket', ticketSchema);
