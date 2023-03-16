import { Model } from "objection"
import { User } from "./User";
import { Ticket } from "./Ticket";

export class TicketComment extends Model {
  static tableName = 'TicketComments';

  readonly id!: number;
  owner_id!: number;
  description!: string;
  ticket_id!: number;
  created_at!: string;

  static relationMappings = () => ({
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'TicketComments.owner_id',
        to: 'Users.id',
      },
    },
    ticket: {
      relation: Model.BelongsToOneRelation,
      modelClass: Ticket,
      join: {
        from: 'TicketComments.ticket_id',
        to: 'Tickets.id',
      },
    },
  });

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['owner_id', 'description', 'ticket_id'],

      properties: {
        id: { type: 'integer' },
        owner_id: { type: 'integer' },
        description: { type: 'string', maxLength: 500 },
        ticket_id: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
      },
    };
  }
}