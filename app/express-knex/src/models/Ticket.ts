import { Model } from "objection";
import { User } from "./User";
import { TicketComment } from "./TicketComment"
import { TicketHistory } from "./TicketHistory"

export class Ticket extends Model {
  static tableName = 'Tickets';

  readonly id!: number;
  owner_id!: number;
  name!: string;
  description!: string;
  priority!: number;
  type!: string;
  status!: string;
  created_at!: string;
  last_modified_at!: string;

  static relationMappings = () => ({
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'Tickets.owner_id',
        to: 'Users.id',
      },
    },
    assigned_users: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'Tickets.id',
        through: {
          from: 'TicketAssignments.ticket_id',
          to: 'TicketAssignments.developer_id',
        },
        to: 'Users.id',
      },
    },
    comments: {
      relation: Model.HasManyRelation,
      modelClass: TicketComment,
      join: {
        from: 'Tickets.id',
        to: 'TicketComments.ticket_id',
      },
    },
    history: {
      relation: Model.HasManyRelation,
      modelClass: TicketHistory,
      join: {
        from: 'Tickets.id',
        to: 'TicketHistory.ticket_id',
      },
    },
  });

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['owner_id', 'name', 'description', 'priority', 'type', 'status'],

      properties: {
        id: { type: 'integer' },
        owner_id: { type: 'integer' },
        name: { type: 'string', maxLength: 100 },
        description: { type: 'string', maxLength: 500 },
        priority: { type: 'integer' },
        type: { type: 'string', maxLength: 100 },
        status: { type: 'string', maxLength: 100 },
        created_at: { type: 'string', format: 'date-time' },
        last_modified_at: { type: 'string', format: 'date-time' },
      },
    };
  }
}