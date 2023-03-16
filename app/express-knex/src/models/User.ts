import { Model } from "objection"

export class User extends Model {
  static tableName = 'Users';

  readonly id!: number;
  name!: string;
  email!: string;
  password!: string;
  role!: 'admin' | 'project_manager' | 'developer' | 'contributor';
  created_at!: string;
  last_modified_at!: string;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'email', 'password', 'role'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', maxLength: 100 },
        email: { type: 'string', maxLength: 100 },
        password: { type: 'string', maxLength: 100 },
        role: { enum: ['admin', 'project_manager', 'developer', 'contributor'] },
        created_at: { type: 'string', format: 'date-time' },
        last_modified_at: { type: 'string', format: 'date-time' },
      },
    };
  }
}
