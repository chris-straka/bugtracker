import { Model } from "objection"
import { Project } from "./Project"; 
import { User } from "./User";

export class ProjectUser extends Model {
  static tableName = 'ProjectUsers';

  readonly project_id!: number;
  readonly user_id!: number;

  static get idColumn() {
    return ['project_id', 'user_id'];
  }

  static relationMappings = () => ({
    project: {
      relation: Model.BelongsToOneRelation,
      modelClass: Project,
      join: {
        from: 'ProjectUsers.project_id',
        to: 'Projects.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'ProjectUsers.user_id',
        to: 'Users.id',
      },
    },
  });
}