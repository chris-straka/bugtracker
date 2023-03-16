import { Model } from "objection"
import { User } from "./User";
import { Project } from "./Project";

export class ProjectComment extends Model {
  static tableName = 'ProjectComments';

  readonly id!: number;
  owner_id!: number;
  project_id!: number;
  created_at!: string;
  description!: string;

  static relationMappings = () => ({
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'ProjectComments.owner_id',
        to: 'Users.id',
      },
    },
    project: {
      relation: Model.BelongsToOneRelation,
      modelClass: Project,
      join: {
        from: 'ProjectComments.project_id',
        to: 'Projects.id',
      },
    },
  });

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['owner_id', 'project_id', 'description'],

      properties: {
        id: { type: 'integer' },
        owner_id: { type: 'integer' },
        project_id: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
        description: { type: 'string', maxLength: 500 },
      },
    };
  }
}
