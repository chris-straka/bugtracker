import { Model } from "objection"
import { Ticket } from "./Ticket";
import { User } from "./User";

export class TicketAssignment extends Model {
  static tableName = 'TicketAssignments';

  readonly ticket_id!: number;
  readonly developer_id!: number;

  static get idColumn() {
    return ['ticket_id', 'developer_id'];
  }

  static relationMappings = () => ({
    ticket: {
      relation: Model.BelongsToOneRelation,
      modelClass: Ticket,
      join: {
        from: 'TicketAssignments.ticket_id',
        to: 'Tickets.id',
      },
    },
    developer: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'TicketAssignments.developer_id',
        to: 'Users.id',
      },
    },
  });
}