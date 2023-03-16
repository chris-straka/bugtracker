import { Model } from "objection"
import { User } from "./User";
import { ProjectComment } from "./ProjectComment";

export class Project extends Model {
  static tableName = 'Projects';

  readonly id!: number;
  owner_id!: number;
  name!: string;
  description!: string;
  created_at!: string;
  last_modified_at!: string;

  static relationMappings = () => ({
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'Projects.owner_id',
        to: 'Users.id',
      },
    },
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'Projects.id',
        through: {
          from: 'ProjectUsers.project_id',
          to: 'ProjectUsers.user_id',
        },
        to: 'Users.id',
      },
    },
    comments: {
      relation: Model.HasManyRelation,
      modelClass: ProjectComment,
      join: {
        from: 'Projects.id',
        to: 'ProjectComments.project_id',
      },
    },
  });

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['owner_id', 'name', 'description'],

      properties: {
        id: { type: 'integer' },
        owner_id: { type: 'integer' },
        name: { type: 'string', maxLength: 100 },
        description: { type: 'string', maxLength: 500 },
        created_at: { type: 'string', format: 'date-time' },
        last_modified_at: { type: 'string', format: 'date-time' },
      },
    };
  }
}