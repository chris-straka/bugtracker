import { Model } from "objection";
import { Ticket } from "./Ticket";
import { User } from "./User";

export class TicketHistory extends Model {
  static tableName = 'TicketHistory';

  readonly id!: number;
  ticket_id!: number;
  changer_id!: number;
  changed_fields!: string[];
  previous_values!: string[];
  new_values!: string[];
  date!: string;

  static relationMappings = () => ({
    ticket: {
      relation: Model.BelongsToOneRelation,
      modelClass: Ticket,
      join: {
        from: 'TicketHistory.ticket_id',
        to: 'Tickets.id',
      },
    },
    changer: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'TicketHistory.changer_id',
        to: 'Users.id',
      },
    },
  });

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['ticket_id', 'changer_id', 'changed_fields', 'previous_values', 'new_values'],

      properties: {
        id: { type: 'integer' },
        ticket_id: { type: 'integer' },
        changer_id: { type: 'integer' },
        changed_fields: { type: 'array', items: { type: 'string', maxLength: 100 } },
        previous_values: { type: 'array', items: { type: 'string', maxLength: 100 } },
        new_values: { type: 'array', items: { type: 'string', maxLength: 100 } },
        date: { type: 'string', format: 'date-time' },
      },
    };
  }
}